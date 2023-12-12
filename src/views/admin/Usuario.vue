<template>
  <div class="card">
    <h1>Lista Usuarios</h1>

    <label for="">Nombre:</label>
    <input type="text" v-model="usuario.name">
    <br>
    <label for="">CORREO:</label>
    <input type="text" v-model="usuario.email">
    <br>
    <label for="">CONTRASEÑA:</label>
    <input type="text" v-model="usuario.password">
    <br>
    <button @click="guardar()">Guardar Usuario</button>

    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>NOMBRE</th>
          <th>CORREO</th>
          <th>ACCION</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="us in usuarios" :key="us.id">
          <td>{{ us.id }}</td>
          <td>{{ us.name }}</td>
          <td>{{ us.email }}</td>
          <td>
            <button>editar</button>
            <button>eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <DataTable :value="usuarios" tableStyle="min-width: 50rem">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="NOMBRE"></Column>
      <Column field="email" header="COrreo Electronico"></Column>
      <Column field="created_at" header="Registrado en"></Column>
  </DataTable>

  </div>
</template>
<script setup>
import { ref } from "vue";
import usuarioService from "./../../services/usuario.service";

const usuarios = ref([]);
const usuario = ref({});

async function listarUsuarios() {
  const { data } = await usuarioService.listarUsuarios();
  console.log(data);
  usuarios.value = data;
}

async function guardar(){
    await usuarioService.guardarUsuario(usuario.value);
    listarUsuarios()
}

listarUsuarios();
</script>
