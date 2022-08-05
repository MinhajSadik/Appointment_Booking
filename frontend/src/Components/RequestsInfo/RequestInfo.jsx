import moment from "moment";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  approveStudentAppointment,
  approveStudentRequest,
  rejectStudentAppointment,
  rejectStudentRequest,
} from "../../redux/features/appointmentSlice";

const RequestInfo = ({ appointmentRequest }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleApprove = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to approve this request?"
    );
    if (confirm) {
      dispatch(approveStudentAppointment({ id }));
      dispatch(approveStudentRequest({ id, navigate, toast }));
    }
  };

  const handleReject = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to reject this request?"
    );
    if (confirm) {
      dispatch(rejectStudentAppointment({ id }));
      dispatch(rejectStudentRequest({ id, navigate, toast }));
    }
  };
  return (
    <div className="pl-2 flex">
      <div className="flex-1 mb-5">
        <div className="flex items-center justify-between">
          <p className="text-sm leading-none py-1 w-72">
            <span className="text-indigo-700 uppercase italic">
              {appointmentRequest?.studentId?.name}
            </span>{" "}
            <small>sent an appointment request</small>
          </p>
          <p className="text-sm leading-none py-1">
            <span className="text-black">
              {appointmentRequest?.studentId?.email}
            </span>
          </p>
        </div>
        <p className="text-sm leading-none py-1 w-72">
          <small className="text-yellow-500">subject name as: </small>
          <span className="text-indigo-700 px-1 italic">
            {appointmentRequest?.name}
          </span>{" "}
        </p>
        <p className="text-xs inline-block py-1 mr-3 leading-none text-center whitespace-nowrap font-bold text-white rounded-full ">
          <span className="text-xs inline-block py-1 px-1 leading-none text-center whitespace-nowrap align-baseline font-bold bg-yellow-500 text-white rounded-full">
            {appointmentRequest?.status}
          </span>
        </p>
        <button
          type="button"
          onClick={() => handleApprove(appointmentRequest._id)}
          className="text-xs w-20 inline-block py-1 px-2.5 mr-3 leading-none text-center whitespace-nowrap font-bold bg-blue-600 text-white rounded-full hover:bg-red-700"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => handleReject(appointmentRequest._id)}
          className="text-xs w-20 inline-block py-1 px-2.5 mr-3 leading-none text-center whitespace-nowrap font-bold bg-red-600 text-white rounded-full hover:bg-pink-700"
        >
          Reject
        </button>
        <p className="text-xs leading-3 py-1 text-blue-600 w-48">
          {moment(appointmentRequest.createdAt).startOf().fromNow()}
        </p>
      </div>
    </div>
  );
};

export default RequestInfo;
