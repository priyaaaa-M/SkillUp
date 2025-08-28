import { useRef, useState } from "react"
import { AiOutlineCaretDown, AiOutlineUser } from "react-icons/ai"
import { VscDashboard, VscSignOut, VscSettingsGear } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { logout } from "../../../services/operations/authAPI"

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  if (!user) return null

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 p-1 rounded-full hover:bg-richblack-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-richblack-500"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Profile menu"
      >
        <div className="relative">
          <img
            src={user?.image}
            alt={`${user?.firstName} ${user?.lastName}`}
            className="aspect-square w-9 h-9 rounded-full object-cover border-2 border-richblack-500"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="absolute inset-0 hidden items-center justify-center bg-richblack-600 rounded-full">
            <AiOutlineUser className="text-lg text-richblack-100" />
          </div>
        </div>
        <AiOutlineCaretDown
          className={`text-richblack-100 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-56 z-50 rounded-lg bg-richblack-800 border border-richblack-600 shadow-lg overflow-hidden"
          ref={ref}
          onClick={(e) => e.stopPropagation()}
        >
          {/* User info section */}
          <div className="p-4 border-b border-richblack-600">
            <p className="text-richblack-50 font-medium truncate">{user.firstName} {user.lastName}</p>
            <p className="text-richblack-200 text-sm truncate">{user.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              to="/dashboard/my-profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-richblack-100 hover:bg-richblack-700 hover:text-richblack-50 transition-colors duration-150"
            >
              <VscDashboard className="text-lg opacity-80" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-richblack-100 hover:bg-richblack-700 hover:text-richblack-50 transition-colors duration-150"
            >
              <VscSettingsGear className="text-lg opacity-80" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Logout button */}
          <div className="py-1 border-t border-richblack-600">
            <button
              onClick={() => {
                dispatch(logout(navigate))
                setOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-richblack-100 hover:bg-richblack-700 hover:text-richblack-50 transition-colors duration-150"
            >
              <VscSignOut className="text-lg opacity-80" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}