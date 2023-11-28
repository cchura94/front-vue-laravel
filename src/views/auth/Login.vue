<template>
    <h1>Ingresar</h1>
    {{ credenciales }}
    <br>
    <label for="c">Ingrese su Correo: </label>
    <input type="email" id="c" v-model="credenciales.email">
    <br>
    <label for="p">Ingrese su Contraseña: </label>
    <input type="password" id="p" v-model="credenciales.password">
    <br>
    <button type="button" @click="funIngresar()">Ingresar</button>
</template>

<script setup>
    import {ref} from 'vue'
    // import axios from "axios"
    import authService from "./../../services/auth.service"
    import { useRouter } from "vue-router"

    const credenciales = ref({email: "", password: ""})

    const router = useRouter()

    async function funIngresar(){
        try {
            const {data} = await authService.login(credenciales.value);
            console.log(data)
            localStorage.setItem("access_token", data.access_token)

            router.push("/usuario");

        } catch (error) {
            console.log(error.response.data.errors)
        }

        /*
        axios.post("http://127.0.0.1:8000/api/v1/auth/login", credenciales.value).then(
            (res) => {
                console.log(res.data)
            },(error) => {
                console.log(error)
            }
        )
        */
    }

</script>