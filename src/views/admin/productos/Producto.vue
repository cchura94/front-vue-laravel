<template>
    <!--
    <h1>Productos</h1>
    <pre>{{ productos }}</pre>
    -->
    <div class="card">

        <Toolbar class="mb-4">
                <template #start>
                    <Button label="Nuevo" icon="pi pi-plus" severity="success" class="mr-2" @click="abrirNuevoProducto" />
                    <Button label="Elimninar" icon="pi pi-trash" severity="danger" />
                </template>

                <template #end>
                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" chooseLabel="Import" class="mr-2 inline-block" />
                    <Button label="Exportar" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
                </template>
            </Toolbar>

        <DataTable ref="dt" :value="productos" dataKey="id" lazy :totalRecords="totalRecords" :loading="loading"
            :paginator="true" :rows="5" @page="onPage($event)"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[3,5,10]"
            currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} productos">
            <template #header>
                <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                    <h4 class="m-0">Gestión Productos</h4>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText placeholder="Buscar..." v-model="buscar" @keypress.enter="getProductos()" />
                    </span>
                </div>
            </template>
            <Column field="id" header="ID" sortable style="min-width:3rem"></Column>
            <Column field="nombre" header="Nombre" sortable style="min-width:16rem"></Column>
            <Column header="Image">
                <template #body="slotProps">
                    <img src="https://w7.pngwing.com/pngs/1008/532/png-transparent-wolf-logo-symbol-thumbnail.png" :alt="slotProps.data.image" class="shadow-2 border-round" style="width: 64px" />
                </template>
            </Column>
            <Column field="precio" header="Precio" sortable style="min-width:8rem">
                <template #body="slotProps">
                    {{formatCurrency(slotProps.data.precio)}}
                </template>
            </Column>
            <Column field="categoria.nombre" header="Categoria" sortable style="min-width:10rem"></Column>
            
            <Column :exportable="false" style="min-width:8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="productDialog" :style="{width: '450px'}" header="Detalles Producto" :modal="true" class="p-fluid">
            {{ producto }}
            <div class="field">
                <label for="name">Nombre</label>
                <InputText id="name" v-model.trim="producto.nombre" required="true" autofocus :class="{'p-invalid': submitted && !producto.nombre}" />
                <small class="p-error" v-if="submitted && !producto.nombre">Nombre es Obligatorio.</small>
            </div>
            <div class="field">
                <label for="description">Descripción</label>
                <Textarea id="description" v-model="producto.descripcion" rows="3" cols="20" />
            </div>

            <div class="field">
                <label class="mb-3">Categoria</label>
                <div class="formgrid grid">

                    <div class="field-radiobutton col-6" v-for="cat in categorias" :key="cat.id">
                        <RadioButton :id="`category-${cat.id}`" name="categoria_id" :value="cat.id" v-model="producto.categoria_id" />
                        <label :for="`category-${cat.id}`">{{ cat.nombre }}</label>
                    </div>
                </div>
            </div>

            <div class="formgrid grid">
                <div class="field col">
                    <label for="price">Precio</label>
                    <InputNumber id="price" v-model="producto.precio" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="field col">
                    <label for="quantity">Cantidad</label>
                    <InputNumber id="quantity" v-model="producto.stock" integeronly />
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog()"/>
                <Button label="Guardar" icon="pi pi-check" text @click="guardarProducto()" />
            </template>
        </Dialog>

    </div>
</template>

<script setup>
import productoService from '../../../services/producto.service.js';
import categoriaService from '../../../services/categoria.service.js';

import { ref, onMounted } from "vue"

const productos = ref([]);
const dt = ref();
const buscar = ref("")
const totalRecords = ref(0)
const loading = ref(false)
const lazyParams = ref({page: 0})
const productDialog = ref(false)

const submitted = ref(false)
const producto = ref({estado: true})
const categorias = ref([])


onMounted(() => {
    getProductos()
    getCategorias();
})

const getProductos = async () => {
    loading.value = true;

    let page = lazyParams.value.page + 1;
    let limit = lazyParams.value.rows;

    const {data} = await productoService.index(page, limit, buscar.value);
    productos.value = data.data;
    totalRecords.value = data.total;

    loading.value = false;
}

const getCategorias = async () => {
    const {data} = await categoriaService.index();

    categorias.value = data
}

const formatCurrency = (value) => {
    if(value)
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
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
    productDialog.value = true
}
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const guardarProducto = async () => {
    try {
        submitted.value = true;

        if (producto.value.nombre.trim()) {
            const {data} = await productoService.store(producto.value);

            productDialog.value = false;
            producto.value = {estado: true};

            getProductos()
        }
        
    } catch (error) {
        console.log(error)
    }
}
</script>