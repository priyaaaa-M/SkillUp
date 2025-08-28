import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProgressBar from '@ramonak/react-progress-bar'; // Assuming you're using this
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI'; // Make sure the path is correct

const EnrolledCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async () => {
        try {
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response);
        } catch (error) {
            console.error("Failed to fetch enrolled courses", error);
        }
    };

    useEffect(() => {
        getEnrolledCourses();
    }, []);

    return (
        <div>
            <div>Enrollment Courses</div>

            {!enrolledCourses ? (
                <div>Loading...</div>
            ) : !enrolledCourses.length ? (
                <p>You have not enrolled in any courses yet</p>
            ) : (
                <div>
                    <div style={{ display: 'flex', gap: '20px', fontWeight: 'bold' }}>
                        <p>Course Name</p>
                        <p>Duration</p>
                        <p>Progress</p>
                    </div>

                    {enrolledCourses.map((course, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <img
                                    src={course.thumbnail || '/placeholder.png'}
                                    alt={course.courseName}
                                    width="100"
                                    height="60"
                                />
                                <div>
                                    <p>{course.courseName}</p>
                                    <p>{course.courseDescription}</p>
                                </div>
                            </div>

                            <div>{course?.totalDuration}</div>

                            <div style={{ width: '200px' }}>
                                <p>Progress: {course.progressPercentage || 0}%</p>
                                <ProgressBar
                                    completed={course.progressPercentage || 0}
                                    height="8px"
                                    isLabelVisible={false}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnrolledCourses;
