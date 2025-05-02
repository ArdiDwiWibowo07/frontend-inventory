<script setup>
// Import defineProps
import { defineProps } from "vue";

// Menerima prop 'fetchData' dari komponen induk
const props = defineProps({
    fetchData: Function,
    id: Number,
    type: String,
});

// Import ref
import { ref } from "vue";

// Refs for file input and modal
const modalRef = ref(null);

//import service api
import Api from "../services/api";

//import toastify
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

//import handleErrors


//import js cookie
import Cookies from "js-cookie";
import { handleErrors } from "../utils/handleErrors";

const quantity = ref();
const errors = ref({});

// Get token from cookies
const token = Cookies.get('token');

const updateStock = async () => {
    const formData = new FormData();
    formData.append("quantity", quantity.value);

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await Api.post(`api/admin/stocks/${props.type}/${props.id}`, formData)
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
}

</script>

<template>
    <a v-if="type == 'in'" href="#" class="btn btn-primary rounded" data-bs-toggle="modal"
        :data-bs-target="`#modal-stock-${id}-${type}`">
        ++
    </a>

    <a v-if="type == 'out'" href="#" class="btn btn-danger rounded" data-bs-toggle="modal"
        :data-bs-target="`#modal-stock-${id}-${type}`">
        --
    </a>

    <div class="modal modal-blur fade" :id="`modal-stock-${id}-${type}`" tabindex="-1" role="dialog" aria-hidden="true"
        ref="modalRef">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <form @submit.prevent="updateStock" class="flex-fill">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Stock</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label class="form-label">Quantity</label>
                                    <input type="text" class="form-control" v-model="quantity"
                                        placeholder="Enter Quantity" />
                                    <div v-if="errors.quantity" class="alert alert-danger mt-2">
                                        {{ errors.quantity }}
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