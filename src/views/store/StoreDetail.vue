<script setup>
import { StoreService } from '@/service/StoreService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import StoreForm from '@/components/store/StoreForm.vue';

onMounted(() => {
  StoreService.getStore(Number(route.params.id)).then((data) => (store.value = data));
});

const route = useRoute();
const toast = useToast();
const store = ref({});
const isEdit = ref(false);
const breadcrumbHome = ref({ icon: 'pi pi-home', route: '/' });
const breadcrumbItems = ref([{ label: 'Danh sách cửa hàng', route: '/store' }, { label: 'Chi tiết' }]);
</script>

<template>
  <div class="store_detail--wrapper">
    <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="mb-6">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span :class="[item.icon, 'text-color']" />
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>

    <div class="w-full flex justify-end gap-4 mb-4">
      <Button label="Hủy bỏ" severity="secondary" raised />
      <Button label="Lưu lại" raised />
    </div>

    <store-form v-model="store" />
  </div>
</template>

<style lang="scss">
// .store_detail--wrapper {
//   .p-timeline-event-opposite {
//     text-align: left !important;
//     min-width: max-content;
//     margin-left: -2rem;
//   }
// }
</style>
