<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Tuần này</div>

    <table class="w-full border-collapse border">
      <thead>
        <tr>
          <th></th>
          <th>T2</th>
          <th>T3</th>
          <th>T4</th>
          <th>T5</th>
          <th>T6</th>
          <th>T7</th>
          <th>CN</th>
        </tr>
      </thead>
      <tbody>
        <tr></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
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
</script>

<style lang="scss" scoped></style>
