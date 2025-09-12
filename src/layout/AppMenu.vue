<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import AppMenuItem from "./AppMenuItem.vue";

const route = useRoute();

// Removed sample/demo menu items

const model = ref([
  // {
  //   label: 'Cashier',
  //   items: [
  //     {
  //       label: 'Sale Report',
  //       icon: 'pi pi-fw pi-money-bill',
  //       to: '/sale-report'
  //     }
  //   ]
  // },
  // {
  //   label: 'Customer',
  //   items: [
  //     {
  //       label: 'List Customer',
  //       icon: 'pi pi-fw pi-users',
  //       to: '/customer'
  //     }
  //   ]
  // },
  {
    label: "Sản phẩm",
    items: [
      // {
      //   label: 'List Store',
      //   icon: 'pi pi-fw pi-shop',
      //   to: '/store',
      //   startWith: '/store/' // highlight khi path bắt đầu băng key này
      // },
      {
        label: "Danh sách sản phẩm",
        icon: "pi pi-fw pi-database",
        to: "/product",
        startWith: "/product/",
      },
      {
        label: "Danh sách danh mục",
        icon: "pi pi-fw pi-list",
        to: "/category",
        startWith: "/category/",
      },
    ],
  },
  // {
  //   label: 'Staff',
  //   items: [
  //     {
  //       label: 'User',
  //       icon: 'pi pi-fw pi-user',
  //       items: [
  //         {
  //           label: 'List User',
  //           icon: 'pi pi-fw pi-users',
  //           to: '/user'
  //         },
  //         {
  //           label: 'Create User',
  //           icon: 'pi pi-fw pi-user-plus',
  //           to: '/user'
  //         }
  //       ]
  //     },
  //     {
  //       label: 'Shift Calendar',
  //       icon: 'pi pi-fw pi-calendar-clock',
  //       to: '/shift-calendar'
  //     }
  //   ]
  // },
  // {
  //   label: 'Other',
  //   items: [
  //     {
  //       label: 'Banner',
  //       icon: 'pi pi-fw pi-images',
  //       to: '/banner'
  //     }
  //   ]
  // },
  // {
  //   label: 'Get Started',
  //   items: [
  //     {
  //       label: 'Documentation',
  //       icon: 'pi pi-fw pi-book',
  //       to: '/pages/documentation'
  //     }
  //   ]
  // }
]);

const listItems = computed(() => model.value);
</script>

<template>
  <div class="body">
    <ul class="layout-menu">
      <template v-for="(item, i) in listItems" :key="item">
        <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
        <li v-if="item.separator" class="menu-separator"></li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.body {
  background-color: #ccb999;
}
.breadcrumb-active {
  color: #5e1803; /* Màu active (ví dụ: xanh lá) */
  font-weight: 700;
}
</style>
