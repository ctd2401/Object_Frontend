<script setup>
import { useCategoryStore } from "@/stores/category";
import Skeleton from "primevue/skeleton";
import { useToast } from "primevue/usetoast";
import { onMounted, onUnmounted, ref, watch } from "vue";

onMounted(() => {
  getData();
});

const useCategory = useCategoryStore();
const toast = useToast();
const categories = ref([]);
const page = ref(1);
const totalPages = ref(1);
const pageSize = 12;
const keyword = ref("");
const loading = ref(false);
let searchTimer;

const getData = async () => {
  loading.value = true;
  const res = await useCategory.getCategories({
    page: page.value,
    page_size: pageSize,
    keyword: keyword.value.trim(),
  });
  if (res.success) {
    const list = Array.isArray(res.data) ? res.data : [];
    if (page.value === 1) categories.value = list;
    else categories.value = [...categories.value, ...list];
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

const loadMore = async () => {
  if (page.value >= totalPages.value) return;
  page.value += 1;
  await getData();
};

const onSearch = async () => {
  page.value = 1;
  await getData();
};

watch(
  () => keyword.value,
  () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      onSearch();
    }, 2000);
  }
);

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer);
});
</script>

<template>
  <div
    style="min-height: calc(100vh - var(--layout-header-height))"
    class="flex flex-col"
  >
    <div class="card" style="background-color: #ccb999">
      <div class="mb-4 flex gap-2">
        <InputText
          v-model="keyword"
          placeholder="Tìm kiếm danh mục"
          @keyup.enter="onSearch"
        />
        <Button
          label="Tìm"
          style="background-color: #788176"
          icon="pi pi-search"
          @click="onSearch"
        />
      </div>

      <!-- skeleton loading -->
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4"
      >
        <div v-for="n in pageSize" :key="n" class="flex flex-col gap-2">
          <Skeleton width="100%" height="200px" class="rounded-lg" />
          <Skeleton width="80%" height="20px" class="mx-auto" />
        </div>
      </div>

      <!-- nếu không có danh mục -->
      <div v-else-if="!categories.length" class="text-center py-10 text-gray-600">
        Không có danh mục nào
      </div>

      <!-- danh sách -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4"
      >
        <div v-for="item in categories" :key="item.id" class="flex flex-col gap-2">
          <div
            class="w-full aspect-square bg-surface-200 rounded-lg overflow-hidden flex items-center justify-center"
          >
            <img :src="item.image_url" alt="image" class="object-cover w-full h-full" />
          </div>
          <div class="text-center text-base md:text-lg font-medium line-clamp-2">
            {{ item.name }}
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-center" v-if="page < totalPages && !loading">
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
</style>
