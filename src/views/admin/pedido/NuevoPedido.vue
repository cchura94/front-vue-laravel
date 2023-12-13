<template>
    <div class="grid">
        <div class="md:col-7 col-12">
            <div class="card">
                <h5>Lista de Productos</h5>
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
          <h4 class="m-0">Productos</h4>
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
      <Column
        field="nombre"
        header="Nombre"
        sortable
        style="min-width: 12rem"
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
        style="min-width: 8rem"
      ></Column>

      <Column :exportable="false" style="min-width: 8rem">
        
        <template #body="slotProps">
            <Button
            icon="pi pi-plus"
            rounded
            severity="warning"
            class="mr-2"
            @click="addCarrito(slotProps.data)"
          />
          </template>

      </Column>
    </DataTable>

            </div>
        </div>
        <div class="md:col-5 col-12">
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        
                        <DataTable :value="carrito">
                            <Column field="nombre" header="Producto"></Column>
                            <Column field="precio" header="Precio"></Column>
                            <Column field="cantidad" header="C"></Column>
                            <Column :exportable="false">
                                <template #body="slotProps">
                                    <Button
                                        icon="pi pi-plus"
                                        rounded
                                        severity="danger"
                                        class="mr-2"
                                        @click="quitarCarrito(slotProps.data)"
                                    />
                                </template>
                            </Column>
                        </DataTable>


                    </div>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div
                        class="flex flex-wrap gap-2 align-items-center justify-content-between"
                        >
                        <h4 class="m-0">Cliente</h4>
                        <Button
                            icon="pi pi-plus"
                            severity="success"
                            class="mr-2"
                            @click="quitarCarrito(slotProps.data)"
                        />
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText
                            placeholder="Buscar por CI/NIT..."
                            v-model="buscar_cliente"
                            @keypress.enter="busquedaCliente()"
                            />
                        </span>
                        </div>
                        <div v-if="cliente_seleccionado.id">
                            {{ cliente_seleccionado }}
                        </div>


                    </div>
                </div>
                <div class="col-12">
                    <div class="p-2 border-round-sm bg-primary font-bold ">Carrito</div>
                    <div class="card">
                        <InputText
                        class="mr-1"
                            placeholder="Observaciones..."
                            v-model="buscar"
                            @keypress.enter="getProductos()"
                            />
                            <Button label="Registrar Pedido" icon="pi pi-check" iconPos="right" />

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import productoService from "../../../services/producto.service.js";
import clienteService from "../../../services/cliente.service.js"
import { ref, onMounted } from "vue";

const productos = ref([]);
const dt = ref();
const buscar = ref("");
const totalRecords = ref(0);
const loading = ref(false);
const lazyParams = ref({ page: 0 });
const productDialog = ref(false);
const cliente_seleccionado = ref({})

const carrito = ref([]);
const buscar_cliente = ref("");


onMounted(() => {
  getProductos();
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

const formatCurrency = (value) => {
  if (value)
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  return;
};

const onPage = (event) => {
  lazyParams.value = event;
  getProductos();
};

const addCarrito = (prod) => {
    const producto = {id: prod.id, nombre: prod.nombre, precio:prod.precio, cantidad: 1}
    carrito.value.push(producto);
}

const quitarCarrito = (prod) => {
    carrito.value.splice(carrito.value.indexOf(prod), 1); 
}

const busquedaCliente = async () => {
    const {data} = await clienteService.buscarCliente(buscar_cliente.value)
    cliente_seleccionado.value = data
}
</script>