import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { FaExclamationTriangle } from "react-icons/fa"
import Footer from "../components/common/Footer"
import Course_Card from "../components/core/Catalog/Course_Card"
import Course_Slider from "../components/core/Catalog/CourseSlider"
import { apiConnector } from "../services/apiconnector"
import { categories, courseEndpoints } from "../services/apis"

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caribbeangreen-400"></div>
  </div>
)

// Error display component
const ErrorDisplay = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <FaExclamationTriangle className="text-4xl text-yellow-400 mb-4" />
    <h3 className="text-xl font-semibold text-richblack-5 mb-2">Something went wrong</h3>
    <p className="text-richblack-300 mb-6 max-w-md">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-6 py-2 bg-caribbeangreen-500 text-richblack-900 font-medium rounded-lg hover:bg-caribbeangreen-400 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
)

function Catalog() {
  const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const navigate = useNavigate()
  
  const [catalogData, setCatalogData] = useState({
    selectedCategory: null,
    randomCategory: null,
    popularCourses: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        console.log('Fetching all categories...')
        const categoriesRes = await apiConnector("GET", courseEndpoints.COURSE_CATEGORIES_API)
        console.log('Categories API Response:', categoriesRes)
        
        const allCategories = categoriesRes?.data?.data || []
        console.log('All Categories:', allCategories)
        
        if (allCategories.length === 0) {
          throw new Error('No categories found')
        }
        
        // 1. Get all courses first
        console.log('Fetching all courses...')
        const allCoursesRes = await apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API)
        
        // Log the raw response for debugging
        console.log('Raw courses response:', allCoursesRes)
        
        // Extract courses array from response
        let allCourses = []
        
        // Handle different possible response structures
        if (allCoursesRes?.data?.success && Array.isArray(allCoursesRes.data.data)) {
          allCourses = allCoursesRes.data.data
          console.log('Using data.data (success:true) with', allCourses.length, 'courses')
        } else if (Array.isArray(allCoursesRes?.data?.data)) {
          allCourses = allCoursesRes.data.data
          console.log('Using data.data with', allCourses.length, 'courses')
        } else if (Array.isArray(allCoursesRes?.data)) {
          allCourses = allCoursesRes.data
          console.log('Using data array with', allCourses.length, 'courses')
        } else if (allCoursesRes?.data?.courses) {
          allCourses = allCoursesRes.data.courses
          console.log('Using data.courses with', allCourses.length, 'courses')
        } else if (allCoursesRes?.data?.data?.courses) {
          allCourses = allCoursesRes.data.data.courses
          console.log('Using data.data.courses with', allCourses.length, 'courses')
        } else {
          console.error('Could not find courses array in response:', allCoursesRes)
        }
        
        console.log('Extracted courses:', allCourses)
        
        // 2. Find the selected category
        let selectedCategory = null
        let randomCategory = null
        
        if (catalogName) {
          // Normalize the catalog name for comparison
          const normalizedCatalogName = catalogName.toLowerCase().replace(/-/g, ' ').trim();
          
          console.log('Searching for category matching:', normalizedCatalogName);
          
          // Find the selected category by name with flexible matching
          selectedCategory = allCategories.find(cat => {
            const categoryName = cat.name.toLowerCase().trim();
            const match = categoryName === normalizedCatalogName || 
                         categoryName.replace(/ /g, '-') === normalizedCatalogName.replace(/ /g, '-');
            
            if (match) {
              console.log(`Matched category: ${cat.name} (${cat._id})`);
            }
            
            return match;
          })
          
          if (!selectedCategory) {
            console.log('Category not found, redirecting to development')
            navigate('/catalog/development')
            return
          }
          
          // Debug: Log all categories and their IDs
          console.log('All categories:', allCategories.map(c => `${c.name} (${c._id})`))
          
          // Filter courses by selected category - handle both populated category objects and direct IDs
          const categoryCourses = allCourses.filter(course => {
            try {
              if (!course || !course.category) {
                console.log(`Course "${course?.courseName || 'Unknown'}" has no category`);
                return false;
              }

              // Debug course data
              const courseCategoryId = course.category._id ? 
                course.category._id.toString() : 
                course.category.toString();
                
              const selectedCategoryId = selectedCategory._id.toString();
              
              const matches = courseCategoryId === selectedCategoryId;
              
              if (matches) {
                console.log(`Course "${course.courseName}" matches category "${selectedCategory.name}"`);
              } else {
                console.log(`Course "${course.courseName}" does not match category "${selectedCategory.name}"`);
                console.log('Course category ID:', courseCategoryId);
                console.log('Selected category ID:', selectedCategoryId);
                console.log('Course category data:', course.category);
              }
              
              return matches;
              
            } catch (error) {
              console.error('Error processing course:', course?.courseName, error);
              console.log('Problematic course data:', course);
              return false;
            }
          })
          
          selectedCategory = {
            ...selectedCategory,
            courses: categoryCourses
          }
        } else {
          // If no category specified, use the first one
          selectedCategory = allCategories[0]
          const categoryCourses = allCourses.filter(
            course => course.category === selectedCategory._id
          )
          
          selectedCategory = {
            ...selectedCategory,
            courses: categoryCourses
          }
        }
        
        // 3. Get a random different category
        const otherCategories = allCategories.filter(
          cat => cat._id.toString() !== selectedCategory._id.toString()
        )
        
        if (otherCategories.length > 0) {
          const randomIndex = Math.floor(Math.random() * otherCategories.length)
          const randomCat = otherCategories[randomIndex]
          
          // Improved filtering for random category courses
          const randomCatCourses = allCourses.filter(course => {
            if (!course || !course.category) return false;
            
            const courseCategoryId = course.category._id ? 
              course.category._id.toString() : 
              course.category.toString();
              
            return courseCategoryId === randomCat._id.toString();
          })
          
          randomCategory = {
            ...randomCat,
            courses: randomCatCourses.slice(0, 6)
          }
        }
        
        // 4. Get popular courses (most enrolled)
        const popularCourses = [...allCourses]
          .filter(course => {
            // Show all courses regardless of status for now
            const isPublished = true; // Temporarily show all courses
            if (!isPublished) {
              console.log('Skipping course:', course.courseName, 'Status:', course.status)
            }
            return isPublished
          })
          .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
          .slice(0, 4)
        
        console.log('Popular courses:', popularCourses.map(c => c.courseName))
        
        const catalogData = {
          selectedCategory,
          randomCategory,
          popularCourses
        }
        
        console.log('Setting catalog data:', {
          selectedCategory: {
            ...selectedCategory,
            courses: selectedCategory?.courses?.map(c => c.name) || []
          },
          randomCategory: randomCategory ? {
            ...randomCategory,
            courses: randomCategory.courses?.map(c => c.name) || []
          } : null,
          popularCourses: popularCourses?.map(c => c.name) || []
        })
        
        setCatalogData(catalogData)
        
      } catch (error) {
        console.error("Error fetching catalog data:", error)
        setError(error.message || 'Failed to load catalog data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [catalogName, navigate])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-richblack-900">
        <div className="text-center pt-20">
          <LoadingSpinner />
          <p className="text-richblack-200 mt-4">Loading courses...</p>
        </div>
      </div>
    )
  }
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <ErrorDisplay 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-richblack-900">
      {/* Hero Section */}
      <div className="bg-richblack-800 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-richblack-300">
              {`Home / Catalog / `}
              <span className="text-yellow-25">
                {catalogData.selectedCategory?.name || 'All Courses'}
              </span>
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-richblack-5">
              {catalogData.selectedCategory?.name || 'All Courses'}
            </h1>
            <p className="text-richblack-200 max-w-3xl">
              {catalogData.selectedCategory?.description || 'Explore our wide range of courses'}
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Selected Category Courses */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-richblack-5 mb-8">
            {catalogData.selectedCategory?.name} Courses
          </h2>
          {catalogData.selectedCategory?.courses?.length > 0 ? (
            <Course_Slider Course={catalogData.selectedCategory.courses} />
          ) : (
            <div className="text-center py-12 bg-richblack-800 rounded-lg">
              <p className="text-richblack-300">No courses available in this category yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Random Category Courses */}
      {catalogData.randomCategory && (
        <section className="py-12 px-4 bg-richblack-800">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-richblack-5 mb-8">
              Explore {catalogData.randomCategory.name} Courses
            </h2>
            {catalogData.randomCategory.courses?.length > 0 ? (
              <Course_Slider Course={catalogData.randomCategory.courses} />
            ) : (
              <div className="text-center py-12 bg-richblack-700 rounded-lg">
                <p className="text-richblack-300">No courses available in this category</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section 3: Frequently Bought */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-richblack-5 mb-8">
            Frequently Bought Together
          </h2>
          {catalogData.popularCourses?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {catalogData.popularCourses.map((course, index) => (
                <Course_Card 
                  key={course._id || index} 
                  course={course} 
                  Height="h-[300px]" 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-richblack-800 rounded-lg">
              <p className="text-richblack-300">No popular courses to show</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Catalog
