<template>
    
    <DataTable
      ref="dt"
      :value="pedidos"
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
          <h4 class="m-0">Gestión Pedidos</h4>
          <input type="datetime-local" v-model="fi" @change="getPedidos()">
          <input type="datetime-local" v-model="ff" @change="getPedidos()">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              placeholder="Buscar..."
              v-model="buscar"
              @keypress.enter="getPedidos()"
            />
          </span>
        </div>
      </template>
      <Column field="id" header="ID" sortable style="min-width: 3rem"></Column>
      <Column
        field="fecha"
        header="Fecha"
        sortable
        style="min-width: 16rem"
      ></Column>
      <Column field="estado" header="Estado" sortable style="min-width: 8rem">
        <template #body="slotProps">
          {{ slotProps.data.estado == 2?'COMPLETADO':'PENDIENTE' }}
        </template>
      </Column>
      <Column
        field="cliente.nombre_completo"
        header="Cliente"
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
            icon="pi pi-box"
            rounded
            severity="warning"
            class="mr-2"
            @click="abrir(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="pedidoDialog"
      :style="{ width: '450px' }"
      header="Detalle Pedido"
      :modal="true"
      class="p-fluid"
    >

    <h5>FECHA: {{ pedido.fecha }}</h5>
    <h6>NOMBRE CLIENTE: {{ pedido.cliente.nombre_completo }}</h6>
    <h6>CI/NIT CLIENTE: {{ pedido.cliente.ci_nit }}</h6>
    <h6>TELEFONO CLIENTE: {{ pedido.cliente.telefono }}</h6>

    <DataTable :value="pedido.productos">
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="NOMBRE"></Column>
        <Column field="precio" header="PRECIO"></Column>
        <Column field="pivot.cantidad" header="Cantidad"></Column>
    </DataTable>

      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          text
          @click="hideDialog()"
        />
      </template>
    </Dialog>

</template>

<script setup>
import pedidoService from "../../../services/pedido.service.js";
import { ref, onMounted } from "vue";
import { jsPDF } from "jspdf";
import autotable from "jspdf-autotable"

const pedidos = ref([]);
const dt = ref();
const buscar = ref("");
const totalRecords = ref(0);
const loading = ref(false);
const lazyParams = ref({ page: 0 });

const pedidoDialog = ref(false);
const pedido = ref({});
const fi = ref("");
const ff = ref("");

onMounted(() => {
  getPedidos();
});


const getPedidos = async () => {
  loading.value = true;

  let page = lazyParams.value.page + 1;
  let limit = lazyParams.value.rows;

  const { data } = await pedidoService.index(page, limit, buscar.value, fi.value, ff.value);
  pedidos.value = data.data;
  totalRecords.value = data.total;

  loading.value = false;
};
const onPage = (event) => {
  lazyParams.value = event;
  getPedidos();
};
const generarPdf = (ped) => {
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();

    let posX = 15;
    let posY = 20;

    doc.setFontSize(12);
    doc.text("Pedido: "+ped.id, posX, posY);
    doc.text("Fecha: "+ped.fecha, posX+80, posY);
    posY += 10 
    doc.text("Observacion: "+ped.observacion, posX, posY);
    posY += 20
    doc.setFontSize(12);
    doc.text("Cliente: ", posX, posY);
    doc.setFontSize(10);

    doc.text("Nombre: "+ped.cliente.nombre_completo, posX, posY+7);
    doc.text("Ci/NIT: "+ped.cliente.ci_nit, posX, posY+14);
    doc.text("Telefono: "+ped.cliente.telefono, posX, posY+21);
    
    let columnas = [
        {header: "ID", dataKey: "id"},
        {header: "Producto", dataKey: "nombre"},
        {header: "Cantidad", dataKey: "stock"},
        {header: "Precio Unitario", dataKey: "precio"}
    ]

    let tablePOsY = posY+40;

    doc.autoTable(columnas, ped.productos, {
        startY: tablePOsY,
        theme: "grid",
        style: {
            fontSize: 10,
            cellPadding: {top: 5, right: 2, bottom: 5, left: 2}
        },
    })

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}

const abrir = (pedi) => {
    pedido.value = pedi
    
  pedidoDialog.value = true;
};
const hideDialog = () => {
  pedidoDialog.value = false;
};

</script>