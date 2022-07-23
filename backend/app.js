import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./configs/mdb.js";

dotenv.config({ path: "./configs/config.env" });
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(cookieParser());

connectDB();

app.all("/", (req, res) => {
  console.log(`Welcome to the ${process.env.APP_NAME} Console 🚀 Viewer`);
  return res.status(200).send({
    message: `Welcome to the ${process.env.APP_NAME} App 👨🏻‍💻 Viewer`,
  });
});

import appointmentRoute from "./routes/appointmentRoute.js";
import userRoute from "./routes/userRoute.js";
app.use("/api/user", userRoute);
app.use("/api/appointment", appointmentRoute);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
