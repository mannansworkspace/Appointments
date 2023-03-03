import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { connect } from "react-redux";
import { addCustomer, editCustomer } from "../../store/actions/customersAction";
import { createKey } from "../../utils/CustomerKeyCreator";
const AddCustomer = ({
  modelHandler,
  addCustomer,
  editCustomer,
  id,
  customer,
  isCustomerExists,
}) => {

  const [customerName, setCustomerName] = useState('');

  const [error, setError] = useState(false);

  const [customerSubmitFormLoader, setCustomerSubmitFormLoader] = useState(false)

  useEffect(() => {

    customer && setCustomerName(customer.customerName)
  }, [customer])

  useEffect(() => {
    if (isCustomerExists !== undefined && !isCustomerExists) {
      modelHandler()
    }
    else {
      setError(true)
    }
  }, [customerSubmitFormLoader, isCustomerExists, modelHandler])

  const onChangeHandle = (e) => {
    setCustomerName(e.target.value)
  }

  const submitCustomer = (e) => {
    e.preventDefault()
    setCustomerSubmitFormLoader(true);
    setError(undefined)

    const data = {
      customerId: customer ? customer._id : null,
      customerName: customerName,
      warehouseId: id,
      key: createKey(customerName)
    }

    if (customer?._id) {
      editCustomer(data).then(() => {
        setCustomerSubmitFormLoader(false)

      })
    }
    else {
      addCustomer(data)
        .then(() => {
          setCustomerSubmitFormLoader(false)
        })
    }


  }

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
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
        <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
          <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex justify-space-between h-16">
                <div className="flex-1 flex items-center justify-between sm:items-stretch">
                  <div></div>
                  <div className="">
                    <div className="text-gray-900 font-medium text-center text-xl font-semibold">
                      ADD Customer
                    </div>
                  </div>
                  <div className="cursor-pointer" onClick={modelHandler}>
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="form-width mx-6 max-w-7xl mx-auto mt-5 mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200 px-3 sm:px-3">
            <form onSubmit={submitCustomer}>
              <div className="max-w-7xl mx-auto bg-white mb-5">
                <div className="space-y-6 sm:space-y-5">
                  <div className="sm:flex">
                    <div className="sm:w-9/12">
                      <div className="w-full px-2 mb-4">
                        <label
                          htmlFor="companyName"
                          className="block text-sm font-normal text-gray-900"
                        >
                          Customer Name
                        </label>
                        <div className="mt-1">
                          <input
                            required
                            type="text"
                            onChange={onChangeHandle}
                            value={customerName}
                            name="customerName"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        {error && isCustomerExists && (
                          <span className="text-xs text-red-400">Customer already exists with similar name!</span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              {customerSubmitFormLoader ? (
                <Loader
                  type="Puff"
                  color="#00BFFF"
                  height={32}
                  width={32}
                  style={{ margin: "auto", width: "32px", height: "32px" }}
                />
              ) : (
                <button
                  type="submit"
                  className={`w-32 mt-6 mb-10 ml-3 ml-auto mr-auto block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 `}
                >
                  CONFIRM
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  id: state.auth?.user?._id,
  isCustomerExists: state.customers?.isCustomerExists
})

export default connect(mapStateToProps, { addCustomer, editCustomer })(AddCustomer);
