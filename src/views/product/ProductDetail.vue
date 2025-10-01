<script setup>
import { useToast } from "primevue/usetoast";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import ProductForm from "@/components/product/ProductForm.vue";
import { useProductStore } from "@/stores/product";

onMounted(() => {
  getData();
});

const useProduct = useProductStore();
const route = useRoute();
const toast = useToast();
const product = ref({
  id: null,
  code: null,
  slug: null,
  description: "",
  origin_price: "",
  status: true,
  category: "",
  image: "",
  variants: {},
});
const loading = ref(false);
const is404 = ref(false);
const breadcrumbHome = ref({ icon: "pi pi-home", route: "/" });
const breadcrumbItems = computed(() => [
  { label: "Danh sách sản phẩm", route: "/product" },
  { label: isEdit.value ? "Chi tiết" : "Tạo sản phẩm mới" },
]);

const isEdit = computed(() => !!(route?.params?.slug || route?.query?.id));

const getData = async () => {
  if (!isEdit.value) return;

  loading.value = true;
  is404.value = false;

  // Ưu tiên call theo id (query), nếu không có thì fallback sang id suy ra từ slug (server chấp nhận id)
  const payload = route.query.id ? Number(route.query.id) : route.params.slug;

  try {
    const res = await useProduct.getDetailProduct(payload);
    if (res.success) {
      product.value = res.data;
      loading.value = false;
    } else {
      // Kiểm tra nếu là lỗi 404, chuyển đến trang NotFound ngay lập tức
      if (res.error?.is404 || res.error?.response?.status === 404) {
        is404.value = true;
        // Delay ngắn để tránh flash content
        setTimeout(() => {
          window.location.replace("/404");
        }, 100);
        return;
      }

      loading.value = false;
      // Hiển thị toast cho các lỗi khác
      toast.add({
        severity: "error",
        summary: res?.message,
        detail: res?.error,
        life: 3000,
      });
    }
  } catch (error) {
    // Xử lý lỗi 404 từ catch block
    if (error?.is404 || error?.response?.status === 404) {
      is404.value = true;
      // Delay ngắn để tránh flash content
      setTimeout(() => {
        window.location.replace("/404");
      }, 100);
      return;
    }

    loading.value = false;
    // Hiển thị toast cho các lỗi khác
    toast.add({
      severity: "error",
      summary: "Có lỗi xảy ra",
      detail: error?.message,
      life: 3000,
    });
  }
};
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>Đang tải...</p>
      </div>
    </div>

    <!-- 404 State -->
    <div v-else-if="is404" class="not-found-container">
      <div class="not-found-content">
        <i class="pi pi-exclamation-triangle" style="font-size: 3rem; color: #f44336"></i>
        <h2>Đang chuyển hướng...</h2>
        <p>Sản phẩm không tồn tại</p>
      </div>
    </div>

    <!-- Normal Content -->
    <div v-else>
      <Breadcrumb
        :home="breadcrumbHome"
        :model="breadcrumbItems"
        class="mb-6"
        style="background-color: #ccb999"
      >
        <template #item="{ item, props }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a :href="href" v-bind="props.action" @click="navigate">
              <span :class="[item.icon, 'text-color']" />
              <span class="breadcrumb-link">{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else :href="item.url" :target="item.target" v-bind="props.action">
            <span class="breadcrumb-active">{{ item.label }}</span>
          </a>
        </template>
      </Breadcrumb>

      <product-form v-model="product" :is-edit="isEdit" />
    </div>

    <Toast />
  </div>
</template>

<style>
body,
html {
  background-color: #ccb999;
}

.breadcrumb-link {
  color: #000000; /* Màu link (ví dụ: xanh đậm) */
  font-weight: 500;
}

.breadcrumb-link:hover {
  color: #ffffff; /* Màu khi hover */
}

.breadcrumb-active {
  color: #5e1803; /* Màu active (ví dụ: xanh lá) */
  font-weight: 700;
}

/* Loading State */
.loading-container {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccb999;
}

.loading-spinner {
  text-align: center;
  color: #2c3e50;
}

.loading-spinner p {
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
}

/* 404 State */
.not-found-container {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccb999;
}

.not-found-content {
  text-align: center;
  color: #2c3e50;
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.not-found-content h2 {
  margin: 1rem 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.not-found-content p {
  margin: 0;
  font-size: 1rem;
  color: #5a6b5f;
}
</style>
