import { toast } from "react-hot-toast"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      console.log("UPDATE_DISPLAY_PICTURE_API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      // ✅ Update Redux
      dispatch(setUser(response.data.data))

      // ✅ Update localStorage (so refresh ke baad bhi naya image mile)
      localStorage.setItem("user", JSON.stringify(response.data.data))

      toast.success("Display Picture Updated Successfully")
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API ERROR............", error)
      toast.error(error.response?.data?.message || "Could Not Update Display Picture")
    } finally {
      toast.dismiss(toastId)
    }
  }
}



export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      console.log("UPDATE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      const userDetails = response.data.userDetails
      const profile = response.data.profile

      // final user object ready for redux
      const updatedUser = {
        ...userDetails,
        image: userDetails.image
          ? userDetails.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${userDetails.firstName} ${userDetails.lastName}`,
        additionalDetails: {
          about: profile?.about,
          gender: profile?.gender,
          dateOfBirth: profile?.dateOfBirth,
          contactNumber: profile?.contactNumber,
        },
      }

      // save in redux + localStorage
      dispatch(setUser(updatedUser))
      localStorage.setItem("user", JSON.stringify(updatedUser))

      console.log("Dispatched user object:", updatedUser)
      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}



export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "POST",
      CHANGE_PASSWORD_API,
      formData, // { oldPassword, newPassword, confirmNewPassword }
      {
        Authorization: `Bearer ${token}`,
      }
    )

    console.log("CHANGE_PASSWORD_API RESPONSE:", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Password Changed Successfully")
  } catch (error) {
    console.log("CHANGE_PASSWORD_API ERROR:", error)

    toast.error(error.response?.data?.message || "Something went wrong")
  }
  toast.dismiss(toastId)
}



export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}
