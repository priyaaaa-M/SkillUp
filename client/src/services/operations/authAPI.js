import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { clearCart, fetchUserCart, resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate, returnTo = "/dashboard/my-profile") {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...")
    dispatch(setLoading(true))
    try {
      console.log("Attempting login with email:", email)
      
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      }, {
        'Content-Type': 'application/json',
      })

      console.log("LOGIN API RESPONSE:", response)

      if (!response.data || !response.data.success) {
        const errorMessage = response.data?.message || 'Login failed. Please try again.'
        console.error("Login failed:", errorMessage)
        throw new Error(errorMessage)
      }

      const { token, user } = response.data
      
      if (!token) {
        throw new Error('No authentication token received')
      }

      // Update user data in Redux and localStorage
      const userImage = user?.image 
        ? user.image 
        : `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName || ''} ${user.lastName || ''}`
      
      const userData = { 
        ...user, 
        image: userImage 
      }
      
      // Store token and user data
      dispatch(setToken(token))
      dispatch(setUser(userData))
      
      // Save to localStorage
      localStorage.setItem("token", JSON.stringify(token))
      localStorage.setItem("user", JSON.stringify(userData))
      
      toast.success("Login Successful! Redirecting...")
      
      // Fetch user's cart after successful login
      try {
        await dispatch(fetchUserCart()).unwrap()
      } catch (error) {
        console.error("Failed to fetch user's cart:", error)
        // Continue with login even if cart fetch fails
      }
      
      // Navigate to the returnTo URL if provided, otherwise go to the dashboard
      const redirectPath = returnTo || "/dashboard/my-profile"
      console.log("Redirecting to:", redirectPath)
      navigate(redirectPath, { replace: true })
      
    } catch (error) {
      console.error("LOGIN ERROR:", error)
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please try again."
      toast.error(errorMessage)
    } finally {
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
}


export const logout = (navigate) => {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}





export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, { email, })

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    }
    catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  }
}

export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, { password, confirmPassword, token });

      console.log("RESET Password RESPONSE ... ", response);


      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");
    }
    catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }
    dispatch(setLoading(false));
  }
}





