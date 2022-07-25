import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./Components/Shared/Navbar";
import Login from "./Components/Users/Login";
import Profile from "./Components/Users/Profile";
import Register from "./Components/Users/Register";
import Requests from "./Components/Users/Requests";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { setUser } from "./redux/features/userSlice";

function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/request" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/requests" element={<Requests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
