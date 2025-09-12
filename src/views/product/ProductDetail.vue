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
const breadcrumbHome = ref({ icon: "pi pi-home", route: "/" });
const breadcrumbItems = computed(() => [
  { label: "Danh sách sản phẩm", route: "/product" },
  { label: isEdit.value ? "Chi tiết" : "Tạo sản phẩm mới" },
]);

const isEdit = computed(() => !!(route?.params?.slug || route?.query?.id));

const getData = async () => {
  if (!isEdit.value) return;
  // Ưu tiên call theo id (query), nếu không có thì fallback sang id suy ra từ slug (server chấp nhận id)
  const payload = route.query.id ? Number(route.query.id) : route.params.slug;
  const res = await useProduct.getDetailProduct(payload);
  if (res.success) product.value = res.data;
  else
    toast.add({
      severity: "error",
      summary: res?.message,
      detail: res?.error,
      life: 3000,
    });
};
</script>

<template>
  <div>
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
</style>
