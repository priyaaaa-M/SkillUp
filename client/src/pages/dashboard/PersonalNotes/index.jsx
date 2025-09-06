import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchUserNotes } from "../../../services/operations/notesAPI";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaTrash, FaEdit, FaBook, FaSpinner, FaFilter } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const NotesPage = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([{ _id: 'general', courseName: 'All Notes' }]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseNameMap, setCourseNameMap] = useState(new Map());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  // Process enrolled courses from user data
  useEffect(() => {
    if (!user?.courses || !Array.isArray(user.courses)) {
      setEnrolledCourses([{ _id: 'general', courseName: 'All Notes' }]);
      setLoadingCourses(false);
      return;
    }

    try {
      setLoadingCourses(true);
      
      // Process the course data from user object
      const courses = [
        { _id: 'general', courseName: 'All Notes' },
        ...user.courses
          .filter(course => course?._id && course?.courseName)
          .map(course => ({
            _id: course._id,
            courseName: course.courseName
          }))
      ];
      
      setEnrolledCourses(courses);
      
      // Create a map of course IDs to course names for quick lookup
      const newCourseMap = new Map();
      user.courses.forEach(course => {
        if (course?._id) {
          newCourseMap.set(course._id, course.courseName || `Course ${course._id.slice(-4)}`);
        }
      });
      setCourseNameMap(newCourseMap);
      
    } catch (error) {
      console.error('Error processing course data:', error);
      // Fallback to just showing the course IDs if there's an error
      const fallbackCourses = [
        { _id: 'general', courseName: 'All Notes' },
        ...(user.courses || [])
          .filter(course => course?._id)
          .map(course => ({
            _id: course._id,
            courseName: `Course ${course._id.slice(-4)}`
          }))
      ];
      setEnrolledCourses(fallbackCourses);
    } finally {
      setLoadingCourses(false);
    }
  }, [user?.courses]);

  // Function to load notes
  const loadNotes = async () => {
    try {
      setLoading(true);
      const courseId = selectedCourse === 'general' ? null : selectedCourse || null;
      const response = await fetchUserNotes(token, courseId);
      
      // Add course names to notes
      const notesWithCourseNames = (response.data || []).map(note => {
        // If the note has a course ID, look up its name in the map
        const courseName = note.course 
          ? (courseNameMap.get(note.course) || `Course ${note.course.slice(-4)}`)
          : 'General';
          
        return {
          ...note,
          courseName: courseName
        };
      });
      
      setNotes(notesWithCourseNames);
      return notesWithCourseNames;
    } catch (error) {
      console.error("Failed to load notes:", error);
      toast.error("Failed to load notes. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load notes when component mounts or when selected course changes
  useEffect(() => {
    loadNotes();
  }, [token, selectedCourse]);
  
  // Refresh notes when navigating back from note editor
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.location.pathname === '/dashboard/Personal-Notes') {
        loadNotes();
      }
    };
    
    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    
    // Initial load
    handleRouteChange();
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNote = async (noteId, e) => {
    e.stopPropagation(); // Prevent the click from triggering the note view
    
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/v1/notes/${noteId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete note');
        }

        // Remove the deleted note from the UI
        setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
        toast.success('Note deleted successfully');
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error(error.message || 'Failed to delete note');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"
        ></motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 min-h-screen bg-richblack-900"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-richblack-5"
        >
          My Notes
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard/Personal-Notes/new")}
          className="flex items-center gap-2 bg-yellow-50 text-richblack-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-100 transition-all shadow-lg"
        >
          <FaPlus /> Create New Note
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters - Mobile Toggle */}
        <div className="lg:hidden">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 w-full bg-richblack-800 p-3 rounded-lg text-richblack-5 mb-4 shadow-md"
          >
            <FaFilter /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </motion.button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {(isFilterOpen || !isFilterOpen) && ( // This condition ensures the panel is always visible on desktop
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`lg:col-span-1 space-y-4 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}
            >
              <div className="bg-richblack-800 p-4 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-richblack-5 mb-4">Filters</h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-richblack-200 mb-2">
                    Course
                  </label>
                  {loadingCourses ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center p-2 bg-richblack-700 rounded-lg"
                    >
                      <FaSpinner className="animate-spin text-yellow-50 mr-2" />
                      <span className="text-richblack-200 text-sm">Loading courses...</span>
                    </motion.div>
                  ) : (
                    <select
                      value={selectedCourse || 'general'}
                      onChange={(e) => setSelectedCourse(e.target.value === 'general' ? '' : e.target.value)}
                      className="w-full bg-richblack-700 text-richblack-5 rounded-lg p-2 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    >
                      {enrolledCourses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.courseName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes List */}
        <div className="lg:col-span-3">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-richblack-800 text-richblack-5 px-4 py-3 pl-10 rounded-lg border border-richblack-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-richblack-400" />
          </div>

          {filteredNotes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-richblack-800 rounded-xl p-8 text-center shadow-lg"
            >
              <motion.div 
                animate={{ rotate: 10, y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-richblack-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FaBook className="text-2xl text-yellow-50" />
              </motion.div>
              <h3 className="text-xl font-semibold text-richblack-5 mb-2">No notes found</h3>
              <p className="text-richblack-300 mb-6">
                {searchTerm || selectedCourse !== 'general'
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't created any notes yet. Create your first note to get started!"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard/Personal-Notes/new")}
                className="bg-yellow-50 text-richblack-900 px-6 py-2 rounded-lg font-medium hover:bg-yellow-100 transition-all shadow-md"
              >
                Create Note
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredNotes.map((note, index) => (
                  <motion.div 
                    key={note._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -5 }}
                    className="bg-richblack-800 rounded-xl p-5 border border-richblack-700 hover:border-yellow-500 transition-all cursor-pointer shadow-lg h-full flex flex-col group"
                    onClick={() => navigate(`/dashboard/Personal-Notes/${note._id}`)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-richblack-5 line-clamp-1">
                        {note.title}
                      </h3>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/dashboard/Personal-Notes/${note._id}`)}
                          className="text-richblack-200 hover:text-yellow-50 p-1 rounded-full bg-richblack-700"
                          title="Edit note"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDeleteNote(note._id, e)}
                          className="text-richblack-200 hover:text-pink-500 p-1 rounded-full bg-richblack-700"
                          title="Delete note"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-richblack-300 text-sm mb-3 line-clamp-3">
                        {note.content}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-richblack-700">
                      <span className="text-xs text-richblack-400">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="bg-richblack-700 text-richblack-200 text-xs px-2 py-1 rounded-full">
                        {note.courseName || 'General'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotesPage;