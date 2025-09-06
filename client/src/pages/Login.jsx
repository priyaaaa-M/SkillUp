import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import loginImg from "../../../assets/Images/login.png"
import Template from "../components/core/Auth/Template"

function Login() {
  const { token } = useSelector((state) => state.auth)
  const location = useLocation()
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    if (token) {
      // If there's a return URL in the location state, navigate there
      // Otherwise, go to the dashboard
      const returnTo = location.state?.from || "/dashboard/my-profile"
      navigate(returnTo, { replace: true })
    }
  }, [token, navigate, location.state])

  return (
    <Template
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={loginImg}
      formType="login"
      returnTo={location.state?.from}
    />
  )
}

export default Login