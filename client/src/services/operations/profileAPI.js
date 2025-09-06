import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const { 
  GET_USER_DETAILS_API, 
  GET_USER_ENROLLED_COURSES_API, 
  GET_INSTRUCTOR_DASHBOARD_API 
} = profileEndpoints

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
      dispatch(setUser({ ...response.data.data, image: userImage }))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error("Could Not Get User Details")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");
    // console.log(
    //   "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
    //   response
    // )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }
  toast.dismiss(toastId)
  return result
}

export async function getInstructorDashboardData(token) {
  let result = []
  try {
    console.log("Fetching instructor dashboard data...")
    const response = await apiConnector("GET", GET_INSTRUCTOR_DASHBOARD_API, null, {
      Authorization: `Bearer ${token}`,
    })
    
    console.log("Instructor dashboard response:", response)
    
    if (!response.data) {
      throw new Error("No data received from server")
    }
    
    // Check if courses array exists in the response
    if (Array.isArray(response.data)) {
      result = response.data
    } else if (response.data.courses) {
      result = response.data.courses
    } else if (response.data.data) {
      result = response.data.data
    }
    
    console.log("Processed courses data:", result)
    
  } catch (error) {
    console.error("GET_INSTRUCTOR_DASHBOARD_API ERROR:", error)
    toast.error(error.message || "Failed to fetch instructor dashboard data")
  }
  return result || []
}