<script setup>
// Import defineProps
import { defineProps } from "vue";

// Menerima prop 'fetchData' dari komponen induk
const props = defineProps({
    fetchData: Function,
    categoryId: Number
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
const image = ref("");
const description = ref("");
const errors = ref({});

// Refs for file input and modal
const fileInputRef = ref(null);
const modalRef = ref(null);

// Token
const token = Cookies.get("token");

const fetchCategory = async () => {
  if (props.categoryId) {
    try {
      Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await Api.get(`/api/admin/categories/${props.categoryId}`);

      // Set category data
      const category = response.data.data;
      name.value = category.name;
      // Handle image if necessary
    } catch (error) {
      console.error("There was an error fetching the category data!", error);
    }
  }
};

onMounted(() => {
  fetchCategory();
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

// Update category
const updateCategory = async () => {
    const formData = new FormData();
    formData.append("image", image.value);
    formData.append("name", name.value);
    formData.append("_method", "PATCH");

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await Api.post(`/api/admin/categories/${props.categoryId}`, formData)
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
    <a href="#" class="btn rounded" data-bs-toggle="modal" :data-bs-target="`#modal-edit-category-${props.categoryId}`">
        Edit
    </a>

    <div class="modal modal-blur fade" :id="`modal-edit-category-${props.categoryId}`" tabindex="-1" role="dialog" aria-hidden="true"
        ref="modalRef">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <form @submit.prevent="updateCategory">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Category</h5>
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
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label class="form-label">Category Name</label>
                                    <input type="text" class="form-control" v-model="name"
                                        placeholder="Enter Category Name" />
                                    <div v-if="errors.name" class="alert alert-danger mt-2">
                                        {{ errors.name }}
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