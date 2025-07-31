<script setup>
import { CustomersService } from '@/service/CustomersService';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import CustomerForm from '@/components/customer/CustomerForm.vue';

onMounted(() => {
  CustomersService.getCustomer(Number(route.params.id)).then((data) => (customer.value = data));
});

const route = useRoute();
const customer = ref({});
const breadcrumbHome = ref({ icon: 'pi pi-home', route: '/' });
const breadcrumbItems = ref([{ label: 'Danh sách khách hàng', route: '/customer' }, { label: 'Chi tiết' }]);
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

    <customer-form v-model="customer" />
  </div>
</template>

