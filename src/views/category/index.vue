<script setup>
import { useCategoryStore } from '@/stores/category';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
  getData();
});

const useCategory = useCategoryStore();
const toast = useToast();
const dt = ref();
const categories = ref();
const categoryDialog = ref(false);
const deleteCategoryDialog = ref(false);
const deleteCategoriesDialog = ref(false);
const category = ref({});
const selectedCategories = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

const getData = async () => {
  const res = await useCategory.getCategories();
  if (res.success) {
    categories.value = res.data;
  } else {
    toast.add({ severity: 'error', summary: res?.message, detail: res?.error, life: 3000 });
  }
};

function openNew() {
  category.value = {};
  submitted.value = false;
  categoryDialog.value = true;
}

function hideDialog() {
  categoryDialog.value = false;
  submitted.value = false;
}

function saveCategory() {
  submitted.value = true;

  if (category?.value.label?.trim()) {
    if (category.value.id) {
      category.value.type = category.value.type.value ? category.value.type.value : category.value.type;
      categories.value[findIndexById(category.value.id)] = category.value;
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Category Updated', life: 3000 });
    } else {
      category.value.id = createId();
      category.value.image = 'category-placeholder.svg';
      categories.value.push(category.value);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Category Created', life: 3000 });
    }

    categoryDialog.value = false;
    category.value = {};
  }
}

function editCategory(prod) {
  category.value = { ...prod };
  categoryDialog.value = true;
}

function confirmDeleteCategory(prod) {
  category.value = prod;
  deleteCategoryDialog.value = true;
}

function deleteCategory() {
  categories.value = categories.value.filter((val) => val.id !== category.value.id);
  deleteCategoryDialog.value = false;
  category.value = {};
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 3000 });
}

function findIndexById(id) {
  let index = -1;
  for (let i = 0; i < categories.value.length; i++) {
    if (categories.value[i].id === id) {
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
  deleteCategoriesDialog.value = true;
}

function deleteSelectedCategories() {
  categories.value = categories.value.filter((val) => !selectedCategories.value.includes(val));
  deleteCategoriesDialog.value = false;
  selectedCategories.value = null;
  toast.add({ severity: 'success', summary: 'Successful', detail: 'Categories Deleted', life: 3000 });
}
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="secondary"
            @click="confirmDeleteSelected"
            :disabled="!selectedCategories || !selectedCategories.length"
          />
        </template>

        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        v-model:selection="selectedCategories"
        :value="categories"
        dataKey="id"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} category"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Manage Category</h4>
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
        <Column field="label" header="Tên danh mục sản phẩm" sortable style="min-width: 10rem"></Column>
        <Column field="des" header="Mô tả" sortable style="min-width: 10rem"></Column>

        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCategory(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCategory(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="categoryDialog" :style="{ width: '450px' }" header="Category Details" :modal="true">
      <div class="flex flex-col gap-6">
        <div>
          <label for="label" class="block font-bold mb-3">Tên danh mục sản phẩm</label>
          <InputText id="label" v-model.trim="category.label" required="true" autofocus :invalid="submitted && !category.label" fluid />
          <small v-if="submitted && !category.label" class="text-red-500">Name Category is required.</small>
        </div>
      </div>
      <div class="flex flex-col gap-6">
        <div>
          <label for="des" class="block font-bold mb-3">Mô tả</label>
          <InputText id="des" v-model.trim="category.des" required="true" autofocus :invalid="submitted && !category.des" fluid />
          <small v-if="submitted && !category.des" class="text-red-500">Des is required.</small>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" @click="saveCategory" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteCategoryDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="category"
          >Are you sure you want to delete <b>{{ category.label }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteCategoryDialog = false" />
        <Button label="Yes" icon="pi pi-check" @click="deleteCategory" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteCategoriesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="category">Are you sure you want to delete the selected categories?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteCategoriesDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedCategories" />
      </template>
    </Dialog>
  </div>
</template>
