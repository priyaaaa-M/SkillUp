import { apiConnector } from '../apiConnector';
import { courseEndpoints } from '../apis';

export const enrollCourses = async (courseIds, token) => {
  try {
    const response = await apiConnector(
      'POST',
      courseEndpoints.ENROLL_COURSES,
      { courseIds },
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to enroll in courses');
    }

    return response.data.data;
  } catch (error) {
    console.error('ENROLL_COURSES_API_ERROR:', error);
    throw new Error(error.response?.data?.message || 'Failed to enroll in courses');
  }
};

export const fetchEnrolledCourses = async (token) => {
  try {
    const response = await apiConnector(
      'GET',
      courseEndpoints.GET_USER_ENROLLED_COURSES,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch enrolled courses');
    }

    return response.data.data;
  } catch (error) {
    console.error('FETCH_ENROLLED_COURSES_ERROR:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch enrolled courses');
  }
};
