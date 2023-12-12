<template>
  <!--
    <h1>Productos</h1>
    <pre>{{ productos }}</pre>
    -->
  <div class="card">
    <Toolbar class="mb-4">
      <template #start>
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          severity="success"
          class="mr-2"
          @click="abrirNuevoProducto"
        />
        <Button label="Elimninar" icon="pi pi-trash" severity="danger" />
      </template>

      <template #end>
        <FileUpload
          mode="basic"
          accept="image/*"
          :maxFileSize="1000000"
          label="Importar"
          chooseLabel="Import"
          class="mr-2 inline-block"
        />
        <Button
          label="Exportar"
          icon="pi pi-upload"
          severity="help"
          @click="exportCSV($event)"
        />
      </template>
    </Toolbar>

    <DataTable
      ref="dt"
      :value="productos"
      dataKey="id"
      lazy
      :totalRecords="totalRecords"
      :loading="loading"
      :paginator="true"
      :rows="5"
      @page="onPage($event)"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[3, 5, 10]"
      currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} productos"
    >
      <template #header>
        <div
          class="flex flex-wrap gap-2 align-items-center justify-content-between"
        >
          <h4 class="m-0">Gestión Productos</h4>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              placeholder="Buscar..."
              v-model="buscar"
              @keypress.enter="getProductos()"
            />
          </span>
        </div>
      </template>
      <Column field="id" header="ID" sortable style="min-width: 3rem"></Column>
      <Column
        field="nombre"
        header="Nombre"
        sortable
        style="min-width: 16rem"
      ></Column>
      <Column header="Image">
        <template #body="slotProps">
          <img
            v-if="slotProps.data.imagen"
            :src="`http://127.0.0.1:8000/${slotProps.data.imagen}`"
            alt="imagen"
            class="shadow-2 border-round"
            style="width: 64px"
          />
          <img
            v-else
            src="https://w7.pngwing.com/pngs/1008/532/png-transparent-wolf-logo-symbol-thumbnail.png"
            alt="imagen"
            class="shadow-2 border-round"
            style="width: 64px"
          />
        </template>
      </Column>
      <Column field="precio" header="Precio" sortable style="min-width: 8rem">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.precio) }}
        </template>
      </Column>
      <Column
        field="categoria.nombre"
        header="Categoria"
        sortable
        style="min-width: 10rem"
      ></Column>

      <Column :exportable="false" style="min-width: 8rem">
        
        <template #body="slotProps">
            <Button
            icon="pi pi-file"
            rounded
            severity="danger"
            class="mr-2"
            @click="generarPdf(slotProps.data)"
          />
          <Button
            icon="pi pi-image"
            rounded
            severity="warning"
            class="mr-2"
            @click="actualizarImagen(slotProps.data)"
          />
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            class="mr-2"
            @click="editProduct(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="confirmDeleteProduct(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Detalles Producto"
      :modal="true"
      class="p-fluid"
    >
      <!--{{ producto }}-->
      <div class="field">
        <label for="name">Nombre</label>
        <InputText
          id="name"
          v-model.trim="producto.nombre"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !producto.nombre }"
        />
        <small class="p-error" v-if="submitted && !producto.nombre"
          >Nombre es Obligatorio.</small
        >
      </div>
      <div class="field">
        <label for="description">Descripción</label>
        <Textarea
          id="description"
          v-model="producto.descripcion"
          rows="3"
          cols="20"
        />
      </div>

      <div class="field">
        <label class="mb-3">Categoria</label>
        <div class="formgrid grid">
          <div
            class="field-radiobutton col-6"
            v-for="cat in categorias"
            :key="cat.id"
          >
            <RadioButton
              :id="`category-${cat.id}`"
              name="categoria_id"
              :value="cat.id"
              v-model="producto.categoria_id"
            />
            <label :for="`category-${cat.id}`">{{ cat.nombre }}</label>
          </div>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="price">Precio</label>
          <InputNumber
            id="price"
            v-model="producto.precio"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
        <div class="field col">
          <label for="quantity">Cantidad</label>
          <InputNumber id="quantity" v-model="producto.stock" integeronly />
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          text
          @click="hideDialog()"
        />
        <Button
          label="Guardar"
          icon="pi pi-check"
          text
          @click="guardarProducto()"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="productDialogImagen"
      :style="{ width: '450px' }"
      header="Actualizar Imagen Producto"
      :modal="true"
      class="p-fluid"
    >
      <FileUpload
        customUpload
        @uploader="subirImagenProducto"
        :multiple="false"
        accept="image/*"
        :maxFileSize="1000000"
      >
        <template #empty>
          <p>Arrastre y suelte la imagen aquí para cargarlos.</p>
        </template>
      </FileUpload>
    </Dialog>
  </div>
</template>

<script setup>
import productoService from "../../../services/producto.service.js";
import categoriaService from "../../../services/categoria.service.js";

import Swal from "sweetalert2";
import { ref, onMounted } from "vue";
import { jsPDF } from "jspdf";



const productos = ref([]);
const dt = ref();
const buscar = ref("");
const totalRecords = ref(0);
const loading = ref(false);
const lazyParams = ref({ page: 0 });
const productDialog = ref(false);

const submitted = ref(false);
const producto = ref({ estado: true });
const categorias = ref([]);

const productDialogImagen = ref(false);

onMounted(() => {
  getProductos();
  getCategorias();
});

const getProductos = async () => {
  loading.value = true;

  let page = lazyParams.value.page + 1;
  let limit = lazyParams.value.rows;

  const { data } = await productoService.index(page, limit, buscar.value);
  productos.value = data.data;
  totalRecords.value = data.total;

  loading.value = false;
};

const getCategorias = async () => {
  const { data } = await categoriaService.index();

  categorias.value = data;
};

const formatCurrency = (value) => {
  if (value)
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  return;
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const onPage = (event) => {
  lazyParams.value = event;
  getProductos();
};

const abrirNuevoProducto = () => {
  productDialog.value = true;
};
const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
  producto.value = { estado: true };
};

const abrirNuevoImagenProducto = () => {
  productDialogImagen.value = true;
};
const hideDialogImagen = () => {
  productDialogImagen.value = false;
  submitted.value = false;
  producto.value = { estado: true };
};

const guardarProducto = async () => {
  try {
    submitted.value = true;

    if (producto.value.nombre.trim()) {
      if (producto.value.id) {
        const { data } = await productoService.update(
          producto.value.id,
          producto.value
        );

        productDialog.value = false;
        producto.value = { estado: true };
      } else {
        const { data } = await productoService.store(producto.value);

        productDialog.value = false;
        producto.value = { estado: true };
      }

      getProductos();
    }
  } catch (error) {
    console.log(error);
  }
};

const editProduct = (prod) => {
  producto.value = prod;

  abrirNuevoProducto();
};

const actualizarImagen = (prod) => {
  producto.value = prod;
  abrirNuevoImagenProducto();
};

const subirImagenProducto = (event) => {
    const file = event.files[0];
    
    let formData = new FormData();
    formData.append("imagen", file);

    productoService.actualizarImagen(producto.value.id, formData)

    hideDialogImagen()

    getProductos()

    Swal.fire({
        title: 'Imagen Actualizada!',
        text: 'continuar',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    })
    
}

const generarPdf = (prod) => {
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();

    doc.text("Detalle del Producto", 10, 10);
    doc.text("NOMBRE: "+prod.nombre, 10, 20);
    doc.text("PRECIO: "+prod.precio, 10, 30);
    doc.text("STOCK: "+prod.stock, 10, 40);
    doc.text("CATEGORIA: "+prod.categoria.nombre, 10, 50);
    doc.text("ESTADO: "+prod.estado, 10, 60);
    
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}
</script>
