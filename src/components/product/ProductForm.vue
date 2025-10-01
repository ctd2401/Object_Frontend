<script setup>
import { useCategoryStore } from "@/stores/category";
import { computed, onMounted, ref, watch } from "vue";

import defaultImageUrl from "@/assets/img/default/obj.jpg";

const defaultImage = defaultImageUrl;
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});
const useCategory = useCategoryStore();

const emit = defineEmits(["update:modelValue"]);
onMounted(() => {
  useCategory.getCategories();
});
const typies = useCategory.typies;

// Local reactive copy
const product = ref();
const src = ref();
const file = ref();
const selectedImage = ref("");

watch(
  () => props.modelValue,
  (newVal) => {
    product.value = { status: false, ...newVal };
  },
  { immediate: true, deep: true }
);

watch(
  product,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      emit("update:modelValue", newVal);
    }
  },
  { deep: true }
);

const mapStatus = (code) => {
  const result = {
    false: { label: "Hết hàng" },
    true: { label: "Còn hàng" },
  };
  return result[code];
};

function onFileSelect(event) {
  file.value = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e.target.result;
  };
  reader.readAsDataURL(file.value);
}

const removeFile = () => {
  file.value = null;
  src.value = null;
  product.value.image = "";
};

// 👉 Computed final price
const finalPrice = computed(() => {
  if (!product.value) return 0;
  let price = props.modelValue.origin_price || 0;
  Object.values(product.value.variants || {}).forEach((arr) => {
    arr.forEach((opt) => {
      if (opt.clicked) {
        price += opt.price_diff || 0;
      }
    });
  });
  return price;
});

// 👉 Display price with locale currency format
const displayPrice = computed(() => {
  try {
    return finalPrice.value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  } catch (e) {
    return `${finalPrice.value} VND`;
  }
});

// 👉 Cập nhật ảnh theo variant chọn
function updateImage() {
  if (!product.value) return;
  let image = props.modelValue.image;
  Object.values(product.value.variants || {}).forEach((arr) => {
    arr.forEach((opt) => {
      if (opt.clicked && opt.image) {
        image = opt.image;
      }
    });
  });
  product.value.image = image;
  selectedImage.value = "";
}

const images = computed(() => {
  if (!product.value) return [];
  const list = [];

  // Luôn thêm ảnh gốc đầu tiên
  if (props.modelValue.image) {
    list.push(props.modelValue.image);
  }

  // Thêm ảnh từ các variant được chọn
  Object.values(product.value.variants || {}).forEach((arr) => {
    arr.forEach((opt) => {
      if (opt.clicked && opt.image) {
        list.push(opt.image);
      }
    });
  });

  return list;
});

const mainImage = computed(() => {
  if (!product.value) return "";
  return selectedImage.value || product.value.image || images.value[0] || "";
});

// 👉 Gộp mô tả ngắn và chi tiết thành một nội dung hiển thị
const combinedDescription = computed(() => {
  if (!product.value) return "";
  const parts = [];
  if (product.value.short_description) parts.push(product.value.short_description);
  if (product.value.description_detail) parts.push(product.value.description_detail);
  if (!parts.length && product.value.description) parts.push(product.value.description);
  return parts.join("\n\n");
});
</script>

<template>
  <div class="grid grid-cols-10 gap-4 back_gr">
    <div class="card col-span-7 !mb-0">
      <div class="flex flex-col gap-4 w-full">
        <div class="flex items-center justify-between">
          <div :class="['s1 flex items-center gap-2 font-medium']">
            <span
              class="text-sm px-2 py-1 rounded-full"
              :class="
                product?.available
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              {{ mapStatus(product?.available)?.label }}
            </span>
          </div>
          <div class="s1 font-semibold text_money">{{ displayPrice }}</div>
        </div>

        <div class="s1 flex flex-col gap-1">
          <label for="name" class="text-sm text-surface-500">Tên sản phẩm</label>
          <div>{{ product?.name }}</div>
        </div>
        <!-- <div class="s1 flex flex-col gap-1">
          <label for="category" class="text-sm text-surface-500">Danh mục</label>
          <div>{{ product?.category }}</div>
        </div> -->
        <div class="s1 flex flex-col gap-1">
          <label for="description" class="text-sm text-surface-500">Mô tả</label>
          <div class="border rounded-md p-3 bg-surface-0 max-h-[220px] overflow-auto">
            {{ combinedDescription }}
          </div>
        </div>

        <div class="border-t border-surface-200 my-2"></div>

        <div
          v-if="product?.variants && Object.keys(product.variants).length"
          class="s1 flex flex-col gap-3"
        >
          <p class="font-medium">Tùy chọn thuộc tính</p>
          <div
            v-for="(value, key) in product.variants"
            :key="key"
            class="flex flex-col gap-2"
          >
            <label :for="key" class="text-sm text-surface-500">{{ key }}</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(v, k) in value"
                :key="k"
                :class="[
                  'px-3 py-1 rounded-lg border transition-colors',
                  v.available === false
                    ? 'bg-gray-300 text-gray-500 border-surface-200 opacity-60 cursor-not-allowed'
                    : v.clicked
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-surface-0 border-surface-200 hover:bg-surface-100',
                ]"
                :disabled="v.available === false"
                @click="
                  v.available === false
                    ? null
                    : (v.clicked
                        ? (v.clicked = false)
                        : (value.forEach((item) => (item.clicked = false)),
                          (v.clicked = true)),
                      updateImage())
                "
              >
                {{ v.name }}
                <span
                  v-if="v.price_diff !== undefined && v.price_diff !== 0"
                  class="ml-2 text-xs opacity-80"
                >
                  {{ v.price_diff > 0 ? "+" : "-"
                  }}{{
                    Math.abs(v.price_diff).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                  }}
                </span>
                <span v-if="v.available === false" class="ml-2 text-xs">(Hết hàng)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card col-span-3 mb-0">
      <div
        class="w-full flex flex-col gap-3"
        :style="{ height: `calc(100vh - var(--layout-header-height))` }"
      >
        <div
          class="border shadow-md rounded-xl w-full min-h-[260px] flex justify-center items-center p-2 bg-surface-0"
        >
          <img
            :src="mainImage || defaultImage"
            alt="Image"
            class="rounded-xl max-h-[260px] object-contain"
            @error="
              (e) => {
                e.target.src = defaultImage;
              }
            "
          />
        </div>
        <div v-if="images.length > 1" class="flex-1 overflow-auto">
          <div class="grid grid-cols-3 gap-2 min-w-full">
            <button
              v-for="(img, idx) in images"
              :key="idx"
              class="border rounded-lg overflow-hidden aspect-square flex items-center justify-center"
              :class="img === mainImage ? 'ring-2 ring-primary' : ''"
              @click="selectedImage = img"
            >
              <img
                :src="img || defaultImage"
                alt="thumb"
                class="object-contain max-h-full"
                @error="
                  (e) => {
                    e.target.src = defaultImage;
                  }
                "
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.s1 {
  font-size: 20px;
}
.gray {
  background-color: gray;
  width: 40px;
  height: 40px;
}
.green {
  width: 40px;
  height: 40px;
  background-color: green;
}
text_money {
  background-color: #788176;
}
back_gr {
  background-color: #ccb999;
}
</style>
