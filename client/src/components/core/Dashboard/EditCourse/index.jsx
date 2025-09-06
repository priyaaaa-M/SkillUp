import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import {
    fetchCourseDetails,
    getFullDetailsOfCourse,
} from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import RenderSteps from "../AddCourse/RenderStep "

export default function EditCourse() {
    const dispatch = useDispatch()
    const { courseId } = useParams()
    const { course } = useSelector((state) => state.course)
    const [loading, setLoading] = useState(false)
    const { token } = useSelector((state) => state.auth)
    
    console.log("Course ID from params:", courseId)
    console.log("Token:", token)
    useEffect(() => {
        ; (async () => {
            setLoading(true)
            try {
                const result = await getFullDetailsOfCourse(courseId, token)
                console.log("API RESULT =====>", result)

                if (result?.success && result?.data?.courseDetails) {
                    dispatch(setEditCourse(true))
                    dispatch(setCourse(result.data.courseDetails))
                } else {
                    console.error("Course not found or invalid response:", result)
                }
            } catch (error) {
                console.error("Error fetching course details:", error)
            } finally {
                setLoading(false)
            }
        })()
    }, [courseId, token, dispatch])


    if (loading) {
        return (
            <div className="grid flex-1 place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div>
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">
                Edit Course
            </h1>
            <div className="mx-auto max-w-[600px]">
                {course ? (
                    <RenderSteps />
                ) : (
                    <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                        Course not found
                    </p>
                )}
            </div>
        </div>
    )
}
