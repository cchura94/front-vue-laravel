<template>
  <input type="text" v-model="mensaje" />

  <button @click="enviarMensaje">Enviar Mensaje</button>
</template>

<script setup>
import { ref } from "vue";
import mensajeService from "./../services/message.service";

const mensaje = ref("");

async function enviarMensaje() {
  let msg = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: "59173277937",
    type: "text",
    text: {
      // the text object
      preview_url: false,
      body: mensaje.value,
    },
  };

  await mensajeService.enviarMensaje(msg);
}
</script>
