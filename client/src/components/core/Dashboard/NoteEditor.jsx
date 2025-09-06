import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaSave, FaTrash, FaSpinner } from "react-icons/fa";
import { createNewNote, fetchUserNotes, updateUserNote, deleteUserNote } from "../../../services/operations/notesAPI";
import { fetchMultipleCourseDetails, fetchCourseDetails } from "../../../services/operations/courseAPI";
import { useForm } from "react-hook-form";

export default function NoteEditor() {
  const { noteId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(!!noteId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Get enrolled courses from user data
  const enrolledCourses = React.useMemo(() => {
    const courses = [
      { _id: 'general', courseName: 'General' },
      ...(user?.courses?.map(course => ({
        _id: course._id || course,
        courseName: course.courseName || `Course ${(course._id || course)?.slice(-4) || ''}`
      })) || [])
    ];
    console.log('Enrolled courses:', courses);
    return courses;
  }, [user?.courses]);
  
  const loadingCourses = false;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      courseId: "",
      tags: "",
    },
  });

  // Fetch note data if in edit mode
  useEffect(() => {
    if (noteId) {
      const loadNote = async () => {
        try {
          const response = await fetchUserNotes(token);
          const note = response.data.find((n) => n._id === noteId);
          
          if (note) {
            setValue("title", note.title);
            setValue("content", note.content);
            setValue("courseId", note.course?._id || "");
            setValue("tags", note.tags?.join(", ") || "");
          } else {
            navigate("/dashboard/Personal-Notes");
          }
        } catch (error) {
          console.error("Failed to load note:", error);
          navigate("/dashboard/Personal-Notes");
        } finally {
          setLoading(false);
        }
      };
      
      loadNote();
    } else {
      setLoading(false);
    }
  }, [noteId, token, navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log('Form data:', data);
      
      // Prepare note data
      const noteData = {
        title: data.title,
        content: data.content,
        courseId: data.courseId === 'general' ? null : data.courseId,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : []
      };
      
      console.log('Sending note data to server:', noteData);

      try {
        let response;
        if (noteId) {
          response = await updateUserNote(noteId, noteData, token);
          console.log('Update note response:', response);
          toast.success("Note updated successfully!");
        } else {
          response = await createNewNote(noteData, token);
          console.log('Create note response:', response);
          toast.success("Note created successfully!");
        }
        
        // Navigate back to notes list after a short delay
        setTimeout(() => {
          navigate("/dashboard/Personal-Notes");
        }, 1000);
        
      } catch (error) {
        console.error('Error saving note:', error);
        toast.error(error.response?.data?.message || 'Failed to save note');
      }
      
      // Force a refresh of the notes list when navigating back
      window.dispatchEvent(new Event('popstate'));
      navigate("/dashboard/Personal-Notes", { replace: true });
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        setIsSubmitting(true);
        await deleteUserNote(noteId, token);
        navigate("/dashboard/Personal-Notes");
      } catch (error) {
        console.error("Failed to delete note:", error);
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard/Personal-Notes")}
          className="text-richblack-200 hover:text-richblack-5"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-richblack-5">
          {noteId ? "Edit Note" : "Create New Note"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-richblack-200">
              Title <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className={`w-full bg-richblack-700 text-richblack-5 rounded-lg p-3 border ${
                errors.title ? "border-pink-500" : "border-richblack-600"
              } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              placeholder="Note title"
            />
            {errors.title && (
              <p className="text-pink-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-richblack-200">
              Course (optional)
            </label>
            {loadingCourses ? (
              <div className="flex items-center justify-center p-3 bg-richblack-700 rounded-lg">
                <FaSpinner className="animate-spin text-yellow-50 mr-2" />
                <span className="text-richblack-200">Loading courses...</span>
              </div>
            ) : (
              <select
                {...register("courseId")}
                className="w-full bg-richblack-700 text-richblack-5 rounded-lg p-3 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">General Note (Not linked to a course)</option>
                {Array.from(new Map(enrolledCourses.map(course => [course._id, course])).values()).map((course, index) => (
                  <option 
                    key={`${course._id}-${index}`} 
                    value={course._id}
                  >
                    {course.courseName}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-richblack-200">
            Content <span className="text-pink-500">*</span>
          </label>
          <textarea
            {...register("content", { required: "Content is required" })}
            className={`w-full h-64 bg-richblack-700 text-richblack-5 rounded-lg p-4 border ${
              errors.content ? "border-pink-500" : "border-richblack-600"
            } focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none`}
            placeholder="Write your note here..."
          />
          {errors.content && (
            <p className="text-pink-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-richblack-200">
            Tags (comma separated)
          </label>
          <input
            type="text"
            {...register("tags")}
            className="w-full bg-richblack-700 text-richblack-5 rounded-lg p-3 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="e.g., important, lecture-1, assignment"
          />
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {noteId && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                <FaTrash /> Delete Note
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/Personal-Notes")}
              disabled={isSubmitting}
              className="px-6 py-2 bg-richblack-700 text-richblack-5 rounded-lg hover:bg-richblack-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-yellow-50 text-richblack-900 rounded-lg hover:bg-yellow-100 disabled:opacity-50"
            >
              <FaSave /> {isSubmitting ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
