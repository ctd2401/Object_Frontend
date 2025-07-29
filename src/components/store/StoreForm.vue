<template>
  <div class="grid grid-cols-10 gap-4">
    <div class="card col-span-7 !mb-0">
      <div class="flex flex-col gap-4 w-full">
        <div class=" flex items-center justify-between">
          <p class="font-semibold text-xl">Advanced</p>
          <label for="status-switch"
            :class="['flex items-center gap-3 font-medium', store?.status ? 'text-green-500' : 'text-red-500']">

            {{ mapStatus(store?.status)?.label }}
            <ToggleSwitch id="status-switch" v-model="store.status" />
          </label>
        </div>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex flex-col gap-1 w-full">
            <label for="store-code">Mã cửa hàng</label>
            <InputText id="store-code" v-model="store.store_code" type="text" />
          </div>
          <div class="flex flex-col gap-1 w-full">
            <label for="phone-number">Số điện thoại</label>
            <InputText id="phone-number" v-model="store.phone_number" type="text" />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label for="store-name">Tên cửa hàng</label>
          <InputText id="store-name" v-model="store.store_name" type="text" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="address">Address</label>
          <Textarea id="address" v-model="store.address" rows="4" />
        </div>
      </div>
      <div class="w-full h-[1px] bg-gray-300 my-4"></div>
      <div>
        <div class="font-semibold text-xl">Cấu hình ca trực</div>
        <div class="w-full mt-2 ">
          <div v-for="(item, index) in store?.shift_config || []" :key="index"
            class="flex gap-1 items-end pb-2 mb-2 border-b border-b-gray-300">
            <div class="w-1/4">
              <p class="mb-1">Tên ca trực</p>
              <InputText v-model="item.name" type="text" class="w-full" />
            </div>
            <div class="w-1/4">
              <p class="mb-1">Mã ca trực</p>
              <InputText v-model="item.code" type="text" class="w-full" />
            </div>
            <div class="w-1/4">
              <p class="mb-1">Thời gian bắt đầu</p>
              <DatePicker v-model="item.start" timeOnly fluid />
            </div>
            <div class="w-1/4">
              <p class="mb-1">Thời gian kết thúc</p>
              <DatePicker v-model="item.end" timeOnly fluid />
            </div>

            <Button icon="pi pi-trash" severity="danger" rounded variant="text" aria-label="Cancel" size="normal"
              @click="removeShiftConfig(index)" />
          </div>
          <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" fluid @click="addShiftConfig" />

        </div>
      </div>
    </div>
    <div class="card col-span-3 mb-0">
      <img :src="store?.logo" alt="" class="w-full" />
      <div class="mt-16">
        <Timeline :value="store?.shift_config || []">
          <template #opposite="slotProps">
            <small class="text-muted-color">{{ slotProps?.item?.start ? moment(slotProps.item.start).format('HH:mm')
              : ''
            }} -
              {{ slotProps?.item?.end ? moment(slotProps.item.end).format('HH:mm') : ''
              }}</small>
          </template>
          <template #content="slotProps">
            {{ slotProps?.item?.name }}
          </template>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from 'moment';
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['update:modelValue']);

// Local reactive copy
const store = ref();

// Khi props thay đổi từ ngoài
watch(
  () => props.modelValue,
  (newVal) => {
    store.value = { status: false, ...newVal };
    if (!store.value?.shift_config || !store.value.shift_config.length) {
      store.value.shift_config = [{
        name: '',
        code: '',
        start: null,
        end: null
      }]
    }
  },
  { immediate: true, deep: true }
);

// Khi local store thay đổi, emit ra ngoài
watch(
  store,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      emit('update:modelValue', newVal);
    }
  },
  { deep: true }
);

const addShiftConfig = () => {
  store.value.shift_config.push({
    name: '',
    code: '',
    start: null,
    end: null
  });
};

const removeShiftConfig = (index) => {
  store.value.shift_config = [...store.value.shift_config.slice(0, index), ...store.value.shift_config.slice(index + 1, store.value.shift_config.length)]
}

const mapStatus = (code) => {
  const resull = {
    false: { label: 'Đã dừng hoạt động' },
    true: { label: 'Đang hoạt động' },
  }
  return resull[code]
}
</script>
