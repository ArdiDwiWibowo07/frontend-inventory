<script setup>
// Import defineProps
import { defineProps } from "vue";

// Menerima prop 'fetchData' dari komponen induk
const props = defineProps({
    fetchData: Function,
    productId: Number
});

// Import ref and onMounted
import { ref, onMounted } from "vue";

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


// Fetch product by ID
const fetchProductById = async () => {
    if (props.productId) {
        try {

            //fetch product by id
            Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await Api.get(`/api/admin/products/${props.productId}`);

            // assign response to state
            const data = response.data.data;
            name.value = data.name;
            categoryId.value =data.category_id;
            suppplierId.value =data.supplier_id;
            description.value = data.description;
            unit.value = data.unit;
            

        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }
};

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
    fetchProductById();
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

// Update Product
const updateProduct = async () => {
    const formData = new FormData();
    formData.append("image", image.value);
    formData.append("name", name.value);
    formData.append("category_id", categoryId.value);
    formData.append("supplier_id", suppplierId.value);
    formData.append("unit", unit.value);
    formData.append("description", description.value);
    formData.append("_method", "PATCH");

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await Api.post(`/api/admin/products/${props.productId}`, formData)
        .then((response) => {
            //show toast
            
            toast(`${response.data.message}`, {
                type: "success",
                dangerouslyHTMLString: true,
            });

            //call fetchData
            props.fetchData();

            //close modal
            const modalElement = modalRef.value;
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
        })

        .catch((error) => {
            handleErrors(error.response.data, errors);
        });
};
</script>

<template>
    <a href="#" class="btn rounded" data-bs-toggle="modal" :data-bs-target="`#modal-edit-Product-${props.ProductId}`">
        Edit
    </a>

    <div class="modal modal-blur fade" :id="`modal-edit-Product-${props.ProductId}`" tabindex="-1" role="dialog" aria-hidden="true"
        ref="modalRef">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <form @submit.prevent="updateProduct">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Product</h5>
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
                            Update
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