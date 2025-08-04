<script setup>
import { CustomersService } from '@/service/CustomersService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

onMounted(() => {
  CustomersService.getCustomers().then((data) => (customers.value = data));
});

const router = useRouter();
const toast = useToast();
const dt = ref();
const customers = ref();
const customerDialog = ref(false);
const deleteCustomerDialog = ref(false);
const deleteCustomersDialog = ref(false);
const customer = ref({});
const selectedCustomers = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

function openNew() {
  customer.value = {};
  submitted.value = false;
  customerDialog.value = true;
}

function hideDialog() {
  customerDialog.value = false;
  submitted.value = false;
}

function saveCustomer() {
  submitted.value = true;

  if (customer?.value.customer_name?.trim()) {
    if (customer.value.id) {
      customers.value[findIndexById(customer.value.id)] = customer.value;
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Customer Updated', life: 3000 });
    } else {
      customer.value.id = createId();
      customers.value.push(customer.value);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Customer Created', life: 3000 });
    }

    customerDialog.value = false;
    customer.value = {};
  }
}

function editCustomer(prod) {
  customer.value = { ...prod };
  customerDialog.value = true;
}

function confirmDeleteCustomer(prod) {
  customer.value = prod;
  deleteCustomerDialog.value = true;
}

function deleteCustomer() {
  customers.value = customers.value.filter((val) => val.id !== customer.value.id);
  deleteCustomerDialog.value = false;
  customer.value = {};
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Customer Deleted', life: 3000 });
}

function findIndexById(id) {
  let index = -1;
  for (let i = 0; i < customers.value.length; i++) {
    if (customers.value[i].id === id) {
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
  deleteCustomersDialog.value = true;
}

function deleteSelectedCustomers() {
  customers.value = customers.value.filter((val) => !selectedCustomers.value.includes(val));
  deleteCustomersDialog.value = false;
  selectedCustomers.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Customers Deleted', life: 3000 });
}

const onRowClick = ({ data }) => {
  router.push(`/customer/${data.id}`);
};
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
          <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedCustomers || !selectedCustomers.length" />
        </template>

        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        v-model:selection="selectedCustomers"
        :value="customers"
        dataKey="id"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
        @row-click="onRowClick"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">List Customers</h4>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </IconField>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="id" header="Code" sortable style="min-width: 8rem"></Column>
        <Column field="phone_number" header="Phone" sortable style="min-width: 12rem"> </Column>
        <Column field="customer_name" header="Name" sortable style="min-width: 16rem"></Column>
        <Column field="point" header="Điểm" sortable style="min-width: 12rem"></Column>

        <Column field="created_at" header="Created At" sortable style="min-width: 15rem"></Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCustomer(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCustomer(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="customerDialog" :style="{ width: '450px' }" header="Customer Details" :modal="true">
      <div class="flex flex-col gap-6">
        <div>
          <label for="customer_name" class="block font-bold mb-3">Name</label>
          <InputText id="customer_name" v-model.trim="customer.customer_name" required="true" autofocus :invalid="submitted && !customer.customer_name" fluid />
          <small v-if="submitted && !customer.customer_name" class="text-red-500">Name is required.</small>
        </div>
        <div>
          <label for="phone_number" class="block font-bold mb-3">Số điện thoại</label>
          <InputText id="phone_number" v-model.trim="customer.phone_number" required="true" :invalid="submitted && !customer.phone_number" fluid />
          <small v-if="submitted && !customer.phone_number" class="text-red-500">Phone is required.</small>
        </div>
        <div>
          <label for="point" class="block font-bold mb-3">Điểm</label>
          <InputText id="point" v-model.trim="customer.point" required="true" :invalid="submitted && !customer.point" fluid />
          <small v-if="submitted && !customer.point" class="text-red-500">Point is required.</small>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveCustomer" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteCustomerDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="customer"
          >Are you sure you want to delete <b>{{ customer.customer_name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteCustomerDialog = false" />
        <Button label="Yes" icon="pi pi-check" @click="deleteCustomer" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteCustomersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="customer">Are you sure you want to delete the selected customers?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteCustomersDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedCustomers" />
      </template>
    </Dialog>
  </div>
</template>
