<script setup>
// Import defineProps
import { defineProps } from "vue";

// Menerima prop 'fetchData' dari komponen induk
const props = defineProps({
    fetchData: Function,
    id: Number,
    endpoint: String
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

//import js cookie
import Cookies from "js-cookie";

// Get token from cookies
const token = Cookies.get('token');

const deleteData = async () => {

    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await Api.delete(`${props.endpoint}/${props.id}`)
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

}

</script>

<template>
    <a href="#" class="btn btn-danger rounded" data-bs-toggle="modal" :data-bs-target="`#modal-delete-${id}-${endpoint}`">
        Delete
    </a>

    <div class="modal modal-blur fade" :id="`modal-delete-${id}-${endpoint}`" tabindex="-1" role="dialog" aria-hidden="true" ref="modalRef">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete ?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <p>Are you sure you want to delete this data?</p>
                    <p class="text-muted">This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <a href="#" class="btn me-auto rounded" data-bs-dismiss="modal">Cancel</a>
                    <button class="btn btn-danger ms-auto rounded" @click="deleteData">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Add your custom styles here */
</style>