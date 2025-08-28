
import { useEffect } from "react"
import "./App.css";


import { useDispatch, useSelector } from "react-redux"
// React Router
import { useNavigate } from "react-router-dom"

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgatePassword";
import UpdatePassword from "./pages/updatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error"
import Cart from "./components/core/Dashboard/Cart"

import Settings from "../src/components/core/Dashboard/Setting/index";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import { getUserDetails } from "./services/operations/profileAPI"
import { ACCOUNT_TYPE } from "./utils/constants"
import AddCourse from "./components/core/Dashboard/AddCourse"

//import ProfileDropdown from "./components/core/Auth/ProfileDropDown";

function App() {


  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])




  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* Private routes */}
        <Route

          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* 👇 Nested protected routes */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />



          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/Cart" element={<Cart />} />

                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />


              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/add-course" element={<AddCourse />} />

                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />


              </>
            )
          }




          {/* you can add more dashboard subroutes here */}




        </Route>
        <Route path="*" element={<Error />} />





      </Routes>


    </div>
  );
}
export default App;
