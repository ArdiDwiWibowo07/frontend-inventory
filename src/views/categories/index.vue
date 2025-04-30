<script setup>
// Import ref dan onMounted
import { ref, onMounted } from "vue";

// Import LayoutAdmin
import LayoutAdmin from "../../layouts/admin.vue";

// Import services api
import Api from "../../services/api";

// Import js-cookie
import Cookies from "js-cookie";

// Import helper getImageUrl
import { getImageUrl } from "../../utils/getImageUrl";

//import view category create
import CategoryCreate from "./create.vue";

//import view category edit
import CategoryEdit from "./edit.vue";

//import button delete
import DeleteButton from "../../components/DeleteButton.vue";

// State untuk menyimpan categories dan pagination
const categories = ref([]);
const pagination = ref({
    currentPage: 1,
    perPage: 5,
    total: 0,
});

// State keywords
const keywords = ref("");

// Method untuk mengambil data dari API
const fetchData = async (pageNumber = 1, search = "") => {
    const token = Cookies.get("token");
    if (token) {
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
            const response = await Api.get(
                `/api/admin/categories?page=${pageNumber}&search=${search}`
            );
            categories.value = response.data.data.data;
            pagination.value = {
                currentPage: response.data.data.current_page,
                perPage: response.data.data.perPage,
                total: response.data.data.total,
            };
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    } else {
        console.error("Token is not available!");
    }
};

// Ambil data ketika komponen di-mount
onMounted(() => {
    fetchData();
});

// Handler untuk pencarian
const searchHandler = () => {
    fetchData(1, keywords.value);
};

// Handler untuk menangani event keydown
const handleKeyDown = (e) => {
    if (e.key === "Enter") {
        searchHandler();
    }
};
</script>

<template>
    <LayoutAdmin>
        <div class="page-header d-print-none">
            <div class="container-xl">
                <div class="row g-2 align-items-center">
                    <div class="col">
                        <div class="page-pretitle">HALAMAN</div>
                        <h2 class="page-title">CATEGORIES</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-body">
            <div class="container-xl">
                <div class="row">
                    <div class="col-12 mb-3">
                        <div class="input-group">
                            <CategoryCreate :fetchData="fetchData" />
                            <input type="text" class="form-control" v-model="keywords" @keydown="handleKeyDown"
                                placeholder="search by category name" />
                            <button @click="searchHandler" class="btn btn-md btn-primary">
                                SEARCH
                            </button>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="card">
                            <div class="table-responsive">
                                <table class="table table-vcenter table-mobile-md card-table">
                                    <thead>
                                        <tr>
                                            <th>Category Name</th>
                                            <th class="w-1">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(category, index) in categories" :key="index">
                                            <td data-label="Category Name">
                                                <div class="d-flex py-1 align-items-center">
                                                    <span class="avatar me-2" :style="{
                                                        backgroundImage: `url(${category.image
                                                            })`,
                                                    }"></span>
                                                    <div class="flex-fill">
                                                        <div class="font-weight-medium">
                                                            {{ category.name }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                             <td>
                                                <div class="btn-list flex-nowrap">
                                                    <CategoryEdit :categoryId="category.id" :fetchData="fetchData" />
                                                    <DeleteButton :id="category.id" endpoint="/api/admin/categories" :fetchData="fetchData" />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-if="!categories.length">
                                            <td colspan="4" class="text-center">
                                                <div class="alert alert-danger mb-0">
                                                    Data Belum Tersedia!
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="text-end">
                                    <vue-awesome-paginate :total-items="pagination.total"
                                        :items-per-page="pagination.perPage" :max-pages-shown="2"
                                        v-model="pagination.currentPage" @click="fetchData" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </LayoutAdmin>
</template>