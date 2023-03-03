
const deleteAlert = (props) => {
    return (
        <div
            className="fixed z-10 inset-0 overflow-y-auto "
            onClick={props.onClose}
            aria-labelledby="modal-dialog "
            role="dialog"
            aria-modal="true"
        >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                ></div>
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                >
                    &#8203;
                </span>
                <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all lg:my-8 sm:align-middle lg:max-w-lg lg:w-full">
                    <div class="w-full md:w-1/3 mx-auto">
                        <div class="flex flex-col p-5  bg-white">
                            <div class="flex">
                                <div className="bg-red-100 w-10 h-10 p-2 rounded-full">
                                    <svg class="w-6 h-6 fill-current text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" /></svg>
                                </div>

                                <div class="ml-3">
                                    <h2 class="font-semibold text-gray-800">Delete Customer</h2>
                                    <p class="mt-2 text-sm text-gray-600 leading-relaxed">Are you sure you
                                        want to delete this customer? They will be removed from our system and their
                                        history will be deleted. This action cannot be undone.</p>
                                </div>
                            </div>

                            <div class="flex items-right mt-3 ml-80">
                                <button onClick={props.onClose} class="flex px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md">
                                    Cancel
                                </button>

                                <button onClick={props.onDelete} class="flex px-4 py-2 ml-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default deleteAlert;



