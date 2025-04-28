//import vue router
import { createRouter, createWebHistory } from 'vue-router'

//import store user
import { useUser } from '../stores/user'

//define a routes
const routes = [
    {
        path: '/',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next('/dashboard') : next()
        },
        name: 'login',
        component: () => import( /* webpackChunkName: "home" */ '../views/auth/login.vue')
    },

]

//create router
const router = createRouter({
    history: createWebHistory(),
    routes // <-- routes,
})

export default router