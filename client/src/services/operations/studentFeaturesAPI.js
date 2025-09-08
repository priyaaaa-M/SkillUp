import { toast } from "react-hot-toast"

import rzpLogo from "../../../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiconnector"
import { studentEndpoints, profileEndpoints } from "../apis"

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

// Load the Razorpay SDK from the CDN
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

// Check if user has already purchased the courses
async function checkExistingPurchases(courses, token) {
    try {
        const response = await apiConnector(
            "GET",
            profileEndpoints.GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        )

        if (response.data.data && response.data.data.length > 0) {
            const enrolledCourseIds = response.data.data.map(course => course._id);
            const alreadyPurchased = courses.filter(course => 
                enrolledCourseIds.includes(course._id)
            );
            return alreadyPurchased;
        }
        return [];
    } catch (error) {
        console.error("Error checking existing purchases:", error);
        // In case of error, assume no courses are purchased to avoid blocking the payment flow
        return [];
    }
}

// Buy the Course
export async function BuyCourse(
    token,
    courses,
    user_details,
    navigate,
    dispatch
) {
    const toastId = toast.loading("Loading...")
    try {
        // First check if user has already purchased any of these courses
        const alreadyPurchased = await checkExistingPurchases(courses, token)
        
        if (alreadyPurchased.length > 0) {
            const courseNames = alreadyPurchased.map(course => course.courseName).join(', ')
            toast.error(`You have already purchased: ${courseNames}`)
            return
        }
        
        // Loading the script of Razorpay SDK
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if (!res) {
            toast.error(
                "Razorpay SDK failed to load. Check your Internet Connection."
            )
            return
        }

        // Initiating the Order in Backend
        const orderResponse = await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            {
                courses,
            },
            {
                Authorization: `Bearer ${token}`,
            }
        )

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message)
        }
        console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)

        // Get Razorpay key from backend response
        console.log('Order response data:', orderResponse.data);
        const razorpayKey = orderResponse.data.data.razorpayKey || orderResponse.data.data.key_id;
        console.log('Razorpay key from response:', razorpayKey);
        if (!razorpayKey) {
            throw new Error("Razorpay key not found in response");
        }

        // Opening the Razorpay SDK
        const options = {
            key: razorpayKey,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name: "SkillUp",
            description: "Thank you for Purchasing the Course.",
            image: rzpLogo,
            prefill: {
                name: `${user_details.firstName} ${user_details?.lastName || ''}`.trim(),
                email: user_details.email,
            },
            handler: function (response) {
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
                verifyPayment({ ...response, courses }, token, navigate, dispatch)
            },
        }
        const paymentObject = new window.Razorpay(options)

        paymentObject.open()
        paymentObject.on("payment.failed", function (response) {
            toast.error("Oops! Payment Failed.")
            console.log(response.error)
        })
    } catch (error) {
        console.log("PAYMENT API ERROR............", error)
        toast.error("Could Not make Payment.")
    }
    toast.dismiss(toastId)
}

// Verify the Payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...")
    dispatch(setPaymentLoading(true))
    
    try {
        console.log('Sending verification request with data:', {
            endpoint: COURSE_VERIFY_API,
            bodyData,
            headers: { Authorization: `Bearer ${token}` }
        });

        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        })

        console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

        if (!response.data.success) {
            console.error('Verification failed:', response.data);
            throw new Error(response.data.message || 'Payment verification failed')
        }

        toast.success("Payment Successful. You are being redirected to the courses page.")
        dispatch(resetCart())
        navigate("/dashboard/enrolled-courses")
    } catch (error) {
        console.log("PAYMENT VERIFY ERROR............", error)
        toast.error("Could Not Verify Payment.")
    }
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
}

// Send the Payment Success Email
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            {
                Authorization: `Bearer ${token}`,
            }
        )
    } catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
    }
}
