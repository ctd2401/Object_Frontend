<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['update:modelValue']);

// Local reactive copy
const customer = ref();

// Khi props thay đổi từ ngoài
watch(
  () => props.modelValue,
  (newVal) => {
    customer.value = { ...newVal };
  },
  { immediate: true, deep: true }
);

// Khi local customer thay đổi, emit ra ngoài
watch(
  customer,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      emit('update:modelValue', newVal);
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="grid grid-cols-10 gap-4">
    <div class="card col-span-10 !mb-0">
      <div class="flex flex-col gap-4 w-full">
        <div class="flex items-center justify-between">
          <p class="font-semibold text-xl">Advanced</p>
        </div>
        <div class="flex flex-col gap-1 w-full">
          <label for="customer_name">Tên khách hàng</label>
          <InputText id="customer_name" v-model="customer.customer_name" type="text" />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <label for="phone_number">Số điện thoại</label>
          <InputText id="phone_number" v-model="customer.phone_number" type="text" />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <label for="point">Điểm</label>
          <InputText id="point" v-model="customer.point" type="text" readonly />
        </div>
      </div>
    </div>
  </div>
</template>
