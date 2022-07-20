import express from "express";
import {
  addAppointment,
  deleteAppointment,
  getAppointment,
  getAppointments,
  getAppointmentsByTeacher,
  searchByNameOrDepartment,
  studentAppointmentRequest,
  updateAppointment,
} from "../controllers/appointmentController.js";
import { isAuthenticatedUser } from "../middlewares/isAuthenticatedUser.js";
import { authorizeUserRoles } from "../utils/helpers/authorizeUserRoles.js";

const router = express.Router();

//add new appointment route
router.post(
  "/add",
  isAuthenticatedUser,
  authorizeUserRoles(["teacher", "systemAdmin"]),
  addAppointment
);

//get all appointments route
router.get("/all", isAuthenticatedUser, getAppointments);

//get single appointment by id route
router.get("/:id", isAuthenticatedUser, getAppointment);

//update appointment by id route
router.put(
  "/update/:id",
  isAuthenticatedUser,
  authorizeUserRoles(["teacher", "systemAdmin"]),
  updateAppointment
);

//delete appointment by id route
router.delete(
  "/delete/:id",
  isAuthenticatedUser,
  authorizeUserRoles(["teacher", "systemAdmin"]),
  deleteAppointment
);

//get teacher appointment by teacher id route
router.get("/teacher/:id", isAuthenticatedUser, getAppointmentsByTeacher);

//student appointment request route
router.post(
  "/addRequest",
  isAuthenticatedUser,
  authorizeUserRoles(["student"]),
  studentAppointmentRequest
);

//search by name or department route
router.get("/search/:searchValue", searchByNameOrDepartment);

// router.get("/course", getAppointmentsByCourse);
// router.get("/department", getAppointmentsByDepartment);
// router.get("/date", getAppointmentsByDate);
// router.get("/time", getAppointmentsByTime);
// router.get("/agenda", getAppointmentsByAgenda);
// router.get("/:date/:time", getAppointmentsByDateAndTime);

export default router;
