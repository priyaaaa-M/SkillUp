import React, { useEffect, useState, Component } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt, HiOutlineUserGroup } from "react-icons/hi"
import { VscChevronDown, VscChevronRight, VscPlayCircle } from "react-icons/vsc"
import ReactMarkdown from "react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"


import ConfirmationModal from "../components/common/ConfirmationModal"
import Footer from "../components/common/Footer"
import RatingStars from "../components/Common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { BuyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-vscode-background text-vscode-text p-8">
          <h2 className="text-2xl font-bold text-vscode-error mb-4">Something went wrong</h2>
          <p className="mb-4">{this.state.error?.message || 'An unknown error occurred'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-vscode-button-background text-vscode-button-foreground rounded hover:bg-vscode-button-hoverBackground"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function CourseDetails() {
  console.log('Rendering CourseDetails component')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  
  console.log('Redux state:', { user, token, loading, paymentLoading })

  // Getting courseId from url parameter
  const { courseId } = useParams()

  // Declare states for course details, loading, and error
  const [response, setResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  useEffect(() => {
    console.log('useEffect triggered, courseId:', courseId);
    let isMounted = true;
    
    const fetchCourseData = async () => {
      console.log('Fetching course data for ID:', courseId);
      
      if (!courseId) {
        console.error('No course ID provided');
        if (isMounted) {
          setError('No course ID provided');
          setIsLoading(false);
        }
        return;
      }
      
      try {
        console.log('Calling fetchCourseDetails API...');
        const res = await fetchCourseDetails(courseId);
        console.log('API Response:', JSON.stringify(res, null, 2));
        
        if (!isMounted) return;
        
        if (!res || !res.success) {
          const errMsg = res?.message || 'Failed to fetch course details';
          console.error('API Error:', errMsg);
          throw new Error(errMsg);
        }
        
        if (!res.data?.courseDetails) {
          const errMsg = 'No course details found in response';
          console.error(errMsg);
          throw new Error(errMsg);
        }
        
        console.log('Course content received:', {
          sections: res.data.courseDetails.courseContent?.length || 0,
          hasInstructor: !!res.data.courseDetails.instructor,
          hasThumbnail: !!res.data.courseDetails.thumbnail,
          instructor: res.data.courseDetails.instructor,
          instructorStats: res.data.instructorStats,
          courseStudents: res.data.courseDetails.studentsEnroled?.length || 0,
          courseDetails: {
            ...res.data.courseDetails,
            studentsEnroled: undefined // Avoid logging potentially large array
          }
        });
        
        // Debug: Log detailed instructor stats
        if (res.data.instructorStats) {
          console.log('Instructor stats:', {
            totalStudents: res.data.instructorStats.totalStudents,
            totalCourses: res.data.instructorStats.totalCourses,
            instructorId: res.data.instructorStats.instructorId
          });
        } else {
          console.warn('No instructorStats in response');
        }
        
        setResponse(res);
        setError(null);
      } catch (error) {
        console.error('Error in fetchCourseData:', error);
        if (isMounted) {
          const errMsg = error.message || 'Failed to load course details';
          console.error('Setting error state:', errMsg);
          setError(errMsg);
          setResponse(null);
        }
      } finally {
        if (isMounted) {
          console.log('Setting loading to false');
          setIsLoading(false);
        }
      }
    };
    
    fetchCourseData();
    
    return () => {
      console.log('Cleaning up course details fetch');
      isMounted = false;
    };
  }, [courseId]);

  // Calculating Avg Review count
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
    setAvgReviewCount(count)
  }, [response])

  const [isActive, setIsActive] = useState([]);
  
  // Calculate total duration of a section from its subsections
  const calculateSectionDuration = (subsections = []) => {
    if (!subsections || !Array.isArray(subsections)) return 0;
    
    const total = subsections.reduce((total, sub) => {
      if (!sub) return total;
      
      // Debug log to see what we're working with
      console.log('Subsection data:', {
        title: sub.title,
        timeDuration: sub.timeDuration,
        type: typeof sub.timeDuration
      });
      
      // Handle different possible duration formats
      let duration = 0;
      
      // If timeDuration is a number, use it directly
      if (typeof sub.timeDuration === 'number') {
        duration = sub.timeDuration;
      } 
      // If timeDuration is a string that can be parsed to a number
      else if (typeof sub.timeDuration === 'string') {
        const parsed = parseFloat(sub.timeDuration);
        if (!isNaN(parsed)) {
          duration = parsed;
        }
      }
      
      console.log('Calculated duration for subsection:', duration);
      return total + duration;
    }, 0);
    
    console.log('Total section duration:', total);
    return total;
  };

  // Format duration in seconds to HH:MM:SS or MM:SS or SSs format
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '0s';
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}h`;
    } else if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}m`;
    } else {
      return `${secs}s`;
    }
  };

  // Set first section as active by default when course content is loaded
  useEffect(() => {
    if (response?.data?.courseDetails?.courseContent?.length > 0 && isActive.length === 0) {
      setIsActive([response.data.courseDetails.courseContent[0]._id])
    }
  }, [response?.data?.courseDetails?.courseContent])

  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    )
  }

  // Total number of lectures
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  console.log('Component render state:', { isLoading, loading, error, response })
  
  console.log('Render phase - state:', { isLoading, loading, error, response: !!response })
  
  if (isLoading || loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-richblack-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-b-yellow-50 border-l-yellow-50 border-r-yellow-50"></div>
          <p className="text-lg font-medium text-richblack-5">Loading course details...</p>
          <p className="text-sm text-richblack-200">Please wait a moment</p>
        </div>
      </div>
    )
  }
  
  if (error || !response?.data?.courseDetails) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-richblack-900 p-6 text-center">
        <div className="mb-6 rounded-full bg-richblack-800 p-4">
          <svg
            className="h-12 w-12 text-yellow-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mb-3 text-2xl font-bold text-richblack-5">
          {error ? 'Error Loading Course' : 'Course Not Found'}
        </h2>
        <p className="mb-6 max-w-md text-richblack-200">
          {error?.message || 'The course you are looking for could not be found. It may have been removed or is temporarily unavailable.'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-yellow-50 px-6 py-2 font-medium text-richblack-900 hover:bg-yellow-100 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/dashboard/enrolled-courses')}
            className="rounded-lg border border-richblack-700 bg-richblack-800 px-6 py-2 font-medium text-richblack-5 hover:bg-richblack-700 transition-colors"
          >
            My Courses
          </button>
        </div>
      </div>
    )
  }
  
  // Check if we have valid response data before destructuring
  if (!response?.data?.courseDetails) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-vscode-background px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-vscode-error mb-4">Course Not Found</h2>
          <p className="mb-6 text-vscode-text">
            The requested course could not be found. Please check the URL and try again.
          </p>
          <button
            onClick={() => navigate('/')}
            className="rounded-md bg-vscode-button-background px-4 py-2 text-vscode-button-foreground hover:bg-vscode-button-hoverBackground"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Destructure course details with default values
  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn = "",
    courseContent = [],
    ratingAndReviews = [],
    instructor = {},
    studentsEnroled = [],
    createdAt,
  } = response.data.courseDetails;
  
  // Check if current user is enrolled in the course
  const isEnrolled = user?.courses?.some(course => course._id === course_id) || 
                    studentsEnroled.some(student => student._id === user?._id);
  
  // Calculate total number of lectures
  const totalLectures = courseContent.reduce((acc, section) => {
    return acc + (section.subSection?.length || 0);
  }, 0);
  
  // Calculate total duration of the course
  const totalDuration = courseContent.reduce((total, section) => {
    const sectionDuration = calculateSectionDuration(section?.subSection || []);
    console.log('Section:', section?.sectionName, 'Duration:', sectionDuration);
    return total + sectionDuration;
  }, 0);
  
  console.log('Total Lectures:', totalLectures, 'Total Duration (s):', totalDuration);
  
  // Handle continue learning navigation
  const handleContinueLearning = () => {
    const firstSection = courseContent[0];
    const firstSubSection = firstSection?.subSection?.[0];
    if (firstSection && firstSubSection) {
      navigate(`/view-course/${course_id}/section/${firstSection._id}/sub-section/${firstSubSection._id}`);
    }
  };
  
  // Track cart abandonment
  const trackCartAbandonment = async () => {
    try {
      await fetch(`${process.env.REACT_APP_BASE_URL}/payment/track-abandonment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: course_id,
          courseName,
          price,
          thumbnail,
        }),
      });
    } catch (error) {
      console.error('Error tracking cart abandonment:', error);
    }
  };

  // Handle buy course function
  const handleBuyCourse = () => {
    console.log('handleBuyCourse called');
    console.log('Current token:', token);
    
    if (!token) {
      // Store the current URL to redirect back after login
      const returnUrl = window.location.pathname;
      console.log('User not logged in. Setting up login redirect to:', returnUrl);
      
      const modalData = {
        text1: "You are not logged in!",
        text2: "Please login to Purchase Course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => {
          console.log('Login button clicked, navigating to login page');
          // Track cart abandonment before redirecting to login
          trackCartAbandonment();
          navigate("/login", { state: { from: returnUrl } });
        },
        btn2Handler: () => {
          console.log('Cancel button clicked, closing modal');
          // Track cart abandonment when user cancels
          trackCartAbandonment();
          setConfirmationModal(null);
        },
      };
      
      console.log('Setting confirmation modal with data:', modalData);
      setConfirmationModal(modalData);
      return;
    }
    
    console.log('User is logged in, proceeding with course purchase');
    // If user is logged in, proceed with course purchase
    BuyCourse(token, [courseId], user, navigate, dispatch);
  };
  
  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-vscode-background">
        <div className="spinner border-t-vscode-blue"></div>
        <p className="mt-4 text-vscode-text">Processing payment...</p>
      </div>
    );
  }

  // Removed duplicate handleBuyCourse function and paymentLoading check

  return (
    <div className="bg-richblack-900 min-h-screen">
      <div className="relative w-full text-vscode-text">
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full rounded-lg border border-vscode-border"
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg`}
            >
              <div>
                <p className="text-4xl font-bold text-vscode-text sm:text-[42px]">
                  {courseName}
                </p>
              </div>
              <p className={`text-vscode-icon`}>{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-vscode-tag">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                <span className="flex items-center gap-1">
                  <HiOutlineUserGroup className="text-yellow-100" />
                  {response?.data?.courseDetails?.enrollmentCount || 0} students enrolled
                </span>
              </div>
              <div>
                <p className="text-vscode-attribute">
                  Created By {`${instructor.firstName} ${instructor.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg text-vscode-icon">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-vscode-border py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-vscode-text">
                Rs. {price}
              </p>
              {isEnrolled ? (
                <button 
                  className="bg-caribbeangreen-400 hover:bg-caribbeangreen-300 text-richblack-900 font-semibold py-3 px-6 rounded transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={handleContinueLearning}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Continue Learning
                </button>
              ) : (
                <>
                  <button 
                    className="bg-vscode-blue hover:bg-blue-400 text-white font-semibold py-3 px-6 rounded transition-all duration-200"
                    onClick={handleBuyCourse}
                  >
                    Buy Now
                  </button>
                  <button className="bg-vscode-background border border-vscode-border hover:bg-vscode-titlebar text-white font-semibold py-3 px-6 rounded transition-all duration-200">
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Courses Card */}
          <div className="right-[2rem] top-[60px] mx-auto hidden min-h-[400px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block">
            <CourseDetailsCard
              course={response?.data?.courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={isEnrolled ? handleContinueLearning : handleBuyCourse}
              isEnrolled={isEnrolled}
              totalLectures={totalLectures}
              totalDuration={totalDuration}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-vscode-text lg:w-[1260px] bg-richblack-900">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn section */}
          <div className="my-8 border border-vscode-border rounded-lg p-8 bg-richblack-800">
            <h2 className="text-3xl font-bold text-richblack-5 mb-6">What you'll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-richblack-25">
              {whatYouWillLearn.split('\n').filter(item => item.trim() !== '').map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-yellow-50 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{item.trim().replace(/^[-•*]\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Content Section */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-richblack-5 mb-2">Course Content</h2>
              <div className="flex justify-between items-center text-sm text-richblack-300 mb-4">
                <div className="flex gap-4">
                  <span>{courseContent.length} sections</span>
                  <span>•</span>
                  <span>{totalNoOfLectures} lectures</span>
                  <span>•</span>
                  <span>{response.data?.totalDuration} Length</span>
                </div>
                <button 
                  onClick={() => {
                    if (isActive.length === 0 && response?.data?.courseDetails?.courseContent?.length > 0) {
                      // If all collapsed, expand first section
                      setIsActive([response.data.courseDetails.courseContent[0]._id]);
                    } else {
                      // Otherwise collapse all
                      setIsActive([]);
                    }
                  }}
                  className="text-yellow-50 hover:text-yellow-100 text-sm font-medium"
                >
                  {isActive.length === 0 ? 'Show First Section' : 'Collapse all sections'}
                </button>
              </div>
            </div>


            {/* Course Sections */}
            <div className="border border-white/10 rounded-lg overflow-hidden">
              {response?.data?.courseDetails?.courseContent?.map((course, index) => (
                <div 
                  key={index} 
                  className={`transition-all duration-300 ${isActive.includes(course._id) ? 'bg-richblack-800' : 'bg-richblack-900'}`}
                >
                  <div 
                    className={`flex justify-between items-center p-4 cursor-pointer transition-colors duration-200 ${isActive.includes(course._id) ? 'bg-richblack-700/50' : 'hover:bg-richblack-800'}`}
                    onClick={() => handleActive(course._id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 flex items-center justify-center rounded-md transition-all duration-200 ${
                        isActive.includes(course._id) 
                          ? 'bg-yellow-50 text-richblack-900' 
                          : 'bg-richblack-700 text-yellow-50'
                      }`}>
                        {isActive.includes(course._id) ? (
                          <VscChevronDown className="w-5 h-5 transition-transform duration-200" />
                        ) : (
                          <VscChevronRight className="w-5 h-5 transition-transform duration-200" />
                        )}
                      </div>
                      <h3 className="font-medium text-richblack-5">{course.sectionName}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-richblack-300 bg-richblack-700 px-2 py-1 rounded">
                        {course.subSection.length} lectures
                      </span>
                      <span className="text-sm text-richblack-400">
                        {formatDuration(calculateSectionDuration(course.subSection))}
                      </span>
                    </div>
                  </div>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isActive.includes(course._id) 
                        ? 'max-h-[1000px] opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="bg-richblack-900/50">
                      {course.subSection.map((subSec, i) => (
                        <div 
                          key={i} 
                          className="flex items-center p-3 pl-16 hover:bg-richblack-800/50 transition-colors duration-200 group"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/view-course/${course_id}/section/${course._id}/sub-section/${subSec._id}`);
                          }}
                        >
                          <div className="w-8 h-8 flex items-center justify-center mr-3 group-hover:text-yellow-50 transition-colors">
                            <VscPlayCircle className="w-5 h-5 text-richblack-400 group-hover:text-yellow-50 transition-colors" />
                          </div>
                          <span className="text-richblack-100 flex-1 group-hover:text-white transition-colors">
                            {subSec.title}
                          </span>
                          <span className="text-sm text-richblack-400 group-hover:text-white transition-colors">
                            {formatDuration(subSec.timeDuration)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Author Details - Compact */}
            <div className="mt-6 mb-4">
              <h2 className="text-xl font-bold text-richblack-5 mb-4">Instructor</h2>
              <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-600">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={instructor?.image || 'https://api.dicebear.com/7.x/initials/svg?seed=Instructor'}
                      alt="Instructor"
                      className="h-16 w-16 rounded-full object-cover border-2 border-yellow-50"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-richblack-5 truncate">{`${instructor?.firstName || ''} ${instructor?.lastName || ''}`}</h3>
                      <p className="text-sm text-richblue-200 mb-2">{instructor?.additionalDetails?.designation || 'Instructor'}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-yellow-50">
                          <span className="font-medium">
                            {instructor?.courses?.length || 0}
                          </span>
                          <span className="text-richblack-300">Courses</span>
                        </span>
                        <span className="w-px h-4 bg-richblack-600"></span>
                        <span className="flex items-center gap-1 text-yellow-50" title="Students in this course">
                          <span className="font-medium">
                            {studentsEnroled?.length || 0}
                          </span>
                          <span className="text-richblack-300">
                            Students
                          </span>
                        </span>
                        {response?.data?.instructorStats?.totalStudents > 0 && (
                          <>
                            <span className="w-px h-4 bg-richblack-600"></span>
                            <span className="flex items-center gap-1 text-yellow-50" title="Total students across all courses">
                              <span className="font-medium">
                                {response.data.instructorStats.totalStudents}
                              </span>
                              <span className="text-richblack-300">
                                Total Students
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-richblack-25 text-sm mt-3 mb-3">
                      {instructor?.additionalDetails?.about || 'An experienced instructor passionate about sharing knowledge and helping students succeed in their learning journey.'}
                    </p>
                    
                    {instructor?.additionalDetails?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {instructor.additionalDetails.skills.slice(0, 4).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-0.5 bg-richblack-700 text-richblack-5 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {confirmationModal && (
        <ConfirmationModal 
          modalData={confirmationModal} 
          isOpen={!!confirmationModal}
        />
      )}
    </div>
  )
}

// Wrap the component with ErrorBoundary
export default function CourseDetailsWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <CourseDetails />
    </ErrorBoundary>
  );
}

export { CourseDetails };
