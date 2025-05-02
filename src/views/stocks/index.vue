<script setup>
// Import ref dan onMounted
import { ref, onMounted } from "vue";

// Import LayoutAdmin
import LayoutAdmin from "../../layouts/admin.vue";

// Import services api
import Api from "../../services/api";

// Import js-cookie
import Cookies from "js-cookie";


//import button delete
import DeleteButton from "../../components/DeleteButton.vue";
import StockButton from "../../components/StockButton.vue";

// State untuk menyimpan suppliers dan pagination
const stocks = ref([]);
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
                `/api/admin/stocks?page=${pageNumber}&search=${search}`
            );
            stocks.value = response.data.data.data;
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
                        <h2 class="page-title">STOCKS</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-body">
            <div class="container-xl">
                <div class="row">
                    <div class="col-12 mb-3">
                        <div class="input-group">
                            <input type="text" class="form-control" v-model="keywords" @keydown="handleKeyDown"
                                placeholder="search by supplier name" />
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
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Stock</th>
                                            <th class="w-1">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(stock, index) in stocks" :key="index">
                                            <td>
                                                {{ stock.name }}
                                            </td>
                                            <td>
                                                {{ stock.category.name }}
                                            </td>
                                            <td>
                                                {{ stock.stock.stock }}
                                            </td>
                                            <td>
                                                <div class="btn-list flex-nowrap">
                                                    <StockButton type="in" :id="stock.stock.product_id" :fetchData="fetchData" />
                                                    <StockButton type="out" :id="stock.stock.product_id" :fetchData="fetchData" />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-if="!stocks.length">
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