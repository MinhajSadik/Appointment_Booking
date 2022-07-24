import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "../../redux/features/userSlice";

const initialState = {
  name: "",
  email: "",
  course: "",
  departmenet: "",
  agenda: "",
  date: "",
  time: "",
  role: "",
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state.user }));
  const [edit, setEdit] = useState(false);
  const [userInfo, setUserInfo] = useState(initialState);
  const { name, email, course, department, agenda, date, time, role } =
    userInfo;

  const systemAdmin = user?.result?.role === "systemAdmin";

  //when click on edit button fill the form with the user info
  const handleEdit = () => {
    //change the profile student and teacher check
    if (!systemAdmin) {
      setUserInfo({
        name: user?.result?.name,
        email: user?.result?.email,
        course: user?.result?.course,
        department: user?.result?.department,
        agenda: user?.result?.agenda,
        date: user?.result?.date,
        role: user?.result?.role,
      });
    }
    setEdit(!edit);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleProfileUpdate = (e) => {
    //update the profile
    e.preventDefault();
    dispatch(updateUserInfo(userInfo, user?.result?._id));
    setEdit(false);
  };

  return (
    <>
      <div className="p-8">
        <div className="bg-white shadow">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="relative"></div>
          </div>
          <div className="mt-10 text-center border-b pb-12">
            <h4 className="text-4xl font-medium text-gray-700">
              Hi, {user?.result?.name}
              <small className="font-light text-gray-500 m-2">
                {user?.result?.role}
              </small>
            </h4>
            <p className="font-light text-gray-600 mt-3">
              Email: {user?.result?.email}
            </p>

            {!systemAdmin && (
              <>
                <p className="mt-8 text-gray-500">
                  Course: {user?.result?.course}
                </p>
                <p className="mt-2 text-gray-500">
                  Department: {user?.result?.department}
                </p>
                <p className="mt-2 text-gray-500">{user?.result?.agenda}</p>
                <p className="mt-2 text-gray-500">
                  {moment(user?.result?.createdAt).format("MMMM Do YYYY")}
                </p>
                <p className="mt-2 text-gray-500">
                  {moment(user?.result?.updatedAt).format("MMMM Do YYYY")}
                </p>
              </>
            )}
          </div>
          {/* edit profile button */}
          {!systemAdmin && (
            <div className="text-center">
              <button
                className="bg-blue-500 text-white px-4 m-5 py-2 rounded-full hover:bg-blue-700"
                onClick={() => handleEdit()}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
      {
        //edit profile form
        edit && (
          <div className="h-screen py-5 px-3 bg-white items-center">
            <div className="bg-white">
              <form onSubmit={handleProfileUpdate}>
                <h4 className="flex justify-center p-3 text-[22px]">
                  Edit Your Profile
                </h4>
                <div className="md:grid grid-cols-12 flex flex-col md:items-center gap-4 p-4">
                  <div className="col-span-6 relative">
                    <span className="absolute bg-white left-3 -top-[12px] px-2">
                      Name similar to your email address
                    </span>
                    <input
                      type="name"
                      name="name"
                      id="name"
                      value={name}
                      onChange={onInputChange}
                      placeholder="what's your first part of email name"
                      className="text-[13px] h-12 text-gray-700 w-full border-2 px-2 rounded-sm"
                    />
                  </div>

                  <div className="col-span-6 relative">
                    <span className="absolute bg-white left-3 -top-[12px] px-2">
                      Do you have another email?
                    </span>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={onInputChange}
                      placeholder="do you wanna change your email?"
                      className="text-[13px] h-12 text-gray-700 w-full border-2 px-2 rounded-sm"
                    />
                  </div>

                  <div className="col-span-6 relative">
                    <span className="absolute bg-white left-3 -top-[12px] px-2">
                      What course you are in?
                    </span>
                    <input
                      type="text"
                      name="course"
                      id="course"
                      value={course}
                      onChange={onInputChange}
                      placeholder="what course are you in"
                      className="text-[13px] h-12 text-gray-700 w-full border-2 px-2 rounded-sm"
                    />
                  </div>

                  <div className="col-span-6 relative">
                    <span className="absolute bg-white left-3 -top-[12px] px-2">
                      Which department are you in?
                    </span>
                    <input
                      type="text"
                      name="department"
                      id="department"
                      value={department}
                      onChange={onInputChange}
                      placeholder="which department you are in"
                      className="text-[13px] h-12 text-gray-700 w-full border-2 px-2 rounded-sm"
                    />
                  </div>

                  <div className="col-span-6 relative">
                    <span className="absolute bg-white left-3 -top-[12px] px-2">
                      what's your agenda?
                    </span>
                    <input
                      type="text"
                      name="agenda"
                      id="agenda"
                      value={agenda}
                      onChange={onInputChange}
                      placeholder="what's your agenda"
                      className="text-[13px] h-12 text-gray-700 w-full border-2 px-2 rounded-sm"
                    />
                  </div>

                  <div className="col-span-6 relative">
                    <span className="absolute bg-white left-3 -top-[12px] px-2">
                      Available Date
                    </span>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={date}
                      onChange={onInputChange}
                      placeholder="available date"
                      className="text-[13px] h-12 text-gray-700 w-full border-2 px-2 rounded-sm"
                    />
                  </div>

                  <div className="col-span-6 relative">
                    <span className="absolute bg-white left-3 -top-[12px] px-2">
                      Available Time
                    </span>
                    <input
                      type="time"
                      name="time"
                      id="time"
                      value={time}
                      onChange={onInputChange}
                      placeholder="available time"
                      className="text-[13px] h-12 text-gray-700 w-full border-2 px-2 rounded-sm"
                    />
                  </div>

                  <div className="col-span-6 relative">
                    <span className="absolute bg-white left-3 -top-[12px] px-2">
                      Role
                    </span>
                    <input
                      type="role"
                      name="role"
                      id="role"
                      value={role}
                      onChange={onInputChange}
                      placeholder="is that change mistakenly?"
                      className="text-[13px] h-12 text-gray-700 w-full border-2 px-2 rounded-sm"
                    />
                  </div>
                </div>

                <div className="px-4 text-right py-2">
                  <button className="h-10 w-32 rounded-sm shadow-md text-white text-[16px] hover:bg-green-700 bg-green-600">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </>
  );
};

export default Profile;
