<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Inicio',
        items: [{ label: 'Administrador', icon: 'pi pi-fw pi-home', to: '/admin' }]
    },
    {
        label: 'Gestión Productos',
        items: [
            { label: 'Productos', icon: 'pi pi-fw pi-id-card', to: '/admin/producto' },
            { label: 'Categorias', icon: 'pi pi-fw pi-check-square', to: '/admin/categoria' }
        ]
    },
    {
        label: 'Usuarios',
        items: [
            { label: 'Usuarios', icon: 'pi pi-fw pi-eye', to: '/admin/usuario', badge: 'NEW' },
            { label: 'Clientes', icon: 'pi pi-fw pi-globe', to: '/admin/cliente',}
        ]
    },
    {
        label: 'Gestión Pedidos',
        items: [
            { label: 'Lista Pedidos', icon: 'pi pi-fw pi-prime', to: '/admin/pedido' },
            { label: 'Nuevo Pedido', icon: 'pi pi-fw pi-prime', to: '/admin/pedido/nuevo' },
        ]
    },
    {
        label: 'Configuración',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Roles y permisos',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Roles',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/admin/roles'
                    },
                    {
                        label: 'Permisos',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/admin/permisos'
                    }
                ]
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
       
    </ul>
</template>

<style lang="scss" scoped></style>
