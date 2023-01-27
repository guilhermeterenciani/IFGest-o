import Swal, { SweetAlertOptions } from "sweetalert2"
export const MODAL_LOADING_OPTIONS: SweetAlertOptions = {
    allowEscapeKey: false,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
        Swal.showLoading(undefined)
    }
}
export const MODAL_CONFIRM_OPTIONS: SweetAlertOptions = {
    allowEscapeKey: false,
    allowOutsideClick: false,
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "NÃO",
    confirmButtonText: "SIM"
}
