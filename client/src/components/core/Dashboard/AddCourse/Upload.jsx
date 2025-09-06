import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud, FiX } from "react-icons/fi"
import { useSelector } from "react-redux"
import { Player } from "video-react"
import "video-react/dist/video-react.css"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const [isHovered, setIsHovered] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Dropzone config
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
      setVideoError(false) // Reset error state
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: video
      ? { "video/*": [".mp4", ".avi", ".mov", ".wmv"] }
      : { "image/*": [".jpeg", ".jpg", ".png"] },
    onDrop,
  })

  // Preview file
  const previewFile = (file) => {
    if (video) {
      // For video files, create object URL instead of data URL
      const videoUrl = URL.createObjectURL(file)
      setPreviewSource(videoUrl)
    } else {
      // For image files, use FileReader
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setPreviewSource(reader.result)
      }
    }
  }

  // Register only once
  useEffect(() => {
    register(name, { required: !viewData })
  }, [register, name, viewData])

  // Set form value when file changes
  useEffect(() => {
    setValue(name, selectedFile)
  }, [selectedFile, setValue, name])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (video && previewSource && previewSource.startsWith('blob:')) {
        URL.revokeObjectURL(previewSource)
      }
    }
  }, [video, previewSource])

  // Cancel/remove file
  const handleCancel = () => {
    if (video && previewSource && previewSource.startsWith('blob:')) {
      URL.revokeObjectURL(previewSource)
    }
    setPreviewSource("")
    setSelectedFile(null)
    setValue(name, null)
    setVideoError(false)
  }

  // Handle video error
  const handleVideoError = () => {
    setVideoError(true)
    console.error("Video failed to load:", previewSource)
  }

  return (
    <div className="flex flex-col space-y-3">
      {/* Label */}
      <label className="text-sm font-medium text-richblack-100" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-400">*</sup>}
      </label>

      {/* Drop area */}
      <div
        {...getRootProps()}
        className={`relative flex min-h-[250px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 
          ${isDragActive
            ? "border-yellow-400 bg-yellow-400/10"
            : errors[name]
              ? "border-pink-400 bg-richblack-700"
              : "border-richblack-500 bg-richblack-700 hover:border-richblack-100"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hidden input */}
        <input {...getInputProps()} />

        {/* If preview available */}
        {previewSource ? (
          <div className="relative h-full w-full">
            {!video ? (
              <div className="relative h-full w-full">
                <img
                  src={previewSource}
                  alt="Preview"
                  className="h-full w-full rounded-xl object-cover"
                />
                {!viewData && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-richblack-900/70 transition-opacity duration-300 
                      ${isHovered ? "opacity-100" : "opacity-0"}`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCancel()
                      }}
                      className="flex items-center rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-richblack-5 hover:bg-pink-600 transition-colors"
                    >
                      <FiX className="mr-2" />
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-full w-full">
                <div className="h-full w-full rounded-xl overflow-hidden">
                  {videoError ? (
                    <div className="flex items-center justify-center h-full bg-richblack-800 text-richblack-300">
                      <div className="text-center">
                        <p className="text-sm text-pink-400 mb-2">Video failed to load</p>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 bg-pink-500 text-white rounded text-xs hover:bg-pink-600"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Player 
                      aspectRatio="16:9" 
                      playsInline 
                      src={previewSource}
                      onError={handleVideoError}
                      fluid={true}
                      preload="metadata"
                    />
                  )}
                </div>
                {!viewData && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-richblack-900/70 transition-opacity duration-300 
                      ${isHovered ? "opacity-100" : "opacity-0"}`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCancel()
                      }}
                      className="flex items-center rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-richblack-5 hover:bg-pink-600 transition-colors"
                    >
                      <FiX className="mr-2" />
                      Remove Video
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // If no preview (initial UI)
          <div className="flex w-full flex-col items-center p-6">
            <div className="grid aspect-square w-16 place-items-center rounded-full bg-richblack-800 mb-4">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>

            {isDragActive ? (
              <p className="text-lg font-medium text-yellow-50">
                Drop the file here
              </p>
            ) : (
              <>
                <p className="text-center text-richblack-100">
                  Drag and drop a {video ? "video" : "image"}, or{" "}
                  <span className="font-semibold text-yellow-50">
                    click anywhere
                  </span>{" "}
                  to browse a file
                </p>
                <p className="mt-4 text-xs text-richblack-400">
                  {video ? "MP4, AVI, MOV, WMV" : "JPEG, JPG, PNG"} files are supported
                </p>
              </>
            )}

            {/* Small tips */}
            {!video && (
              <ul className="mt-6 flex justify-center gap-8 text-xs text-richblack-400">
                <li className="flex items-center">
                  <svg
                    className="mr-1 h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Aspect ratio 16:9
                </li>
                <li className="flex items-center">
                  <svg
                    className="mr-1 h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Recommended size 1024x576
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {errors[name] && (
        <div className="flex items-center text-pink-400 text-sm font-medium mt-1">
          <svg
            className="mr-1 h-3 w-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {label} is required
        </div>
      )}
    </div>
  )
}