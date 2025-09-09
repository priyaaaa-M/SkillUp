// In client/src/services/apis.js
export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000/api/v1";

// PAYMENT ENDPOINTS
export const paymentEndpoints = {
  CREATE_PAYMENT_INTENT: BASE_URL + "/payment/create-payment-intent",
  VERIFY_PAYMENT: BASE_URL + "/payment/verify-payment",
  SAVE_PAYMENT_DETAILS: BASE_URL + "/payment/save-payment-details",
  GET_PAYMENT_HISTORY: BASE_URL + "/payment/payment-history",
};

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  ...paymentEndpoints, 
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DASHBOARD_API: BASE_URL + "/profile/instructorDashboard",
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
  ENROLL_COURSES: BASE_URL + "/profile/enroll-courses",
  CHECK_ENROLLED_COURSES: BASE_URL + "/profile/check-enrolled-courses",
}


// COURSE ENDPOINTS
// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getAverageRating",
  GET_ALL_REVIEWS: BASE_URL + "/course/getAllReviews",
}

// CART ENDPOINTS
export const cart = {
  GET_CART_API: BASE_URL + "/cart/get-cart",
  ADD_TO_CART_API: BASE_URL + "/cart/add-to-cart",
  REMOVE_FROM_CART_API: BASE_URL + "/cart/remove-from-cart",
  CLEAR_CART_API: BASE_URL + "/cart/clear-cart",
}


// CATEGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
}
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

// NOTES API
export const notes = {
  CREATE_NOTE: BASE_URL + "/notes",
  GET_NOTES: BASE_URL + "/notes",
  UPDATE_NOTE: BASE_URL + "/notes",
  DELETE_NOTE: BASE_URL + "/notes",
}
