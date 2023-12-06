<template>
   <!--
   <h1>Ingresar</h1>
    {{ credenciales }}
    <br>
    <label for="c">Ingrese su Correo: </label>
    <input type="email" id="c" v-model="credenciales.email">
    {{ errors.email }}
    <br>
    <label for="p">Ingrese su Contraseña: </label>
    <input type="password" id="p" v-model="credenciales.password">
    {{ errors.password }}
    <br>
    <button type="button" @click="funIngresar()">Ingresar</button>
-->
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
           
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="https://cdn.freebiesupply.com/images/large/2x/google-logo-transparent.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Ingresar</div>
                        <span class="text-600 font-medium">Completa sus credenciales</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Correo Electronico</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="credenciales.email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="credenciales.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button label="Ingresar" class="w-full p-3 text-xl" @click="funIngresar()"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    

</template>

<script setup>
    import {ref} from 'vue'
    // import axios from "axios"
    import authService from "./../../services/auth.service"
    import { useRouter } from "vue-router"

    const credenciales = ref({email: "", password: ""})
    const errors = ref({})

    const router = useRouter()

    async function funIngresar(){
        try {
            const {data} = await authService.login(credenciales.value);
            console.log(data)
            localStorage.setItem("access_token", data.access_token)

            router.push("/admin/categoria");

        } catch (error) {
            if(error.response.status == 422){
                console.log(error.response.data.errors)
                errors.value = error.response.data.errors
            }else{
                alert("Credenciales Incorrectas")
            }
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