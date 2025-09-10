import { useEffect } from "react"
import "./App.css"

import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Route, Routes } from "react-router-dom"

import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import { Toaster } from "react-hot-toast"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgatePassword"
import UpdatePassword from "./pages/updatePassword"
import VerifyEmail from "./pages/VerifyEmail"
import About from "./pages/About"
import Contact from "./pages/Contact"
import MyProfile from "./components/core/Dashboard/MyProfile"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import Error from "./pages/Error"
import Cart from "./components/core/Dashboard/Cart"

import Settings from "./components/core/Dashboard/Setting"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses"
import { getUserDetails } from "./services/operations/profileAPI"
import { ACCOUNT_TYPE } from "./utils/constants"
import AddCourse from "./components/core/Dashboard/AddCourse"
import MyCourses from "./components/core/Dashboard/MyCourses"
import EditCourse from "./components/core/Dashboard/EditCourse"
import Catalog from "./pages/Catalog"
import CourseDetails from "./pages/CourseDetails"
import ViewCourse from "./pages/ViewCourse"
import VideoDetails from "./components/core/ViewCourses/VideoDetailsSidebar"
import NotesPage from "./pages/dashboard/PersonalNotes"
import NoteEditor from "./components/core/Dashboard/NoteEditor"

import Instructor from "./components/core/InstructorDashboard/Instructor"

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getUserDetails(token, navigate)) 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen w-full bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="catalog/:catalogName" element={<Catalog />} />
          <Route path="course/:courseId" element={<CourseDetails />} />
          
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

          {/* Private dashboard routes */}
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            {/* Common routes */}
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="settings" element={<Settings />} />

            {/* Student routes */}
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="cart" element={<Cart />} />
                <Route path="enrolled-courses" element={<EnrolledCourses />} />
                <Route path="Personal-Notes" element={<NotesPage />} />
                <Route path="Personal-Notes/new" element={<NoteEditor />} />
                <Route path="Personal-Notes/:noteId" element={<NoteEditor />} />
              </>
            )}

            {/* Instructor routes */}
            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="instructor" element={<Instructor />} />
                <Route path="add-course" element={<AddCourse />} />
                <Route path="my-courses" element={<MyCourses />} />
                <Route path="edit-course/:courseId" element={<EditCourse />} />
              </>
            )}
          </Route>

          {/* Course viewing route - accessible to all authenticated users */}
          <Route 
            path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
            element={
              <PrivateRoute>
                <ViewCourse />
              </PrivateRoute>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
