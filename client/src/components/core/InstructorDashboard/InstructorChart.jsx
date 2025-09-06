import { useState, useEffect } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getInstructorDashboardData } from "../../../services/operations/profileAPI"
import { toast } from "react-hot-toast"

Chart.register(...registerables)

export default function InstructorChart() {
  const [courses, setCourses] = useState([])
  const { token } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currChart, setCurrChart] = useState("students")

  // Fetch instructor courses
  useEffect(() => {
    const getCourses = async () => {
      try {
        console.log("Fetching instructor dashboard data...")
        setIsLoading(true)
        setError(null)
        
        const result = await getInstructorDashboardData(token)
        console.log("Instructor dashboard data received:", result)
        
        if (!result || result.length === 0) {
          console.log("No courses found for this instructor")
          setCourses([])
          setError("No courses found. Create your first course to see analytics.")
        } else {
          console.log(`Setting ${result.length} courses`)
          setCourses(result)
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
        setError("Failed to load course data")
        toast.error("Failed to load course data")
      } finally {
        setIsLoading(false)
      }
    }
    
    getCourses()
  }, [token])

  // Generate harmonious colors instead of completely random ones
  const generateColors = (numColors, alpha = 1) => {
    const hueStep = 360 / numColors
    const colors = []
    
    for (let i = 0; i < numColors; i++) {
      const hue = (i * hueStep) % 360
      // Using a pleasant saturation and lightness
      const color = `hsla(${hue}, 70%, 60%, ${alpha})`
      colors.push(color)
    }
    return colors
  }

  // Return loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  // Return error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        {error}
      </div>
    )
  }

  // Handle case when no courses are found
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (error || !courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
        <div className="text-richblack-200 text-lg mb-4">
          {error || "No courses found."}
        </div>
        <Link 
          to="/dashboard/add-course"
          className="px-6 py-2 bg-yellow-500 text-richblack-900 font-medium rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Create Your First Course
        </Link>
      </div>
    )
  }

  // Data for the chart displaying student information
  const chartDataStudents = {
    labels: courses.map((course) => course?.courseName || 'Unnamed Course'),
    datasets: [
      {
        data: courses.map((course) => course?.totalStudentsEnrolled || 0),
        backgroundColor: generateColors(courses.length),
        borderColor: "#1e293b",
        borderWidth: 2,
        hoverBackgroundColor: generateColors(courses.length, 0.8),
        hoverOffset: 8,
      },
    ],
  }

  // Data for the chart displaying income information
  const chartIncomeData = {
    labels: courses.map((course) => course?.courseName || 'Unnamed Course'),
    datasets: [
      {
        data: courses.map((course) => course?.totalAmountGenerated || 0),
        backgroundColor: generateColors(courses.length),
        borderColor: "#1e293b",
        borderWidth: 2,
        hoverBackgroundColor: generateColors(courses.length, 0.8),
        hoverOffset: 8,
      },
    ],
  }

  // Enhanced options for the chart with animations
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            
            if (currChart === "students") {
              return `${label}: ${value} students (${percentage}%)`;
            } else {
              return `${label}: $${value} (${percentage}%)`;
            }
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
      easing: 'easeOutQuart'
    }
  }

  // Calculate totals for summary
  const totalStudents = courses.reduce((acc, course) => acc + course.totalStudentsEnrolled, 0)
  const totalIncome = courses.reduce((acc, course) => acc + course.totalAmountGenerated, 0)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col gap-y-6 rounded-2xl bg-gradient-to-br from-richblack-800 to-richblack-900 p-6 shadow-2xl border border-richblack-700"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-xl font-bold text-richblack-5">Course Analytics</p>
        
        <div className="flex space-x-2 p-1 bg-richblack-700 rounded-lg">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrChart("students")}
            className={`rounded-lg py-2 px-4 text-sm font-medium transition-all duration-200 ${
              currChart === "students"
                ? "bg-yellow-500 text-richblack-900 shadow-md"
                : "text-richblack-200 hover:text-richblack-5"
            }`}
          >
            Students
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrChart("income")}
            className={`rounded-lg py-2 px-4 text-sm font-medium transition-all duration-200 ${
              currChart === "income"
                ? "bg-green-500 text-richblack-900 shadow-md"
                : "text-richblack-200 hover:text-richblack-5"
            }`}
          >
            Income
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative h-72 md:h-80">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
              </motion.div>
            ) : (
              <motion.div
                key={currChart}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <Pie
                  data={currChart === "students" ? chartDataStudents : chartIncomeData}
                  options={options}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-richblack-700 rounded-xl p-4 flex flex-col justify-center">
          <h3 className="text-richblack-5 font-semibold mb-4 text-center">
            {currChart === "students" ? "Students Summary" : "Income Summary"}
          </h3>
          
          <div className="space-y-4">
            {courses.map((course, index) => (
              <motion.div 
                key={course.courseName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-2 bg-richblack-600 rounded-lg"
              >
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: generateColors(courses.length)[index] }}
                  ></div>
                  <span className="text-richblack-5 text-sm truncate max-w-[100px]">
                    {course.courseName}
                  </span>
                </div>
                <span className="text-richblack-5 font-medium text-sm">
                  {currChart === "students" 
                    ? course.totalStudentsEnrolled 
                    : `₹${course.totalAmountGenerated}`
                  }
                </span>
              </motion.div>
            ))}
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: courses.length * 0.1 }}
              className="pt-4 border-t border-richblack-500 mt-2"
            >
              <div className="flex justify-between items-center text-richblack-5 font-bold">
                <span>Total:</span>
                <span>
                  {currChart === "students" 
                    ? totalStudents 
                    : `₹${totalIncome}`
                  }
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="text-xs text-richblack-400 text-center mt-2">
        {currChart === "students" 
          ? `Showing enrollment data for ${courses.length} courses` 
          : `Showing income data for ${courses.length} courses`
        }
      </div>
    </motion.div>
  )
}