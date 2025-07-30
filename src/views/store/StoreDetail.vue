<script setup>
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import StoreForm from '@/components/store/StoreForm.vue';
import { useStoreManageStore } from '@/stores/store';

onMounted(() => {
  getData();
});

const useStore = useStoreManageStore();
const route = useRoute();
const toast = useToast();
const store = ref({
  store_code: '',
  store_name: '',
  address: '',
  phone_number: '',
  status: true,
  logo: '',
  shift_config: [],
  extra_data: {}
});
const breadcrumbHome = ref({ icon: 'pi pi-home', route: '/' });
const breadcrumbItems = computed(() => [{ label: 'Danh sách cửa hàng', route: '/store' }, { label: isEdit.value ? 'Chi tiết' : 'Tạo cửa hàng' }]);

const isEdit = computed(() => !!route?.params?.id);

const getData = async () => {
  if (!isEdit.value) return;
  const res = await useStore.getDetailStore(Number(route.params.id));
  if (res.success) store.value = res.data;
  else toast.add({ severity: 'error', summary: res?.message, detail: res?.error, life: 3000 });
};
</script>

<template>
  <div>
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

    <store-form v-model="store" :is-edit="isEdit" />

    <Toast />
  </div>
</template>
