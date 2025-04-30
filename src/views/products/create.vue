<script setup>
// Import defineProps
import { defineProps } from "vue";

// Menerima prop 'fetchData' dari komponen induk
const props = defineProps({
    fetchData: Function,
});

// Import ref
import { ref,onMounted  } from "vue";

// Import services api
import Api from "../../services/api";

// Import js-cookie
import Cookies from "js-cookie";

//import toastify
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

//import handleErrors
import { handleErrors } from "../../utils/handleErrors";

// Reactive state
const name = ref("");
const categoryId = ref("");
const suppplierId = ref("");
const image = ref("");
const unit = ref("");
const description = ref("");
const errors = ref({});

// state categories
const categories = ref([]);
const suppliers = ref([]);

// Refs for file input and modal
const fileInputRef = ref(null);
const modalRef = ref(null);

// Token
const token = Cookies.get("token");

// Fetch categories
const fetchCategories = async () => {
    try {
        Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await Api.get('/api/admin/categories');

        // assign response to state
        categories.value = response.data.data.data;
    } catch (error) {
        console.error("There was an error fetching categories!", error);
    }
};
// Fetch suppliers
const fetchSuppliers = async () => {
    try {
        Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await Api.get('/api/admin/suppliers');

        // assign response to state
        suppliers.value = response.data.data.data;
    } catch (error) {
        console.error("There was an error fetching categories!", error);
    }
};

// onMounted
onMounted(() => {
    fetchCategories();
    fetchSuppliers();
});

// Handle file change
const handleFileChange = (e) => {
    const imageData = e.target.files[0];

    if (!imageData.type.match("image.*")) {
        fileInputRef.value.value = "";
        image.value = "";
        toast("Format File not Supported!", {
            type: "error",
            dangerouslyHTMLString: true,
        });
        return;
    }

    image.value = imageData;
};

// Store Product
const storeProduct = async () => {
    const formData = new FormData();
    formData.append("image", image.value);
    formData.append("name", name.value);
    formData.append("category_id", categoryId.value);
    formData.append("supplier_id", suppplierId.value);
    formData.append("unit", unit.value);
    formData.append("description", description.value);

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await Api.post("/api/admin/products", formData)
        .then((response) => {
            console.log(response);

            //show toast
            toast(`${response.data.message}`, {
                type: "success",
                dangerouslyHTMLString: true,
            });

            //call fetchData
            props.fetchData();

            //clear form
            name.value = "";
            image.value = "";

            //close modal
            const modalElement = modalRef.value;
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
        })

        .catch((error) => {
            errors.value = {};
            handleErrors(error.response?.data, errors);
        });
};
</script>

<template>
    <a href="#" class="btn btn-primary d-sm-inline-block" data-bs-toggle="modal" data-bs-target="#modal-create-Product">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
        </svg>
        Add New
    </a>

    <div class="modal modal-blur fade" id="modal-create-Product" tabindex="-1" role="dialog" aria-hidden="true"
        ref="modalRef">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <form @submit.prevent="storeProduct">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">New Product</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label class="form-label">Image</label>
                                    <input type="file" class="form-control" @change="handleFileChange"
                                        ref="fileInputRef" />
                                    <div v-if="errors.image" class="alert alert-danger mt-2">
                                        {{ errors.image }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">Product Name</label>
                                    <input type="text" class="form-control" v-model="name"
                                        placeholder="Enter Product Name" />
                                    <div v-if="errors.name" class="alert alert-danger mt-2">
                                        {{ errors.name }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">Category</label>
                                    <select class="form-select" v-model="categoryId">
                                        <option value="">-- Select Category --</option>
                                        <option v-for="category in categories" :key="category.id" :value="category.id">
                                            {{ category.name }}
                                        </option>
                                    </select>
                                    <div v-if="errors.category_id" class="alert alert-danger mt-2">
                                        {{ errors.category_id }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">Supplier</label>
                                    <select class="form-select" v-model="suppplierId">
                                        <option value="">-- Select Supplier --</option>
                                        <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                                            {{ supplier.name }}
                                        </option>
                                    </select>
                                    <div v-if="errors.supplier_id" class="alert alert-danger mt-2">
                                        {{ errors.supplier_id }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">Unit</label>
                                    <input type="text" class="form-control" v-model="unit"
                                        placeholder="Enter Unit" />
                                    <div v-if="errors.unit" class="alert alert-danger mt-2">
                                        {{ errors.unit }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control" rows="3" v-model="description"
                                        placeholder="Enter Description"></textarea>
                                    <div v-if="errors.description" class="alert alert-danger mt-2">
                                        {{ errors.description }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <a href="#" class="btn me-auto rounded" data-bs-dismiss="modal">Cancel</a>
                        <button type="submit" class="btn btn-primary ms-auto rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 5l0 14" />
                                <path d="M5 12l14 0" />
                            </svg>
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* Add your custom styles here */
</style>