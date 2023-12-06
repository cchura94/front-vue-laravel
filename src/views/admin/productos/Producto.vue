<template>
    <!--
    <h1>Productos</h1>
    <pre>{{ productos }}</pre>
    -->
    <div class="card">

        <Toolbar class="mb-4">
                <template #start>
                    <Button label="Nuevo" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                    <Button label="Elimninar" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                </template>

                <template #end>
                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" chooseLabel="Import" class="mr-2 inline-block" />
                    <Button label="Exportar" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
                </template>
            </Toolbar>

        <DataTable ref="dt" :value="productos" dataKey="id" 
    :paginator="true" :rows="10"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
    currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} productos">
    <template #header>
        <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 class="m-0">Gestión Productos</h4>
            <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText placeholder="Buscar..." />
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

    </div>
</template>

<script setup>
import productoService from '../../../services/producto.service.js';
import { ref, onMounted } from "vue"

const productos = ref([]);
const dt = ref();

onMounted(() => {
    getProductos()
})

const getProductos = async () => {
    const {data} = await productoService.index();
    productos.value = data.data
}

const formatCurrency = (value) => {
    if(value)
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    return;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

</script>