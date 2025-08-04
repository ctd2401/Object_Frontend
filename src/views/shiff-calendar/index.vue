<template>
  <div>
    <div class="w-full flex justify-end gap-4 mb-4">
      <Button label="Tuần trước" severity="secondary" raised />
      <Button label="Hôm nay" severity="secondary" raised />
      <Button icon="pi pi-angle-right" iconPos="right" label="Tuần sau" severity="secondary" raised />
    </div>
    <div class="card">
      <div class="font-semibold text-xl mb-4">Lịch trực tuần này</div>

      <table class="w-full">
        <thead>
          <tr class="border bg-gray-300">
            <th class="w-[12.5%]"></th>
            <th v-for="(day, index) in day_of_week" :key="index" scope="col" class="w-[12.5%]">{{ day.shortName }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in userData?.parentStore?.shift_config || []" :key="index" class="border-b">
            <td>
              <div class="min-h-20 flex flex-col items-center justify-center gap-2">
                <span>{{ item?.name }}</span>
                <span>Code: {{ item?.code }}</span>
              </div>
            </td>
            <td v-for="(day, indexDay) in day_of_week" :key="index + '__day_' + indexDay">
              <div
                v-if="shiftCalendar?.[item.code]?.[day.globalName]"
                class="w-full border shadow-sm rounded-lg bg-primary-100 cursor-pointer transform transition-transform duration-300 hover:scale-105"
              >
                <div class="w-full bg-primary py-1 px-2 text-white text-sm font-medium">
                  {{ shiftCalendar[item.code][day.globalName]?.date }}
                </div>
                <div class="py-1 px-2">
                  <div class="text-gray-500 text-xs">
                    {{ moment(shiftCalendar[item.code][day.globalName]?.shift_config?.start).format('HH:mm') }} -
                    {{ moment(shiftCalendar[item.code][day.globalName]?.shift_config?.end).format('HH:mm') }}
                  </div>
                  <div>
                    <p
                      v-for="(staff, indexStaff) in shiftCalendar[item.code][day.globalName]?.staff || []"
                      :key="index + '__day_' + indexDay + '__staff_' + indexStaff"
                      class="mt-1 text-xs"
                    >
                      {{ staff?.fullName + ' - ' + staff?.position }}
                    </p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import moment from 'moment';
import { onMounted, ref } from 'vue';

import { DAY_OF_WEEK } from '@/common/constant';
import { useShiftCalendarStore } from '@/stores/shift-calendar';

const useShiftCalendar = useShiftCalendarStore();

const day_of_week = ref(DAY_OF_WEEK);
const userData = ref({});
const shiftCalendar = ref();

onMounted(() => {
  initUser();
  getData();
  // const user = {
  //   parentStore: {
  //     storeName: '',
  //     shift_config: [
  //       { name: 'Sáng', code: 'S', start: new Date(setTimeISO(7)), end: new Date(setTimeISO(12)) },
  //       { name: 'Chiều', code: 'C', start: new Date(setTimeISO(12)), end: new Date(setTimeISO(17)) },
  //       { name: 'Tối', code: 'T', start: new Date(setTimeISO(17)), end: new Date(setTimeISO(23)) }
  //     ]
  //   },
  //   fullName: 'Duck'
  // };
  // localStorage.setItem('user', JSON.stringify(user));
});

const initUser = () => {
  userData.value = JSON.parse(localStorage.getItem('user') || '{}');
};

const getData = async () => {
  const res = await useShiftCalendar.listShiftCalendars({
    type: 0,
    date: '2025-07-12'
  });
  console.log(res.data);

  if (res?.success) {
    shiftCalendar.value = res?.data;
  }
};
</script>

<style lang="scss" scoped>
table,
th,
td {
  border-collapse: collapse;
}

th,
td {
  padding: 4px;
}
</style>
