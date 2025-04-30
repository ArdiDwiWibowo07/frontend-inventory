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
    {
        path: '/dashboard',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'dashboard',
        component: () => import( /* webpackChunkName: "home" */ '../views/dashboard/index.vue'),
    },
    {
        path: '/categories',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'categories',
        component: () => import( /* webpackChunkName: "home" */ '../views/categories/index.vue'),
    },
    {
        path: '/products',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'products',
        component: () => import( /* webpackChunkName: "home" */ '../views/products/index.vue'),
    },
    {
        path: '/suppliers',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'products',
        component: () => import( /* webpackChunkName: "home" */ '../views/suppliers/index.vue'),
    },
    {
        path: '/stocks',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'stocks',
        component: () => import( /* webpackChunkName: "home" */ '../views/stocks/index.vue'),
    },

]

//create router
const router = createRouter({
    history: createWebHistory(),
    routes // <-- routes,
})

export default router