import { toast } from "react-hot-toast";
import { updateCompletedLectures } from "../../slices/viewCourseSlice";
import { apiConnector } from "../apiconnector";
import { courseEndpoints, ratingsEndpoints } from "../apis";

// Destructure all endpoint constants once
const {
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    GET_ALL_COURSE_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    CREATE_RATING_API,
    LECTURE_COMPLETION_API,
} = courseEndpoints;

/**
 * Calculates the average rating from an array of rating objects
 * @param {Array} ratingArr - Array of rating objects containing a 'rating' property
 * @returns {number} - Average rating rounded to 1 decimal place, or 0 if no ratings
 */
export const getAvgRating = (ratingArr) => {
  if (!ratingArr || !Array.isArray(ratingArr) || ratingArr.length === 0) {
    return 0;
  }
  
  const totalRatings = ratingArr.reduce((acc, curr) => {
    return acc + (Number(curr.rating) || 0);
  }, 0);
  
  const avgRating = totalRatings / ratingArr.length;
  return parseFloat(avgRating.toFixed(1));
};

export const getAllCourses = async () => {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiConnector("GET", GET_ALL_COURSE_API)
        if (!response?.data?.success) {
            throw new Error("Could Not Fetch Course Categories")
        }
        result = response?.data?.data
    } catch (error) {
        console.log("GET_ALL_COURSE_API API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

// Helper function to create a consistent error object
const createError = (message, originalError = null) => {
  return {
    success: false,
    message: message,
    error: originalError ? (originalError.message || String(originalError)) : message,
    data: null,
    originalError: process.env.NODE_ENV === 'development' ? originalError : undefined
  };
};

export const fetchCourseDetails = async (courseId) => {
  console.log('fetchCourseDetails called with courseId:', courseId);
  const toastId = toast.loading("Loading course details...");
  
  try {
    // Validate courseId
    if (!courseId || typeof courseId !== 'string' || courseId.trim() === '') {
      const error = new Error('Invalid course ID provided');
      console.error('Validation error:', error.message);
      throw error;
    }

    const trimmedCourseId = courseId.trim();
    console.log('Making API call to:', COURSE_DETAILS_API, 'with courseId:', trimmedCourseId);
    
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId: trimmedCourseId,
    });
    
    console.log("API Response:", {
      status: response?.status,
      hasData: !!response?.data,
      success: response?.data?.success
    });

    // Handle no response
    if (!response) {
      throw new Error('No response received from server');
    }

    // Handle network errors or non-2xx responses
    if (response.status && (response.status < 200 || response.status >= 300)) {
      throw new Error(response.data?.message || `Request failed with status ${response.status}`);
    }

    // Handle no data in response
    if (!response.data) {
      throw new Error('No data received in response');
    }

    // Handle API error responses
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch course details');
    }

    // Ensure we have the expected data structure
    if (!response.data.data || !response.data.data.courseDetails) {
      console.error('Unexpected API response structure:', response.data);
      throw new Error('Invalid course data received from server');
    }

    console.log('Course details fetched successfully');
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Course details fetched successfully'
    };
    
  } catch (error) {
    console.error("Error in fetchCourseDetails:", {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    });
    
    // Create a consistent error response
    const errorResponse = createError(
      error?.response?.data?.message || 
      error?.message || 
      'Failed to load course details. Please try again later.',
      error
    );
    
    // Show error toast (except for 404s which are handled by the component)
    if (!error?.response || error.response.status !== 404) {
      toast.error(errorResponse.message);
    }
    
    return errorResponse;
    
  } finally {
    toast.dismiss(toastId);
  }
};

// fetching the available course categories
export const fetchCourseCategories = async () => {
    let result = []
    try {
        const response = await apiConnector("GET", COURSE_CATEGORIES_API)
        console.log("COURSE_CATEGORIES_API API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Fetch Course Categories")
        }
        result = response?.data?.data
    } catch (error) {
        console.log("COURSE_CATEGORY_API API ERROR............", error)
        toast.error(error.message)
    }
    return result
}

// add the course details
export const addCourseDetails = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CREATE_COURSE_API, data, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })
        console.log("CREATE COURSE API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Add Course Details")
        }
        toast.success("Course Details Added Successfully")
        result = response?.data?.data
    } catch (error) {
        console.log("CREATE COURSE API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

// edit the course details
export const editCourseDetails = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", EDIT_COURSE_API, data, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })
        console.log("EDIT COURSE API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Update Course Details")
        }
        toast.success("Course Details Updated Successfully")
        result = response?.data?.data
    } catch (error) {
        console.log("EDIT COURSE API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

// create a section
export const createSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CREATE_SECTION_API, data, {
            Authorization: `Bearer ${token}`,
        })
        console.log("CREATE SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Create Section")
        }
        toast.success("Course Section Created")
        result = response?.data?.updatedCourse
    } catch (error) {
        console.log("CREATE SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

// create a subsection
export const createSubSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
            Authorization: `Bearer ${token}`,
        })
        console.log("CREATE SUB-SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Add Lecture")
        }
        toast.success("Lecture Added")
        result = response?.data?.data
    } catch (error) {
        console.log("CREATE SUB-SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

// update a section
export const updateSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
            Authorization: `Bearer ${token}`,
        })
        console.log("UPDATE SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Update Section")
        }
        toast.success("Course Section Updated")
        result = response?.data?.data
    } catch (error) {
        console.log("UPDATE SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

// update a subsection
export const updateSubSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
            Authorization: `Bearer ${token}`,
        })
        console.log("UPDATE SUB-SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Update Lecture")
        }
        toast.success("Lecture Updated")
        result = response?.data?.data
    } catch (error) {
        console.log("UPDATE SUB-SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

// delete a section
export const deleteSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", DELETE_SECTION_API, data, {
            Authorization: `Bearer ${token}`,
        })
        console.log("DELETE SECTION API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Delete Section")
        }
        toast.success("Course Section Deleted")
        result = response?.data?.data
    } catch (error) {
        console.log("DELETE SECTION API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}
// delete a subsection
export const deleteSubSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")

    try {
        const response = await apiConnector(
            "POST",
            DELETE_SUBSECTION_API,
            { subSectionId: data.subSectionId, sectionId: data.sectionId },
            { Authorization: `Bearer ${token}` }
        )

        console.log("DELETE SUB-SECTION API RESPONSE............", response)

        if (!response?.data?.success) {
            throw new Error("Could Not Delete Lecture")
        }

        toast.success("Lecture Deleted")
        result = response?.data?.data
    } catch (error) {
        console.log("DELETE SUB-SECTION API ERROR............", error)
        toast.error(error.response?.data?.message || error.message)
    }

    toast.dismiss(toastId)
    return result
}


// fetching all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
    let result = []
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector(
            "GET",
            GET_ALL_INSTRUCTOR_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        )
        console.log("INSTRUCTOR COURSES API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Fetch Instructor Courses")
        }
        // Ensure each course has an enrollmentCount field
        result = response?.data?.data.map(course => ({
            ...course,
            enrollmentCount: course.enrollmentCount || (course.studentsEnroled ? course.studentsEnroled.length : 0)
        }))
    } catch (error) {
        console.log("INSTRUCTOR COURSES API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

// delete a course
export const deleteCourse = async (data, token) => {
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
            Authorization: `Bearer ${token}`,
        })
        console.log("DELETE COURSE API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Delete Course")
        }
        toast.success("Course Deleted")
    } catch (error) {
        console.log("DELETE COURSE API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
}

// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
    console.log("getFullDetailsOfCourse called with:", { courseId, hasToken: !!token });
    const toastId = toast.loading("Loading...");
    let result = null;
    
    try {
        console.log("Making API call to:", GET_FULL_COURSE_DETAILS_AUTHENTICATED);
        console.log("Request payload:", { courseId });
        
        const response = await apiConnector(
            "POST",
            GET_FULL_COURSE_DETAILS_AUTHENTICATED,
            { courseId },
            { Authorization: `Bearer ${token}` }
        );
        
        console.log("COURSE_FULL_DETAILS_API API RESPONSE:", {
            status: response.status,
            data: response.data,
            headers: response.headers
        });

        if (!response.data.success) {
            console.error("API returned non-success response:", response.data);
            throw new Error(response.data.message || "Failed to fetch course details");
        }
        
        if (!response.data.data || !response.data.data.courseDetails) {
            console.error("No course details in response:", response.data);
            throw new Error("No course details found in response");
        }
        
        result = response.data;
    } catch (error) {
        console.error("COURSE_FULL_DETAILS_API API ERROR:", {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });
        
        result = {
            success: false,
            message: error.response?.data?.message || 
                    error.message || 
                    "Failed to fetch course details. Please try again later.",
            error: error.response?.data || error
        };
    } finally {
        toast.dismiss(toastId);
    }
    
    console.log("getFullDetailsOfCourse result:", result);
    return result;
};

// mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
    let result = { success: false, message: "" }
    console.log("mark complete data", data)
    const toastId = toast.loading("Marking as complete...")
    try {
        const response = await apiConnector(
            "POST",
            courseEndpoints.LECTURE_COMPLETION_API,
            { 
                courseId: data.courseId,
                subsectionId: data.subsectionId 
            },
            {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        )
        
        console.log("MARK_LECTURE_AS_COMPLETE_API API RESPONSE:", response)

        // Check if the response indicates success (either through status or data)
        if (response.status === 200 || response.data?.message === "Course progress updated") {
            result = { 
                success: true, 
                message: "Lecture marked as completed!" 
            }
            toast.success(result.message)
        } else {
            const errorMsg = response.data?.message || "Failed to mark lecture as completed"
            console.error("API Error:", errorMsg)
            throw new Error(errorMsg)
        }
    } catch (error) {
        console.error("MARK_LECTURE_AS_COMPLETE_API API ERROR:", error)
        // Only show error toast if it's not a success message
        if (error.message !== "Course progress updated") {
            result.message = error.response?.data?.message || error.message || "Failed to mark lecture as completed"
            toast.error(result.message)
        } else {
            result = { 
                success: true, 
                message: "Lecture marked as completed!" 
            }
            toast.success(result.message)
        }
    }
    toast.dismiss(toastId)
    console.log("markLectureAsComplete result:", result)
    return result
}

// create a rating for course
// Fetch all reviews for a course
export const getCourseReviews = async (courseId) => {
    const toastId = toast.loading("Loading reviews...");
    try {
        if (!courseId) {
            throw new Error("Course ID is required");
        }

        console.log("Fetching reviews for course:", courseId);
        const response = await apiConnector(
            "GET", 
            `${ratingsEndpoints.REVIEWS_DETAILS_API}?courseId=${courseId}`
        );
        
        console.log("Reviews API response:", response);
        
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Failed to fetch reviews");
        }
        
        return {
            success: true,
            reviews: response.data.reviews || [],
            averageRating: response.data.averageRating || 0,
            totalRatings: response.data.totalRatings || 0
        };
    } catch (error) {
        console.error("Error fetching course reviews:", {
            error: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        toast.error(error.message || "Failed to load reviews");
        return {
            success: false,
            error: error.message || "Failed to load reviews"
        };
    } finally {
        toast.dismiss(toastId);
    }
};

export const createRating = async (data, token) => {
    const toastId = toast.loading("Submitting your review...");
    try {
        if (!token) {
            throw new Error("Authentication token is missing. Please log in again.");
        }

        if (!data.courseId) {
            throw new Error("Course ID is required");
        }

        if (!data.rating || data.rating < 1 || data.rating > 5) {
            throw new Error("Please provide a valid rating between 1 and 5");
        }

        console.log("Sending review with data:", {
            courseId: data.courseId,
            rating: data.rating,
            review: data.review || ""
        });

        const response = await apiConnector(
            "POST", 
            CREATE_RATING_API, 
            {
                courseId: data.courseId,
                rating: data.rating,
                review: data.review || ""
            },
            {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        );
        
        console.log("CREATE RATING API RESPONSE:", response);
        
        if (!response || !response.data) {
            throw new Error("No response received from the server");
        }

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to submit review");
        }
        
        toast.success("Thank you for your review!");
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("CREATE RATING API ERROR:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        let errorMessage = error.message;
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.status === 401) {
            errorMessage = "Please log in to submit a review";
        } else if (error.response?.status === 403) {
            errorMessage = "You've already reviewed this course";
        } else if (error.response?.status === 404) {
            errorMessage = "Course not found or you are not enrolled";
        }
        
        toast.error(errorMessage);
        return {
            success: false,
            error: errorMessage
        };
    } finally {
        toast.dismiss(toastId);
    }
};
