import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Chat from '../views/Chat.vue'
import Usuario from '../views/admin/Usuario.vue'
import Login from '../views/auth/Login.vue'
import Categoria from '../views/admin/productos/Categoria.vue'

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
      path: '/usuario',
      name: 'Usuario',
      component: Usuario,
      meta: {requireAuth: true}
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {redirectIfAuth: true}
    },
    {
      path: '/admin/categoria',
      name: 'Categoria',
      component: Categoria,
      meta: {requireAuth: true}
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
