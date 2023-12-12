import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Chat from '../views/Chat.vue'
import Usuario from '../views/admin/Usuario.vue'
import Login from '../views/auth/Login.vue'
import Categoria from '../views/admin/productos/Categoria.vue'
import NotFound from "./../views/errors/NotFound.vue"
import Producto from "./../views/admin/productos/Producto.vue"
import NuevoPedido from "./../views/admin/pedido/NuevoPedido.vue"
import ListaPedido from "./../views/admin/pedido/ListaPedido.vue"


import AppLayout from "@/layout/AppLayout.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
    
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {redirectIfAuth: true}
    },
    {
      path: '/admin',
      component: AppLayout,
      children: [
        {
          path: 'categoria',
          name: 'Categoria',
          component: Categoria,
          meta: {requireAuth: true}
        },
        {
          path: 'usuario',
          name: 'Usuario',
          component: Usuario,
          meta: {requireAuth: true}
        },
        {
          path: 'producto',
          name: 'Producto',
          component: Producto,
          meta: {requireAuth: true}
        },
        {
          path: 'pedido/nuevo',
          name: 'NuevoPedido',
          component: NuevoPedido,
          meta: {requireAuth: true}
        },
        {
          path: 'pedido',
          name: 'Pedidos',
          component: ListaPedido,
          meta: {requireAuth: true}
        },



      ]
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFound
    }
  ]
})

// guards
router.beforeEach((to, from, next) => {

  let token = localStorage.getItem("access_token");

  if(to.meta.requireAuth){
    if(!token){
      return next({name: 'Login'})
    }
    return next()
  }

  if(to.meta.redirectIfAuth && token){
    return next({name: 'Usuario'})
  }
  return next()
})


export default router
