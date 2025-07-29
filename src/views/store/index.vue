<script setup>
import { StoreService } from '@/service/StoreService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

onMounted(() => {
  StoreService.getStores().then((data) => (stores.value = data));
});

const router = useRouter();
const toast = useToast();
const dt = ref();
const stores = ref();
const storeDialog = ref(false);
const deleteStoreDialog = ref(false);
const deleteStoresDialog = ref(false);
const store = ref({});
const selectedStores = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
  { label: 'INSTOCK', value: 'instock' },
  { label: 'LOWSTOCK', value: 'lowstock' },
  { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

function formatCurrency(value) {
  if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return;
}

function openNew() {
  store.value = {};
  submitted.value = false;
  storeDialog.value = true;
}

function hideDialog() {
  storeDialog.value = false;
  submitted.value = false;
}

function saveStore() {
  submitted.value = true;

  if (store?.value.name?.trim()) {
    if (store.value.id) {
      store.value.inventoryStatus = store.value.inventoryStatus.value ? store.value.inventoryStatus.value : store.value.inventoryStatus;
      stores.value[findIndexById(store.value.id)] = store.value;
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Store Updated', life: 3000 });
    } else {
      store.value.id = createId();
      store.value.code = createId();
      store.value.image = 'store-placeholder.svg';
      store.value.inventoryStatus = store.value.inventoryStatus ? store.value.inventoryStatus.value : 'INSTOCK';
      stores.value.push(store.value);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Store Created', life: 3000 });
    }

    storeDialog.value = false;
    store.value = {};
  }
}

function editStore(prod) {
  store.value = { ...prod };
  storeDialog.value = true;
}

function confirmDeleteStore(prod) {
  store.value = prod;
  deleteStoreDialog.value = true;
}

function deleteStore() {
  stores.value = stores.value.filter((val) => val.id !== store.value.id);
  deleteStoreDialog.value = false;
  store.value = {};
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Store Deleted', life: 3000 });
}

function findIndexById(id) {
  let index = -1;
  for (let i = 0; i < stores.value.length; i++) {
    if (stores.value[i].id === id) {
      index = i;
      break;
    }
  }

  return index;
}

function createId() {
  let id = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function exportCSV() {
  dt.value.exportCSV();
}

function confirmDeleteSelected() {
  deleteStoresDialog.value = true;
}

function deleteSelectedStores() {
  stores.value = stores.value.filter((val) => !selectedStores.value.includes(val));
  deleteStoresDialog.value = false;
  selectedStores.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Stores Deleted', life: 3000 });
}

function getStatusLabel(status) {
  switch (status) {
    case 'INSTOCK':
      return 'success';

    case 'LOWSTOCK':
      return 'warn';

    case 'OUTOFSTOCK':
      return 'danger';

    default:
      return null;
  }
}
const onRowClick = ({ data }) => {
  router.push(`/store/${data.id}`);
};
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
          <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedStores || !selectedStores.length" />
        </template>

        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        v-model:selection="selectedStores"
        :value="stores"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} stores"
        @row-click="onRowClick"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">List Stores</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="store_code" header="Code" sortable style="min-width: 8rem"></Column>
        <Column field="store_name" header="Name" sortable style="min-width: 16rem"></Column>

        <Column field="address" header="Adress" sortable style="min-width: 15rem"></Column>
        <Column field="phone_number" header="Phone" sortable style="min-width: 12rem"> </Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editStore(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteStore(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="storeDialog" :style="{ width: '450px' }" header="Store Details" :modal="true">
      <div class="flex flex-col gap-6">
        <img v-if="store.image" :src="`https://primefaces.org/cdn/primevue/images/store/${store.image}`" :alt="store.image" class="block m-auto pb-4" />
        <div>
          <label for="name" class="block font-bold mb-3">Name</label>
          <InputText id="name" v-model.trim="store.name" required="true" autofocus :invalid="submitted && !store.name" fluid />
          <small v-if="submitted && !store.name" class="text-red-500">Name is required.</small>
        </div>
        <div>
          <label for="description" class="block font-bold mb-3">Description</label>
          <Textarea id="description" v-model="store.description" required="true" rows="3" cols="20" fluid />
        </div>
        <div>
          <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
          <Select id="inventoryStatus" v-model="store.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid></Select>
        </div>

        <div>
          <span class="block font-bold mb-4">Category</span>
          <div class="grid grid-cols-12 gap-4">
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton id="category1" v-model="store.category" name="category" value="Accessories" />
              <label for="category1">Accessories</label>
            </div>
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton id="category2" v-model="store.category" name="category" value="Clothing" />
              <label for="category2">Clothing</label>
            </div>
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton id="category3" v-model="store.category" name="category" value="Electronics" />
              <label for="category3">Electronics</label>
            </div>
            <div class="flex items-center gap-2 col-span-6">
              <RadioButton id="category4" v-model="store.category" name="category" value="Fitness" />
              <label for="category4">Fitness</label>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6">
            <label for="price" class="block font-bold mb-3">Price</label>
            <InputNumber id="price" v-model="store.price" mode="currency" currency="USD" locale="en-US" fluid />
          </div>
          <div class="col-span-6">
            <label for="quantity" class="block font-bold mb-3">Quantity</label>
            <InputNumber id="quantity" v-model="store.quantity" integeronly fluid />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveStore" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteStoreDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="store"
          >Are you sure you want to delete <b>{{ store.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteStoreDialog = false" />
        <Button label="Yes" icon="pi pi-check" @click="deleteStore" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteStoresDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="store">Are you sure you want to delete the selected stores?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteStoresDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedStores" />
      </template>
    </Dialog>
  </div>
</template>
