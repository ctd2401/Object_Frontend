<script setup>
import { useCategoryStore } from '@/stores/category';
import { onMounted, ref, watch } from 'vue';
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});
const useCategory = useCategoryStore();

const emit = defineEmits(['update:modelValue']);
onMounted(() => {
  useCategory.getCategories();
});
const typies = useCategory.typies;
// Local reactive copy
const product = ref();
const src = ref();
const file = ref();
// Khi props thay đổi từ ngoài
watch(
  () => props.modelValue,
  (newVal) => {
    product.value = { status: false, ...newVal };
  },
  { immediate: true, deep: true }
);

// Khi local product thay đổi, emit ra ngoài
watch(
  product,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      emit('update:modelValue', newVal);
    }
  },
  { deep: true }
);

const mapStatus = (code) => {
  const result = {
    false: { label: 'Hết hàng' },
    true: { label: 'Còn hàng' }
  };
  return result[code];
};

function onFileSelect(event) {
  file.value = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e.target.result;
  };
  console.log(src.value);
  console.log(file);

  reader.readAsDataURL(file.value);
}
const removeFile = () => {
  file.value = null;
  src.value = null;
  product.value.image = '';
};
</script>

<template>
  <div class="grid grid-cols-10 gap-4">
    <div class="card col-span-7 !mb-0">
      <div class="flex flex-col gap-4 w-full">
        <div class="flex items-center justify-between">
          <p class="font-semibold text-xl">Product</p>
          <label for="status-switch" :class="['flex items-center gap-3 font-medium', product?.status ? 'text-green-500' : 'text-red-500']">
            {{ mapStatus(product?.status)?.label }}
            <ToggleSwitch id="status-switch" v-model="product.status" />
          </label>
        </div>
        <div class="flex flex-col gap-1">
          <label for="name_food">Tên món ăn</label>
          <InputText id="name_food" v-model="product.name_food" type="text" placeholder="Nhập tên món ăn" />
        </div>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex flex-col gap-1 w-full">
            <label for="price">Giá</label>
            <InputText id="price" v-model="product.price" type="text" placeholder="Nhập giá" />
          </div>
          <div class="flex flex-col gap-1 w-full">
            <label for="quantity">Số lượng</label>
            <InputText id="quantity" v-model="product.quantity" type="text" placeholder="Nhập số lượng" />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label for="type" class="block font-bold mb-3">Loại món ăn</label>
          <Select id="type" v-model="product.type" :options="typies" optionLabel="label" placeholder="Lựa chọn loại món ăn" fluid></Select>
        </div>
      </div>
    </div>
    <div class="card col-span-3 mb-0">
      <div class="border shadow-md rounded-xl w-full min-h-[260px] flex justify-center items-center relative">
        <!-- <FileUpload v-if="!src && !product?.image" accept="image/*" /> -->
        <FileUpload
          v-if="!src && !product?.image"
          mode="basic"
          chooseLabel="Chọn ảnh cửa hàng"
          class="p-button-outlined self-center"
          accept="image/*"
          customUpload
          auto
          @select="onFileSelect"
        />

        <template v-else>
          <img :src="src || product?.image" alt="Image" class="rounded-xl" />
          <Button icon="pi pi-times" rounded outlined severity="danger" class="!absolute top-4 right-4" @click="removeFile"></Button>
        </template>
      </div>
      <FileUpload
        v-if="src || product?.image"
        mode="basic"
        chooseLabel="Thay đổi ảnh"
        class="p-button-outlined self-center mt-4"
        accept="image/*"
        customUpload
        auto
        @select="onFileSelect"
      />
    </div>
  </div>
</template>
