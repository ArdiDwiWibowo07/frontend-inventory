<script setup>

//import ref
import { ref } from 'vue';

//import router
import { useRouter } from 'vue-router';

//import store
import { useUser } from '../../stores/user';

//import handleErrors
import { handleErrors } from "../../utils/handleErrors";

// Import LayoutAuth component
import LayoutAuth from '../../layouts/auth.vue';

//init router
const router = useRouter();

//init store user
const userStore = useUser();

//define state email and password
const email = ref("");
const password = ref("");

//define state errors 
const errors = ref({});
const loginFailed = ref('');

//function login
const loginHandler = async () => {
    try {

        //call action login from store
        await userStore.login({ email: email.value, password: password.value });

        //redirect to dashboard
        router.push('/dashboard');
        
    } catch (error) {

        errors.value = {};
        //handle error
        if (error.response?.data?.message) {
            loginFailed.value = error.response.data.message;
            return;
        }

        //set errors
        handleErrors(error.response?.data, errors);
    }
};
</script>


<template>
    <LayoutAuth>
        <div class="text-center mb-4 mt-5">
            <a href="/" class="navbar-brand navbar-brand-autodark p-4 bg-blue-lt rounded-circle shadow-sm">
                <img src="/images/logo.png" height="60" alt="" />
            </a>
        </div>
        <div class="card card-md rounded">
            <div class="card-body">
                <h2 class="h2 text-center mb-4">Login to your account</h2>
                <div v-if="loginFailed" class="alert alert-danger mt-2">
                    {{ loginFailed }}
                </div>
                <form @submit.prevent="loginHandler" autocomplete="off" novalidate>
                    <div class="mb-3">
                        <label class="form-label">Email address</label>
                        <input type="email" class="form-control" v-model="email" placeholder="your@email.com"
                            autocomplete="off" />
                        <div v-if="errors.email" class="alert alert-danger mt-2">
                            {{ errors.email }}
                        </div>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control" v-model="password" placeholder="Your password"
                            autocomplete="off" />
                        <div v-if="errors.password" class="alert alert-danger mt-2">
                            {{ errors.password }}
                        </div>
                    </div>
                    <div class="mb-2">
                        <label class="form-check">
                            <input type="checkbox" class="form-check-input" />
                            <span class="form-check-label">Remember me on this device</span>
                        </label>
                    </div>
                    <div class="form-footer">
                        <button type="submit" class="btn btn-primary w-100 rounded">
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </LayoutAuth>
</template>