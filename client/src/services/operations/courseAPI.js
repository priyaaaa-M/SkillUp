import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";

// Fetch course details by ID
export const fetchCourseDetails = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "POST",
      courseEndpoints.COURSE_DETAILS_API,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error;
  }
};

// Fetch multiple courses by their IDs
export const fetchMultipleCourseDetails = async (courseIds, token) => {
  try {
    const promises = courseIds.map(courseId => 
      fetchCourseDetails(courseId, token)
    );
    return await Promise.all(promises);
  } catch (error) {
    console.error("Error fetching multiple course details:", error);
    throw error;
  }
};
