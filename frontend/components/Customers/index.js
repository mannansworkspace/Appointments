import React, { Fragment, useEffect, useState } from "react";
import { getCustomers, customerExist, deleteCustomer, limitCustomerVehicle } from "../../store/actions/customersAction";
import { connect } from "react-redux";
import LimitCustomer from "./LimitCustomer";
import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/solid';

import AddCustomer from "./AddCustomer";
import Loader from "react-loader-spinner";
import DeleteAlert from "./deleteModal";
import Pagination from '../common/Pagination';

const Customers = ({
  getCustomers,
  limitCustomerVehicle,
  deleteCustomer,
  customerExist,
  isLoading,
  customers,
  totalCustomers,
  id
}) => {

  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [customerId, setCustomerId] = useState('')
  const [deleteCustomerAlert, setDeleteCustomerAlert] = useState(false);
  const [limitCustomerModal, setLimitCustomerModal] = useState(false);
  const [customer, setCustomer] = useState({});
  const limit = 50;

  const openAddCustomerModal = (customer) => {
    setAddCustomerModal(!addCustomerModal);
    customerExist()
    if (customer) {
      setCustomer(customer);
    } else {
      setCustomer(null);
    }
  };
  const classnames = (...classes) => {
    return classes.filter(Boolean).join(' ')
  }


  const openLimitCustomerModal = (customer) => {
    setLimitCustomerModal(!limitCustomerModal);
    if (customer) {
      setCustomer(customer);
    } else {
      setCustomer(null);
    }
  };

  const removeCustomerLimitHandler = (customerId) => {
    const data = {
      id: customerId,
      warehouseId: id
    }
    limitCustomerVehicle(data)
  }
  const deleteAlertHandler = (id) => {
    setDeleteCustomerAlert(!deleteCustomerAlert)
    setCustomerId(id)
  }
  useEffect(() => {
    getCustomers(id, limit, 0);
  }, [id, getCustomers]);

  const getCustomer = (skip) => {
    getCustomers(id, limit, skip)
  }

  // const {customers , loading } = this.state;
  let pageContent = null;

  if (customers && customers?.length) {
    pageContent = (
      <tbody className="bg-white">
        {customers.map((customer, idx) => (
          <tr key={idx}>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="flex">
                <span className="text-gray-800">{customer.customerName} </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center">
              <span className="text-gray-600">{customer.totalAppointments} </span>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center">
              <span className="text-gray-600">{customer.totalCars}</span>
            </td>

            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              {customer?.customerVehicleLimit ? (
                <div className="flex">
                  <span className="text-gray-700">
                    {customer.customerVehicleLimit + " cars per day"}
                  </span>
                  <p onClick={() => openLimitCustomerModal(customer)}
                    className="cursor-pointer text-blue-500 hover:underline ml-2">
                    (Change /{" "}</p>
                  <p onClick={() => removeCustomerLimitHandler(customer._id)}
                    className="cursor-pointer text-blue-500 hover:underline ml-2">
                    remove)
                  </p>
                </div>
              ) : (
                <p onClick={() => openLimitCustomerModal(customer)}
                  className="cursor-pointer text-left text-blue-500 hover:underline">Set daily limit</p>
              )}
            </td>
            <td className="px-6 py-3 whitespace-nowrap text-left border-b border-gray-200 text-sm">
              <Menu as="div" className="inline-block text-left">
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button className="bg-gray-100 rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                        <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="z-10 origin-top-right absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none fix"
                      >
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (

                              <div
                                className={classnames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm hover:text-red-700 cursor-pointer'
                                )}
                                onClick={() => deleteAlertHandler(customer._id)}
                              >
                                Delete
                              </div>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                onClick={() => openAddCustomerModal(customer)}
                                className={classnames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm hover:text-purple-700 cursor-pointer'
                                )
                                }>

                                Edit
                              </div>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </td>

          </tr>
        ))}
      </tbody>
    );
  } else {
    pageContent = null;
  }

  return (
    <Fragment>
      {isLoading ? (
        <Loader className="absolute top-1/2 left-1/2"
          type="Puff"
          color="#00BFFF"
        />
      ) : (
        <div>
          <main className="our-custom-w main-padding">

            <div className=" sm:block overflow-hidden mx-auto hideScrollBar w-full max-w-screen-2xl px-24">
              <span className="rounded-md mt-5 mb-4 block text-right mr-5 lg:mr-2">
                <div
                  className="w-48 inline-block main-btn-color cursor-pointer text-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:bg-green-700 focus:shadow-outline-indigo active:bg-green-700 transition ease-in-out duration-150"
                  onClick={openAddCustomerModal}
                >
                  <i className="fa fa-plus pr-1" aria-hidden="true"></i> Add New Customer
                </div>
              </span>
              <div className="flex flex-col lg:overflow-hidden overflow-x-auto hideScrollBar">
                <div className="-my-2 py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">

                  <div className="hideScrollBar align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            NAME
                          </th>

                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            APPOINTMENTS
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            VEHICLES
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            DAILY LIMIT
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          </th>
                        </tr>
                      </thead>

                      {pageContent}
                    </table>
                    {customers?.length === 0 && (
                      <div className="px-6 py-4 text-center no-order">
                        There is no customer
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </main>
          {addCustomerModal && (
            <AddCustomer customer={customer} modelHandler={openAddCustomerModal} />
          )}
          {limitCustomerModal && (
            <LimitCustomer
              customer={customer}
              modelHandler={openLimitCustomerModal}
            />
          )}
        </div>

      )}
      {/* delete alert */}
      {deleteCustomerAlert && (
        <DeleteAlert onClose={deleteAlertHandler} onDelete={() => deleteCustomer(customerId)} />
      )}
      <div>
        <Pagination itemsCountPerPage={ limit } totalItemsCount={totalCustomers} callBack={ getCustomer }/>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  customers: state.customers.customers,
  isLoading: state.customers.isLoading,
  totalCustomers: state.customers.totalCustomers,
  id: state.auth?.user?._id
});

export default connect(mapStateToProps, { getCustomers, limitCustomerVehicle, customerExist, deleteCustomer })(Customers);

