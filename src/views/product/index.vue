<script setup>
import { useProductStore } from "@/stores/product";
import { useToast } from "primevue/usetoast";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const useProduct = useProductStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const products = ref([]);
const page = ref(1);
const totalPages = ref(1);
const pageSize = 12;
const keyword = ref("");
const loading = ref(false); // trạng thái loading
let searchTimer;

const getData = async () => {
  loading.value = true;
  const res = await useProduct.getProducts({
    page: page.value,
    page_size: pageSize,
    keyword: keyword.value.trim(),
  });
  if (res.success) {
    if (page.value === 1) products.value = res.data || [];
    else products.value = [...products.value, ...(res.data || [])];
    totalPages.value = res?.meta?.total_pages || 1;
  } else {
    toast.add({
      severity: "error",
      summary: res?.message,
      detail: res?.error,
      life: 3000,
    });
  }
  loading.value = false;
};

const goDetail = (item) => {
  if (item.slug) return router.push(`/product/${item.slug}?id=${item.id}`);
  return router.push(`/product/${item.id}?id=${item.id}`);
};

const formatVND = (n) =>
  n || n === 0
    ? Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "";

const loadMore = async () => {
  if (page.value >= totalPages.value) return;
  page.value += 1;
  await getData();
};

const onSearch = async () => {
  page.value = 1;
  router.replace({ path: "/product", query: { keyword: keyword.value || undefined } });
  await getData();
};

watch(
  () => keyword.value,
  () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      onSearch();
    }, 2000); // debounce 2s
  }
);

onMounted(async () => {
  if (route.query.keyword) keyword.value = String(route.query.keyword);
  await getData();
});

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer);
});
</script>

<template>
  <div
    style="min-height: calc(100vh - var(--layout-header-height))"
    class="flex flex-col body"
  >
    <div class="card;background-color:#CCB999">
      <!-- Ô tìm kiếm -->
      <div class="mb-4 flex gap-2">
        <InputText
          v-model="keyword"
          placeholder="Tìm kiếm sản phẩm theo tên/mã sản phẩm"
          @keyup.enter="onSearch"
        />
        <Button
          label="Tìm"
          style="background-color: #788176"
          icon="pi pi-search"
          @click="onSearch"
        />
      </div>

      <!-- Skeleton Loading -->
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4"
      >
        <div v-for="n in pageSize" :key="n" class="flex flex-col gap-2 animate-pulse">
          <div class="w-full aspect-square bg-gray-300 rounded-lg"></div>
          <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div class="h-4 bg-gray-400 rounded w-1/2 mx-auto"></div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!products.length" class="text-center py-8 text-gray-600 text-lg">
        Không có sản phẩm nào
      </div>

      <!-- Grid sản phẩm -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4"
      >
        <button
          v-for="item in products"
          :key="item.id"
          class="flex flex-col gap-2 text-left"
          @click="goDetail(item)"
        >
          <div
            class="w-full aspect-square bg-surface-200 rounded-lg overflow-hidden flex items-center justify-center"
          >
            <img
              :src="item.image_url || item.image"
              alt="image"
              class="object-cover w-full h-full"
            />
          </div>
          <div class="text-center text-base md:text-lg font-medium line-clamp-2">
            {{ item.name || item.name_food }}
          </div>
          <div class="text-center text-sm md:text-base font-semibold text_money">
            {{ formatVND(item.origin_price || item.price) }}
          </div>
        </button>
      </div>

      <!-- Load More -->
      <div class="mt-4 flex justify-center" v-if="!loading && page < totalPages">
        <Button label="Xem thêm" @click="loadMore" />
      </div>
    </div>
  </div>
</template>

<style>
body,
html {
  background-color: #ccb999;
}
text_money {
  background-color: #788176;
}
</style>
