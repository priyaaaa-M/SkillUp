// Importing React hook for managing component state
import { useEffect, useState, useRef } from "react"
// Importing React icon component
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

// Defining a functional component ChipInput
export default function ChipInput({
  // Props to be passed to the component
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)

  // Setting up state for managing chips array
  const [chips, setChips] = useState([])
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editCourse) {
      setChips(course?.tag || [])
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, chips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  // Function to handle user input when chips are added
  const handleKeyDown = (event) => {
    // Check if user presses "Enter" or ","
    if (event.key === "Enter" || event.key === ",") {
      // Prevent the default behavior of the event
      event.preventDefault()
      // Get the input value and remove any leading/trailing spaces
      const chipValue = event.target.value.trim()
      // Check if the input value exists and is not already in the chips array
      if (chipValue && !chips.includes(chipValue)) {
        // Add the chip to the array and clear the input
        const newChips = [...chips, chipValue]
        setChips(newChips)
        event.target.value = ""
      }
    }
  }

  // Function to handle deletion of a chip
  const handleDeleteChip = (chipIndex) => {
    // Filter the chips array to remove the chip with the given index
    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }

  // Function to handle paste event
  const handlePaste = (event) => {
    event.preventDefault()
    const pastedData = event.clipboardData.getData('text').trim()
    const newChips = pastedData.split(',')
      .map(chip => chip.trim())
      .filter(chip => chip && !chips.includes(chip))

    if (newChips.length > 0) {
      setChips([...chips, ...newChips])
      event.target.value = ""
    }
  }

  // Render the component
  return (
    <div className="flex flex-col space-y-3">
      {/* Render the label for the input */}
      <label className="text-sm font-medium text-richblack-100" htmlFor={name}>
        {label} <sup className="text-pink-400">*</sup>
      </label>

      {/* Render the chips and input */}
      <div
        className={`flex flex-wrap w-full min-h-12 items-center gap-2 rounded-lg border bg-richblack-700 px-4 py-3 transition-all duration-200 ${isFocused ? "border-yellow-50 shadow-md shadow-yellow-500/20" : "border-richblack-300"
          } ${errors[name] ? "border-pink-400" : ""}`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Map over the chips array and render each chip */}
        {chips.map((chip, index) => (
          <div
            key={index}
            className="flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-1 text-sm text-richblack-900 font-medium animate-fadeIn"
          >
            {/* Render the chip value */}
            {chip}
            {/* Render the button to delete the chip */}
            <button
              type="button"
              className="ml-2 rounded-full hover:bg-yellow-600/20 transition-colors focus:outline-none focus:ring-1 focus:ring-yellow-500"
              onClick={() => handleDeleteChip(index)}
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}

        {/* Render the input for adding new chips */}
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="text"
          placeholder={chips.length === 0 ? placeholder : ""}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent text-richblack-5 placeholder-richblack-400 outline-none min-w-[120px]"
        />
      </div>

      {/* Helper text */}
      <p className="text-xs text-richblack-400">
        Press Enter or comma (,) to add tags
      </p>

      {/* Render an error message if the input is required and not filled */}
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