<template>
    <h1>Categoria</h1>

    <label for="">Ingrese Nombre</label>
    <input type="text" v-model="categoria.nombre">
    <br>
    <label for="det">Ingrese Detalle</label>
    <textarea id="det" cols="30" rows="5" v-model="categoria.detalle"></textarea>
    <br>
    <button @click="guardarCategoria()">{{ categoria.id?'Editar Categoria':'Guardar Categoria' }}</button>

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
</template>

<script setup>
import categoriaService from '../../../services/categoria.service';
import {ref, onMounted} from 'vue'

const categorias = ref([]);
const categoria = ref({})

onMounted(() => {
    getListaCategorias()
})


async function getListaCategorias(){
    try {
        const {data} = await categoriaService.index();
        categorias.value = data
        
    } catch (error) {
        
    }
}

async function guardarCategoria(){
    try {
        if(categoria.value.id){
            const {data} = await categoriaService.update(categoria.value.id, categoria.value);
        }else{

            const {data} = await categoriaService.store(categoria.value);
        }
        getListaCategorias()

    } catch (error) {
        console.log(error);
    }
}

function editarCategoria(cat){
    categoria.value = cat
}


async function eliminarCategoria(cat){
    if(confirm("¿Está seguro de eliminar la categoria?")){
        const {data} = await categoriaService.destroy(cat.id);
        getListaCategorias();
    }
}


</script>