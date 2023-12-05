<template>
  <div class="card">
    <h1>Categoria</h1>

    <DataTable :value="categorias" tableStyle="min-width: 50rem">
      <Column field="id" header="ID"></Column>
      <Column field="nombre" header="NOMBRE"></Column>
      <Column field="detalle" header="DETALLE"></Column>
      <Column :exportable="false" style="min-width: 8rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            rounded
            class="mr-2"
            severity="warning"
            @click="abrirModal(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            rounded
            severity="danger"
            @click="eliminarCategoria(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="visible"
      modal
      header="Nueva Categoria"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      class="p-fluid"
    >

    <label for="">Ingrese Nombre</label>
    <InputText v-model.trim="categoria.nombre" required="true" autofocus />
    <br />
    <Label for="det">Ingrese Detalle</Label>
    
    <Textarea v-model="categoria.detalle" rows="3" cols="20" />
    <br />
  
    <Button :label="categoria.id ? 'Editar Categoria' : 'Guardar Categoria'"  @click="guardarCategoria()" />
      

    </Dialog>

    <hr>
    <hr>

    <label for="">Ingrese Nombre</label>
    <input type="text" v-model="categoria.nombre" />
    <br />
    <label for="det">Ingrese Detalle</label>
    <textarea
      id="det"
      cols="30"
      rows="5"
      v-model="categoria.detalle"
    ></textarea>
    <br />
    <button @click="guardarCategoria()">
      {{ categoria.id ? "Editar Categoria" : "Guardar Categoria" }}
    </button>

    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>NOMBRE</th>
          <th>DETALLE</th>
          <th>ACCION</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categorias" :key="cat.id">
          <td>{{ cat.id }}</td>
          <td>{{ cat.nombre }}</td>
          <td>{{ cat.detalle }}</td>
          <td>
            <button @click="editarCategoria(cat)">editar</button>
            <button @click="eliminarCategoria(cat)">eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import categoriaService from "../../../services/categoria.service";
import { ref, onMounted } from "vue";

const categorias = ref([]);
const categoria = ref({});
const visible = ref(false)

onMounted(() => {
  getListaCategorias();
});

async function getListaCategorias() {
  try {
    const { data } = await categoriaService.index();
    categorias.value = data;
  } catch (error) {}
}

async function guardarCategoria() {
  try {
    if (categoria.value.id) {
      const { data } = await categoriaService.update(
        categoria.value.id,
        categoria.value
      );
    } else {
      const { data } = await categoriaService.store(categoria.value);
    }
    getListaCategorias();
    visible.value = false;
  } catch (error) {
    console.log(error);
  }
}

function editarCategoria(cat) {
  categoria.value = cat;
}

async function eliminarCategoria(cat) {
  if (confirm("¿Está seguro de eliminar la categoria?")) {
    const { data } = await categoriaService.destroy(cat.id);
    getListaCategorias();
  }
}

function abrirModal(cat) {
    categoria.value = cat;
    visible.value = true
}
</script>
