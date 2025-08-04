<script setup>
import moment from 'moment';
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update:modelValue']);

// Local reactive copy
const store = ref();
const src = ref();
const file = ref();

// Khi props thay đổi từ ngoài
watch(
  () => props.modelValue,
  (newVal) => {
    store.value = { status: false, ...newVal };
    if (!store.value?.shift_config || !store.value.shift_config.length) {
      store.value.shift_config = [
        {
          name: '',
          code: '',
          start: new Date(),
          end: new Date()
        }
      ];
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
    start: new Date(),
    end: new Date()
  });
};

const removeShiftConfig = (index) => {
  store.value.shift_config = [...store.value.shift_config.slice(0, index), ...store.value.shift_config.slice(index + 1, store.value.shift_config.length)];
};

const mapStatus = (code) => {
  const resull = {
    false: { label: 'Đã dừng hoạt động' },
    true: { label: 'Đang hoạt động' }
  };
  return resull[code];
};

function onFileSelect(event) {
  file.value = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e.target.result;
  };

  reader.readAsDataURL(file.value);
}

const removeFile = () => {
  file.value = null;
  src.value = null;
  store.value.logo = '';
};
</script>

<template>
  <div class="grid grid-cols-10 gap-4">
    <div class="card col-span-7 !mb-0">
      <div class="flex flex-col gap-4 w-full">
        <div class="flex items-center justify-between">
          <p class="font-semibold text-xl">Advanced</p>
          <label for="status-switch" :class="['flex items-center gap-3 font-medium', store?.status ? 'text-green-500' : 'text-red-500']">
            {{ mapStatus(store?.status)?.label }}
            <ToggleSwitch id="status-switch" v-model="store.status" />
          </label>
        </div>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex flex-col gap-1 w-full">
            <label for="store-code">Mã cửa hàng</label>
            <InputText id="store-code" v-model="store.store_code" type="text" placeholder="Nhập mã cửa hàng" />
          </div>
          <div class="flex flex-col gap-1 w-full">
            <label for="phone-number">Số điện thoại</label>
            <InputText id="phone-number" v-model="store.phone_number" type="text" placeholder="Nhập số điện thoại" />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label for="store-name">Tên cửa hàng</label>
          <InputText id="store-name" v-model="store.store_name" type="text" placeholder="Nhập tên cửa hàng" />
        </div>

        <div class="flex flex-col gap-1">
          <label for="address">Address</label>
          <Textarea id="address" v-model="store.address" rows="4" placeholder="Nhập địa chỉ" />
        </div>
      </div>
      <div class="w-full h-[1px] bg-gray-300 my-4"></div>
      <div>
        <div class="font-semibold text-xl">Cấu hình ca làm việc</div>
        <div class="w-full mt-2">
          <div v-for="(item, index) in store?.shift_config || []" :key="index" class="flex gap-1 items-end pb-2 mb-2 border-b border-b-gray-300">
            <div class="w-1/4">
              <p class="mb-1">Tên ca làm việc</p>
              <InputText v-model="item.name" type="text" placeholder="Nhập tên ca" class="w-full" />
            </div>
            <div class="w-1/4">
              <p class="mb-1">Mã ca làm việc</p>
              <InputText v-model="item.code" type="text" placeholder="Nhập mã ca" class="w-full" />
            </div>
            <div class="w-1/4">
              <p class="mb-1">Thời gian bắt đầu</p>
              <DatePicker v-model="item.start" placeholder="Chọn giờ bắt đầu" timeOnly fluid />
            </div>
            <div class="w-1/4">
              <p class="mb-1">Thời gian kết thúc</p>
              <DatePicker v-model="item.end" placeholder="Chọn giờ kết thúc" timeOnly fluid />
            </div>

            <Button icon="pi pi-trash" severity="danger" rounded variant="text" aria-label="Cancel" size="normal" @click="removeShiftConfig(index)" />
          </div>
          <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" fluid @click="addShiftConfig" />
        </div>
      </div>
    </div>
    <div class="card col-span-3 mb-0">
      <div class="border shadow-md rounded-xl w-full min-h-[260px] flex justify-center items-center relative">
        <FileUpload v-if="!src && !store?.logo" mode="basic" chooseLabel="Chọn ảnh cửa hàng" class="p-button-outlined self-center" accept="image/*" customUpload auto @select="onFileSelect" />

        <template v-else>
          <img :src="src || store?.logo" alt="Image" class="rounded-xl w-full" />
          <Button icon="pi pi-times" rounded outlined severity="danger" class="!absolute top-4 right-4" @click="removeFile"></Button>
        </template>
      </div>
      <FileUpload v-if="src || store?.logo" mode="basic" chooseLabel="Thay đổi ảnh" class="p-button-outlined self-center mt-4" accept="image/*" customUpload auto @select="onFileSelect" />
      <div class="mt-16">
        <Timeline :value="store?.shift_config || []">
          <template #opposite="slotProps">
            <small class="text-muted-color">{{ slotProps?.item?.start ? moment(slotProps.item.start).format('HH:mm') : '' }} - {{ slotProps?.item?.end ? moment(slotProps.item.end).format('HH:mm') : '' }}</small>
          </template>
          <template #content="slotProps">
            {{ slotProps?.item?.name }}
          </template>
        </Timeline>
      </div>
    </div>
  </div>
</template>
