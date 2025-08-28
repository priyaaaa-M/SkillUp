import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { MdAdd, MdClose } from "react-icons/md"

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [requirement, setRequirement] = useState("")
  const [requirementsList, setRequirementsList] = useState([])
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions || [])
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, requirementsList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementsList])

  const handleAddRequirement = () => {
    if (requirement.trim()) {
      setRequirementsList([...requirementsList, requirement.trim()])
      setRequirement("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddRequirement()
    }
  }

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...requirementsList]
    updatedRequirements.splice(index, 1)
    setRequirementsList(updatedRequirements)
  }

  return (
    <div className="flex flex-col space-y-4">
      <label className="text-sm font-medium text-richblack-100" htmlFor={name}>
        {label} <sup className="text-pink-400">*</sup>
      </label>

      <div className={`flex flex-col gap-3 rounded-lg border bg-richblack-700 p-4 transition-all duration-200 ${isFocused ? "border-yellow-50 shadow-md shadow-yellow-500/20" : "border-richblack-300"
        } ${errors[name] ? "border-pink-400" : ""}`}
      >
        <div className="flex gap-2">
          <input
            type="text"
            id={name}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter a requirement and press Enter"
            className="flex-1 bg-richblack-800 text-richblack-5 placeholder-richblack-400 rounded-lg px-4 py-3 outline-none border border-richblack-600 focus:border-yellow-50 transition-colors"
          />
          <button
            type="button"
            onClick={handleAddRequirement}
            disabled={!requirement.trim()}
            className="flex items-center justify-center bg-yellow-50 text-richblack-900 rounded-lg px-4 py-3 font-medium hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[60px]"
            title="Add requirement"
          >
            <MdAdd className="text-xl" />
          </button>
        </div>

        {requirementsList.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-richblack-50 text-sm font-medium">
                Added Requirements ({requirementsList.length})
              </h4>
              {requirementsList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setRequirementsList([])}
                  className="text-xs text-pink-400 hover:text-pink-300 transition-colors flex items-center"
                >
                  <MdClose className="mr-1" />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
              {requirementsList.map((requirement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-richblack-800 rounded-lg px-3 py-2 animate-fadeIn group hover:bg-richblack-600 transition-colors"
                >
                  <span className="text-richblack-5 text-sm truncate pr-2" title={requirement}>
                    {index + 1}. {requirement}
                  </span>
                  <button
                    type="button"
                    className="text-richblack-400 hover:text-pink-400 transition-colors rounded-full p-1 hover:bg-richblack-700 flex-shrink-0"
                    onClick={() => handleRemoveRequirement(index)}
                    title="Remove requirement"
                  >
                    <MdClose className="text-lg" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-richblack-400">
          Press Enter or click + to add requirements
        </p>
        {requirementsList.length > 0 && (
          <p className="text-xs text-richblack-400">
            {requirementsList.length} requirement{requirementsList.length !== 1 ? 's' : ''} added
          </p>
        )}
      </div>

      {errors[name] && (
        <span className="text-xs text-pink-400 font-medium flex items-center mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {label} is required
        </span>
      )}
    </div>
  )
}