import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchUserNotes } from "../../services/operations/notesAPI";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaTrash, FaEdit, FaBook, FaFilter } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const NotesPage = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const enrolledCourses = user?.courses || [];

  // Load notes when component mounts or when selected course changes
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        const response = await fetchUserNotes(token, selectedCourse === 'general' ? null : selectedCourse || null);
        setNotes(response.data || []);
      } catch (error) {
        console.error("Failed to load notes:", error);
        toast.error("Failed to load notes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [token, selectedCourse]);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNote = (noteId) => {
    // Implement delete functionality here
    toast.success("Note deleted successfully");
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
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 w-full bg-richblack-800 p-3 rounded-lg text-richblack-5 mb-4"
          >
            <FaFilter /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
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
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-richblack-200 mb-2">
                    Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full bg-richblack-700 text-richblack-5 rounded-lg p-2 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                  >
                    <option value="">All Courses</option>
                    {enrolledCourses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
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
                {searchTerm || selectedCourse
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
                    className="bg-richblack-800 rounded-xl p-5 border border-richblack-700 hover:border-yellow-500 transition-all cursor-pointer shadow-lg"
                    onClick={() => navigate(`/dashboard/Personal-Notes/${note._id}`)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-richblack-5 line-clamp-1">
                        {note.title}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/Personal-Notes/${note._id}`);
                        }}
                        className="text-richblack-200 hover:text-yellow-50 p-1 rounded-full bg-richblack-700"
                        title="Edit note"
                      >
                        <FaEdit />
                      </motion.button>
                    </div>
                    <p className="text-richblack-300 text-sm mb-3 line-clamp-3">
                      {note.content}
                    </p>
                    <div className="flex justify-between items-center text-xs text-richblack-400">
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                      {note.course && (
                        <span className="bg-richblack-700 px-2 py-1 rounded-full">
                          {note.course.courseName}
                        </span>
                      )}
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