<script setup>
</script>

<template>
 
      <nav>
        <RouterLink to="/">INICIO</RouterLink> |
        <RouterLink to="/about">NOSOTROS</RouterLink> |
        
        <RouterLink to="/login">INGRESAR</RouterLink>
        <button @click="funSalir()">Salir</button>
      </nav>
   
  <RouterView />
</template>

<script setup>
  const funSalir = () =>  {
    localStorage.removeItem("access_token");
    window.location.href = "/login"
  }
</script>