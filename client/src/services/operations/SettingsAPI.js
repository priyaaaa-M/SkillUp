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
  return async (dispatch, getState) => {
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

      // ✅ Preserve existing user fields and only update image
      const prevUser = getState()?.profile?.user || {}
      const serverUser = response.data.data || {}
      // Only update the image; keep all existing fields intact
      const newImage = serverUser.image || serverUser?.data?.image || serverUser?.secure_url || prevUser.image
      const updatedUser = { ...prevUser, image: newImage }

      // ✅ Update Redux & localStorage
      dispatch(setUser(updatedUser))
      localStorage.setItem("user", JSON.stringify(updatedUser))

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
    const toastId = toast.loading("Updating profile...")
    try {
      console.log("Sending profile update request:", formData);
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      })
      console.log("UPDATE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update profile")
      }

      // The server should return updatedUserDetails with the profile populated
      const updatedUserDetails = response.data.updatedUserDetails;
      
      if (!updatedUserDetails) {
        throw new Error("No user details returned from server");
      }

      // Format the user object for Redux
      const updatedUser = {
        ...updatedUserDetails,
        image: updatedUserDetails.image || 
          `https://api.dicebear.com/5.x/initials/svg?seed=${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`,
        additionalDetails: {
          about: updatedUserDetails.additionalDetails?.about || "",
          gender: updatedUserDetails.additionalDetails?.gender || "",
          dateOfBirth: updatedUserDetails.additionalDetails?.dateOfBirth || "",
          contactNumber: updatedUserDetails.additionalDetails?.contactNumber || "",
        },
      }

      console.log("Updated user object for Redux:", updatedUser);
      
      // Update Redux store and localStorage
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success("Profile updated successfully!");
      return { success: true };
      
    } catch (error) {
      console.error("UPDATE_PROFILE_API ERROR:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      toast.dismiss(toastId);
    }
  };
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
