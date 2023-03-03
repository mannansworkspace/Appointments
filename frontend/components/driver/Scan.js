import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getSingleAppointment } from "../../store/actions/driverAction";
import * as moment from "moment";
import { Fragment } from "react";
import Loader from "react-loader-spinner";
import CancelAppointmentModel from "../warehouse/models/CancelAppointmentModel";

export class Scan extends Component {
  constructor(props) {
    super(props);
    const id =
      this.props.match.params.id ||
      new URLSearchParams(this.props.location.search).get("id");

    this.state = {
      id,
      appointmentData: null,
      isLoading: true,
      showCancelModal: false,
    };
  }

  componentDidMount() {
    const { id } = this.state;
    this.props.getSingleAppointment(id);
    setInterval(() => {
      this.props.getSingleAppointment(id);
    }, 5000);

    if (
      this.state.appointmentData?.checkedStatus &&
      this.state.appointmentData.checkedStatus === "check-in"
    ) {
      window.location.reload();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { appointmentData } = props.driver;
    if (
      appointmentData &&
      JSON.stringify(appointmentData) !== JSON.stringify(state.appointmentData)
    ) {
      state.appointmentData = appointmentData;
      state.isLoading = false;
    }

    return state;
  }

  modalHandler = () => {
    this.setState({
      ...this.state,
      showCancelModal: !this.state.showCancelModal,
    });
  };

  render() {
    const { id, appointmentData, isLoading, showCancelModal } = this.state;
    const {
      check_out,
      check_out_time,
      warehouse_id,
      date,
      vehicleDetail,
      checkedStatus,
      appointment_Id,
      orderId,
    } = appointmentData;

    return (
      <div className="p-3">
        {isLoading ? (
          <Loader
            className="absolute top-1/2 left-1/2"
            type="Puff"
            color="#00BFFF"
          />
        ) : (
          <>
            {appointmentData.cancelAppointment ? (
              <>
                <div className="h-16"></div>
                <div className="max-w-7xl mx-auto py-6 px-2 smpx-6 lg:px-8">
                  <div className="max-w-none mx-auto">
                    <div className="bg-white overflow-hidden sm:rounded-lg sm:shadow">
                      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                        <div className="flex text-left mb-3">
                          <span className="text-left text-gray-900 text-lg font-medium">
                            Below appointment has been canceled: <br />{" "}
                            {appointmentData &&
                              check_out_time &&
                              moment(check_out_time)
                                .format("dddd, MMMM DD on hh:mm a")
                                .replace(" on ", " at ")}
                          </span>
                        </div>

                        <div className="text-left text-black text-sm">
                          Appointment with{" "}
                          {appointmentData &&
                            warehouse_id &&
                            warehouse_id.company_name}
                        </div>

                        <div className="text-left text-gray-700 text-base">
                          {" "}
                          {appointmentData &&
                            moment(date).format("h:mm a on dddd MM/DD/YYYY")}
                        </div>

                        <br />
                        <div className="text-left text-gray-700 text-base">
                          <ul>
                            {appointmentData &&
                              vehicleDetail.map((v) => {
                                return (
                                  <React.Fragment>
                                    <li>
                                      {v.yearMakeModel} {v.vinNumber}
                                    </li>{" "}
                                    <br />
                                  </React.Fragment>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="h-16"></div>
                {appointmentData && check_out ? (
                  <div className="max-w-7xl mx-auto py-6 px-2 smpx-6 lg:px-8">
                    <div className="max-w-none mx-auto">
                      <div className="bg-white overflow-hidden sm:rounded-lg sm:shadow">
                        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                          <div className="flex text-left mb-3">
                            <span className="text-left text-gray-900 text-lg font-medium">
                              You successfully checked out at: <br />{" "}
                              {appointmentData &&
                                check_out_time &&
                                moment(check_out_time)
                                  .format("dddd, MMMM DD on hh:mm a")
                                  .replace(" on ", " at ")}
                            </span>
                          </div>

                          <div className="text-left text-black text-sm">
                            Appointment with{" "}
                            {appointmentData &&
                              warehouse_id &&
                              warehouse_id.company_name}
                          </div>

                          <div className="text-left text-gray-700 text-base">
                            {" "}
                            {appointmentData &&
                              moment(date).format("h:mm a on dddd MM/DD/YYYY")}
                          </div>

                          <br />
                          <div className="text-left text-gray-700 text-base">
                            <ul>
                              {appointmentData &&
                                vehicleDetail.map((v) => {
                                  return (
                                    <React.Fragment>
                                      <li>
                                        {v.yearMakeModel} {v.vinNumber}
                                      </li>{" "}
                                      <br />
                                    </React.Fragment>
                                  );
                                })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {appointmentData && checkedStatus === "check-in" ? (
                      <div className="text-left text-black mb-12 mt-4 py-2 px-4 bg-green-100">
                        You're scanned-in. Ask the warehouse to scan you out
                        after you offload the vehicle(s)
                      </div>
                    ) : (
                      <Fragment>
                        <div className="text-center text-black mb-2">
                          You're all set!
                        </div>
                        <div className="font-medium mt-6 mb-5">
                          Scan this QR code when you arrive to{" "}
                          {appointmentData &&
                            warehouse_id &&
                            warehouse_id.company_name}
                          :
                        </div>
                      </Fragment>
                    )}
                    <div className="flex justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?data=${process.env.REACT_APP_FRONTEND}/driver-at-warehouse/${id}&amp;size=100x100`}
                        align="QR Code"
                        alt="QR Code"
                        className="w-2/5 h-2/5"
                      />
                    </div>
                    <div className="flex mt-10 text-left">
                      <label className="mr-2 w-1/4 text-black font-medium">
                        Appt ID:
                      </label>
                      <span className="pr-4 w-3/4 text-black font-normal text-sm">
                        {" "}
                        {appointmentData && appointment_Id}
                      </span>
                    </div>
                    {appointmentData?.orderId && (
                      <div className="flex mt-4 text-left">
                        <label className="mr-2 w-1/4 text-black font-medium">
                          Order ID:
                        </label>
                        <span className="pr-4 w-3/4 text-black font-normal text-sm">
                          {" "}
                          {appointmentData && orderId}
                        </span>
                      </div>
                    )}
                    <div className="flex mt-4 text-left">
                      <label className="mr-2 w-1/4 text-black font-medium">
                        When:
                      </label>
                      <span className="pr-4 w-3/4 text-black font-normal text-sm">
                        {" "}
                        {appointmentData &&
                          moment(date).format("h:mm a on dddd MM/DD/YYYY")}
                      </span>
                    </div>
                    <div className="flex mt-4 text-left">
                      <label className="mr-2 w-1/4 text-black font-medium">
                        Where:
                      </label>
                      <span className="pr-4 w-3/4 text-black font-normal text-sm">
                        {appointmentData &&
                          warehouse_id &&
                          warehouse_id.company_name}{" "}
                        <br />
                        {appointmentData &&
                          warehouse_id &&
                          warehouse_id.address}{" "}
                        <br />
                        {appointmentData &&
                          warehouse_id &&
                          warehouse_id.city},{" "}
                        {appointmentData && warehouse_id && warehouse_id.state}{" "}
                        {appointmentData &&
                          warehouse_id &&
                          warehouse_id.zip_code}
                        <br />
                        {appointmentData && warehouse_id && warehouse_id.number}
                      </span>
                    </div>
                    <div className="flex mt-4 text-left">
                      <label className="mr-2 w-1/4 text-black font-medium">
                        Vehicles:
                      </label>
                      <div className="pr-4 w-3/4 text-black font-normal text-sm">
                        {appointmentData &&
                          vehicleDetail?.length &&
                          vehicleDetail?.map((item, key) => {
                            if (item?.yearMakeModel) {
                              return (
                                <div>
                                  {item?.yearMakeModel} vin {item?.vinNumber}
                                </div>
                              );
                            }
                          })}
                      </div>
                    </div>
                    <br />
                    <br />
                    <p>
                      <span
                        onClick={this.modalHandler}
                        className="text-red-800 cursor-pointer"
                      >
                        Cancel Appointment
                      </span>
                    </p>
                    <br />
                    <br />
                    <br />
                  </div>
                )}
              </>
            )}
          </>
        )}
        <CancelAppointmentModel
          openModel={showCancelModal}
          cancelByDriver={true}
          modelHandler={this.modalHandler}
          sideBarData={appointmentData}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  driver: state.driver,
});
export default connect(mapStateToProps, { getSingleAppointment })(
  withRouter(Scan)
);
