import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import UserModel from "../models/userModel.js";
import UserRequestModel from "../models/userRequestModel.js";

//dotenv config
dotenv.config({ path: "./backend/configs/config.env" });

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: `User with email ${email} does not exist` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: `Invalid password` });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // const options = {
    //   expires: new Date(
    //     Date.now() + process.env.COOKIE_EXPIRATION_TIME * 24 * 60 * 60 * 1000
    //   ),
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    // };

    res.status(200).json({
      message: `User ${user.name} has been logged in successfully`,
      result: user,
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

//update user by id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, course, department, agenda, date, time, role } =
    req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const user = await UserModel.findById(id).select("-password -__v");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${id} does not exist` });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        course,
        department,
        agenda,
        date,
        time,
        role,
      },
      { new: true }
    );

    res.status(200).json({
      message: `User ${updatedUser.name} has been updated successfully`,
      result: updatedUser,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

//get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await UserModel.find({ role: "teacher" });
    res.status(200).json(teachers);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

//get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await UserModel.find({ role: "student" });
    res.status(200).json(students);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

//get user by id
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id).select("-password -__v");
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${id} does not exist` });
    }
    res.status(200).json({
      message: `User ${user.name} has been fetched successfully`,
      result: user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

//delete user by id
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${id} does not exist` });
    }
    await UserModel.findByIdAndDelete(id);
    res.status(200).json({
      message: `User ${user.name} has been deleted successfully`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

//logout user
export const logoutUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with id ${id} does not exist` });
    }
    res.clearCookie("token");
    res.status(200).json({
      message: `User ${user.name} has been logged out successfully`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

//send registration request to admin[systemAdmin]
export const sendRegistrationRequest = async (req, res) => {
  const { name, email, password, status, role } = req.body;
  try {
    //check if user already exists
    let user = await UserModel.findOne({ email });
    user = await UserRequestModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: `User with email ${email} already exists in the user list`,
      });
    }

    //system admin can't send registration request
    if (role === "systemAdmin") {
      return res.status(400).json({
        message: `${req.role} can't send registration request`,
      });
    }

    //password encryption
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user and send registration request to admin
    const requestUser = new UserRequestModel({
      name,
      email,
      password: hashedPassword,
      role,
      status,
    });

    //create token
    const token = jwt.sign(
      { id: requestUser._id, email: requestUser.email, role: requestUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    //check if user already requested for registration
    const request = await UserRequestModel.findOne({ email });
    if (request) {
      return res.status(400).json({
        message: `User with email ${email} already requested`,
      });
    }
    const savedUser = await requestUser.save();

    return res.status(200).json({
      message: `User ${name} has been requested for registration`,
      result: savedUser,
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

//get all user registration requests
export const getAllUserRegistrationRequests = async (req, res) => {
  try {
    const requests = await UserRequestModel.find({})
      .populate("userId", "name email")
      .select("-password -__v");

    if (requests.length === 0) {
      return res.status(404).json({
        message: `No registration requests found`,
      });
    }
    res.status(200).json(requests);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

//approve user registration request
export const approveUserRegistrationRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await UserRequestModel.findById(id);
    if (!request) {
      return res.status(404).json({
        message: `User registration request with id ${id} does not exist`,
      });
    }

    //get all information from request
    const {
      name: requestName,
      email: requestEmail,
      password: requestPassword,
      course: requestCourse,
      department: requestDepartment,
      role: requestRole,
    } = request;

    //create new user
    const user = new UserModel({
      name: requestName,
      email: requestEmail,
      password: requestPassword,
      course: requestCourse,
      department: requestDepartment,
      role: requestRole,
    });

    //create token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const newUser = await user.save();

    //delete request
    await UserRequestModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: `User ${requestName} has been approved successfully`,
      result: newUser,
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

//reject user registration request
export const rejectUserRegistrationRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await UserRequestModel.findById(id);
    if (!request) {
      return res.status(404).json({
        message: `User registration request with id ${id} does not exist`,
      });
    }

    //check if user already exists
    const user = await UserModel.findOne({ email: request.email });
    if (user) {
      return res.status(400).json({
        message: `User with email ${request.email} already exists in the user list`,
      });
    }

    await UserRequestModel.findByIdAndDelete(id);
    res.status(200).json({
      message: `User ${id} has been rejected successfully`,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};
