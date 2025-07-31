<script setup>
import { BannerService } from '@/service/BannerService';
import { onMounted, ref } from 'vue';

const banners = ref(null);
const picklistBanners = ref(null);
const orderlistBanners = ref(null);
const options = ref(['list', 'grid']);
const layout = ref('list');

onMounted(() => {
  BannerService.getBanners().then((data) => {
    banners.value = data.slice(0, 6);
    picklistBanners.value = [data, []];
    orderlistBanners.value = data;
  });
});
</script>
<template>
  <div class="card">
    <div class="font-semibold text-xl">Banner Managerment</div>
    <DataView :value="banners" :layout="layout">
      <template #header>
        <div class="flex justify-end">
          <SelectButton v-model="layout" :options="options" :allowEmpty="false">
            <template #option="{ option }">
              <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
            </template>
          </SelectButton>
        </div>
      </template>

      <template #list="slotProps">
        <div class="flex flex-col">
          <div v-for="(item, index) in slotProps.items" :key="index">
            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface': index !== 0 }">
              <div class="md:w-80 relative">
                <img class="block xl:block mx-auto rounded w-full" :src="item.image" :alt="item.name" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #grid="slotProps">
        <div class="grid grid-cols-12 gap-4">
          <div v-for="(item, index) in slotProps.items" :key="index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
              <div class="bg-surface-50 flex justify-center rounded p-4">
                <div class="relative mx-auto">
                  <img class="rounded w-full" :src="item.image" :alt="item.name" style="max-width: 300px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>
