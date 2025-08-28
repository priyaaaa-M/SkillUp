import { useEffect, useRef, useState } from "react"
import { FiUpload, FiUser, FiCheck, FiX } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI"

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)
  const [isHovered, setIsHovered] = useState(false)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = () => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("displayPicture", imageFile)
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false)
        setImageFile(null)
      })
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setImageFile(null)
    setPreviewSource(null)
  }

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile)
    }
  }, [imageFile])

  return (
    <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
      <div className="flex items-center gap-x-6">
        {/* Profile Image with Hover Effect */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-richblack-600 shadow-lg relative">
            <img
              src={previewSource || user?.image}
              alt={`profile-${user?.firstName}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Overlay on hover */}
            {isHovered && (
              <div className="absolute inset-0 bg-richblack-900/80 flex items-center justify-center rounded-full cursor-pointer">
                <FiUpload className="text-xl text-richblack-5" />
              </div>
            )}
          </div>

          {/* Upload Status Indicator */}
          {loading && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-richblack-700 px-2 py-1 rounded-full text-xs text-yellow-50 flex items-center gap-1">
              <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-yellow-50"></div>
              Uploading
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="space-y-3">
          <p className="text-richblack-100 font-medium">Change Profile Picture</p>

          <div className="flex flex-row gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg, image/jpg, image/webp"
            />

            <button
              onClick={handleClick}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-richblack-700 text-richblack-50 rounded-md hover:bg-richblack-600 transition-colors border border-richblack-600 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[90px]"
            >
              <FiUpload className="text-sm" />
              {imageFile ? "Change" : "Select"}
            </button>

            {imageFile && (
              <>
                <button
                  onClick={handleFileUpload}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-richblack-900 rounded-md hover:bg-yellow-400 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[90px]"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-richblack-900"></div>
                  ) : (
                    <FiCheck className="text-sm" />
                  )}
                  {loading ? "Uploading" : "Upload"}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-richblack-600 text-richblack-100 rounded-md hover:bg-richblack-500 transition-colors border border-richblack-500 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                >
                  <FiX className="text-sm" />
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* File Info */}
          {imageFile && (
            <div className="text-richblack-400 text-xs">
              <p className="truncate max-w-[200px]">{imageFile.name}</p>
              <p>{(imageFile.size / 1024).toFixed(1)} KB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}