import { useEffect, useRef, useState } from "react"
import { AiOutlineDown } from "react-icons/ai"
import { BiTime } from "react-icons/bi"
import CourseSubSectionAccordion from "./CourseSubSectionAccordion"

export default function CourseAccordionBar({ course, isActive, handleActive }) {
    const contentEl = useRef(null)
    const [active, setActive] = useState(false)
    const [sectionHeight, setSectionHeight] = useState(0)

    useEffect(() => {
        setActive(isActive?.includes(course._id))
    }, [isActive])

    useEffect(() => {
        setSectionHeight(active ? contentEl.current.scrollHeight : 0)
    }, [active])

    // Calculate total duration for this section
    const sectionDuration = course?.subSection?.reduce((total, subSec) => {
        return total + (subSec.timeDuration ? parseInt(subSec.timeDuration) : 0)
    }, 0)

    const formatDuration = (minutes) => {
        if (!minutes) return "0 min"
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    }

    return (
        <div className="overflow-hidden rounded-xl border border-richblack-600 bg-richblack-800 mb-4 transition-all duration-300 hover:shadow-lg hover:border-richblack-500">
            <div
                className={`flex cursor-pointer items-center justify-between p-5 transition-all duration-300 ${active ? 'bg-richblack-700' : 'bg-richblack-800 hover:bg-richblack-750'}`}
                onClick={() => handleActive(course._id)}
            >
                <div className="flex items-center gap-4">
                    <div className={`transform transition-transform duration-300 ${active ? 'rotate-180' : ''} text-richblack-5`}>
                        <AiOutlineDown size={18} />
                    </div>
                    <div>
                        <h3 className="font-medium text-richblack-5">{course?.sectionName}</h3>
                        {course?.description && (
                            <p className="text-sm text-richblack-200 mt-1">{course.description}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-richblack-100 text-sm">
                        <span>{course.subSection.length || 0} lectures</span>
                        {sectionDuration > 0 && (
                            <>
                                <span className="text-richblack-400">•</span>
                                <span className="flex items-center gap-1">
                                    <BiTime size={14} />
                                    {formatDuration(sectionDuration)}
                                </span>
                            </>
                        )}
                    </div>
                    <div className="text-yellow-50 text-sm font-medium">
                        {active ? "Hide" : "Show"}
                    </div>
                </div>
            </div>
            <div
                ref={contentEl}
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{ height: `${sectionHeight}px` }}
            >
                <div className="p-4 space-y-2 bg-richblack-900">
                    {course?.subSection?.map((subSec, i) => (
                        <CourseSubSectionAccordion 
                            subSec={subSec} 
                            key={i} 
                            isActive={active}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}