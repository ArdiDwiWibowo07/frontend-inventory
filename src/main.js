import { createApp } from 'vue'

//import App component
import App from './App.vue'

// import vue-awesome-paginate
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

//import pinia
import { createPinia } from 'pinia'

//initialize pinia
const pinia = createPinia()

//import config router
import router from './routes'

//initialize vue
const app = createApp(App)

//use vue-awesome-paginate
app.use(VueAwesomePaginate);

//use pinia on vue
app.use(pinia)

//use router on vue
app.use(router)

//mount root app element
app.mount('#app')