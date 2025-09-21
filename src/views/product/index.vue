<script setup>
import { useCategoryStore } from '@/stores/category';
import { useProductStore } from '@/stores/product';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const useProduct = useProductStore();
const useCategory = useCategoryStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const products = ref([]);
const page = ref(1);
const totalPages = ref(1);
const pageSize = 12;
const keyword = ref('');
const loading = ref(false); // trạng thái loading
const currentCategory = ref('');
let searchTimer;

// Computed để lấy tên danh mục từ ID
const categoryName = computed(() => {
  if (!currentCategory.value) return '';
  const category = useCategory.typies.find((cat) => cat.id == currentCategory.value);
  return category ? category.label : currentCategory.value;
});

const getData = async () => {
  loading.value = true;
  const res = await useProduct.getProducts({
    page: page.value,
    page_size: pageSize,
    keyword: keyword.value.trim(),
    category: route.query.category || '',
    raw: true
  });
  if (res.success) {
    if (page.value === 1) products.value = res.data || [];
    else products.value = [...products.value, ...(res.data || [])];
    totalPages.value = res?.meta?.total_pages || 1;
  } else {
    // Kiểm tra nếu là lỗi 404, chuyển đến trang NotFound ngay lập tức
    if (res.error?.is404 || res.error?.response?.status === 404) {
      window.location.replace('/404');
      return;
    }

    // Hiển thị toast cho các lỗi khác
    toast.add({
      severity: 'error',
      summary: res?.message,
      detail: res?.error,
      life: 3000
    });
  }
  loading.value = false;
};

const goDetail = (item) => {
  if (item.slug) return router.push(`/product/${item.slug}?id=${item.id}`);
  return router.push(`/product/${item.id}?id=${item.id}`);
};

const formatVND = (n) => (n || n === 0 ? Number(n).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '');

const loadMore = async () => {
  if (page.value >= totalPages.value) return;
  page.value += 1;
  await getData();
};

const onSearch = async () => {
  page.value = 1;
  const query = { keyword: keyword.value || undefined };
  if (route.query.category) {
    query.category = route.query.category;
  }
  router.replace({ path: '/product', query });
  await getData();
};

const clearCategoryFilter = () => {
  currentCategory.value = '';
  router.push({ path: '/category' });
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
  // Nếu có category từ URL, xóa keyword để đảm bảo ô tìm kiếm trống
  if (route.query.category) {
    currentCategory.value = String(route.query.category);
    keyword.value = ''; // Xóa ô tìm kiếm khi chọn danh mục
    // Load danh sách danh mục để có thể hiển thị tên
    await useCategory.getCategories({ page: 1, page_size: 100 });
  } else if (route.query.keyword) {
    keyword.value = String(route.query.keyword);
  }

  await getData();
});

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer);
});
</script>

<template>
  <div style="min-height: calc(100vh - var(--layout-header-height))" class="flex flex-col body">
    <div style="background-color: #ccb999" class="card">
      <!-- Hiển thị danh mục hiện tại -->
      <div v-if="currentCategory" class="mb-4 flex items-center justify-between bg-white/20 rounded-lg p-3">
        <div class="flex items-center gap-2">
          <i class="pi pi-tag text-lg"></i>
          <span class="text-lg font-medium">Danh mục: {{ categoryName }}</span>
        </div>
        <Button label="Xóa bộ lọc" icon="pi pi-times" severity="secondary" size="small" @click="clearCategoryFilter" />
      </div>

      <!-- Ô tìm kiếm -->
      <div class="mb-4 flex gap-2">
        <InputText v-model="keyword" placeholder="Tìm kiếm sản phẩm theo tên/mã sản phẩm" @keyup.enter="onSearch" />
        <Button label="Tìm" style="background-color: #788176" icon="pi pi-search" @click="onSearch" />
      </div>

      <!-- Skeleton Loading -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <div v-for="n in pageSize" :key="n" class="flex flex-col gap-2 animate-pulse">
          <div class="w-full aspect-square bg-gray-300 rounded-lg"></div>
          <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div class="h-4 bg-gray-400 rounded w-1/2 mx-auto"></div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="!products.length" class="text-center py-8 text-gray-600 text-lg">Không có sản phẩm nào</div>

      <!-- Grid sản phẩm -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <button v-for="item in products" :key="item.id" class="flex flex-col gap-2 text-left" @click="goDetail(item)">
          <div class="w-full aspect-square bg-surface-200 rounded-lg overflow-hidden flex items-center justify-center">
            <img :src="item.image_url || item.image" alt="image" class="object-cover w-full h-full" />
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

<style scoped>
/* body,
html {
  background-color: #ccb999;
} */
text_money {
  background-color: #788176;
}
</style>
