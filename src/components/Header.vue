<script setup>

//import router
import { useRouter, useRoute } from "vue-router";

//initialize router
const router = useRouter();
const route = useRoute();

//menu active
const isActive = (path) => {
    if (Array.isArray(path)) {
        return path.some((p) => route.path.startsWith(p));
    }
    return route.path.startsWith(path);
};

//import store theme
import { useTheme } from "../stores/theme";

//init store theme
const themeStore = useTheme();

//import store user
import { useUser } from "../stores/user";

//init store user
const userStore = useUser();

const logoutHandler = () => {
    // Handle logout
    userStore.logout();

    // Redirect to login page
    return router.push("/", { replace: true });
};
</script>

<template>
    <div class="sticky-top">
        <header class="navbar navbar-expand-md d-print-none sticky-top">
            <div class="container-xl">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu"
                    aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3 mt-1">
                    <router-link to="/">
                        <img src="/images/logo.png" width="100" height="32" alt="Tabler"
                            class="navbar-brand-image mb-2" />
                        <label class="ms-2">INVENTORY APPS</label>
                    </router-link>
                </h1>
                <div class="navbar-nav flex-row order-md-last">
                    <div class="d-none d-md-flex me-2">
                        <button v-if="themeStore.theme === 'dark'" @click="themeStore.changeTheme" class="nav-link px-0"
                            title="Enable light mode" data-bs-toggle="tooltip" data-bs-placement="bottom">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                                <path
                                    d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
                            </svg>
                        </button>
                        <button v-else @click="themeStore.changeTheme" class="nav-link px-0" title="Enable dark mode"
                            data-bs-toggle="tooltip" data-bs-placement="bottom">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                            </svg>
                        </button>
                    </div>
                    <div class="nav-item dropdown">
                        <a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown"
                            aria-label="Open user menu">
                            <span class="avatar avatar-sm" :style="{ backgroundImage: 'url(/images/boy.png)' }"></span>
                            <div class="d-none d-xl-block ps-2">
                                <div>{{ userStore.user?.name }}</div>
                                <div class="mt-1 small text-muted">{{ userStore.user?.email }}</div>
                            </div>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow rounded mt-2">
                            <a href="#" class="dropdown-item">Profile</a>
                            <div class="dropdown-divider"></div>
                            <a href="#" @click="logoutHandler" class="dropdown-item">Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <header class="navbar-expand-md">
            <div class="collapse navbar-collapse" id="navbar-menu">
                <div class="navbar bg-muted-lt">
                    <div class="container-xl">
                        <ul class="navbar-nav">
                            <li :class="['nav-item', { active: isActive('/dashboard') }]">
                                <router-link class="nav-link" to="/dashboard">
                                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                                            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                                            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                                        </svg>
                                    </span>
                                    <span class="nav-link-title">HOME</span>
                                </router-link>
                            </li>
                            <li :class="[
                            'nav-item dropdown',
                            { active: isActive(['/categories', '/products']) },
                        ]">
                                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown"
                                    data-bs-auto-close="outside" role="button" aria-expanded="false">
                                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            class="icon icon-tabler icons-tabler-outline icon-tabler-box" width="24"
                                            height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
                                            <path d="M12 12l8 -4.5" />
                                            <path d="M12 12l0 9" />
                                            <path d="M12 12l-8 -4.5" />
                                        </svg>
                                    </span>
                                    <span class="nav-link-title">MASTER</span>
                                </a>
                                <div class="dropdown-menu">
                                    <router-link class="dropdown-item" to="/categories">Categories</router-link>
                                    <router-link class="dropdown-item" to="/products">Products</router-link>
                                </div>
                            </li>
                            <li :class="['nav-item', { active: isActive('/suppliers') }]">
                                <router-link class="nav-link" to="/suppliers">
                                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            class="icon icon-tabler icons-tabler-outline icon-tabler-users" width="24"
                                            height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                                            <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                                        </svg>
                                    </span>
                                    <span class="nav-link-title">SUPPLIERS</span>
                                </router-link>
                            </li>
                            <li :class="['nav-item', { active: isActive('/stocks') }]">
                                <router-link class="nav-link" to="/stocks">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                            <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                            <path d="M17 17h-11v-14h-2" />
                                            <path d="M6 5l14 1l-1 7h-13" />
                                        </svg>
                                    </span>
                                    <span class="nav-link-title">STOCKS</span>
                                </router-link>
                            </li>
                            <li class="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown"
                                    data-bs-auto-close="outside" role="button" aria-expanded="false">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round"
                                            className="icon icon-tabler icons-tabler-outline icon-tabler-chart-histogram">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M3 3v18h18" />
                                            <path d="M20 18v3" />
                                            <path d="M16 16v5" />
                                            <path d="M12 13v8" />
                                            <path d="M8 16v5" />
                                            <path d="M3 11c6 0 5 -5 9 -5s3 5 9 5" />
                                        </svg>
                                    </span>
                                    <span className="nav-link-title"> REPORT </span>
                                </a>
                                <div className="dropdown-menu">
                                    <router-link className="dropdown-item" to="/sales"> Sales </router-link>
                                    <router-link className="dropdown-item" to="/profits"> Profits </router-link>
                                </div>
                            </li>
                            <li :class="['nav-item', { active: isActive('/users') }]">
                                <router-link class="nav-link" to="/users">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round"
                                            className="icon icon-tabler icons-tabler-outline icon-tabler-user-shield">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h2" />
                                            <path
                                                d="M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5z" />
                                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                        </svg>
                                    </span>
                                    <span className="nav-link-title"> USERS </span>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    </div>
</template>