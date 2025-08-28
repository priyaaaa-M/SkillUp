import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    profile: localStorage.getItem("profile")
        ? JSON.parse(localStorage.getItem("profile"))
        : null,
    loading: false,
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;   // ✅ must update "user"
        },
        setProfile(state, action) {
            state.profile = action.payload
            localStorage.setItem("profile", JSON.stringify(action.payload)) // 👈 also sync profile
        },
        setLoading(state, action) {
            state.loading = action.payload
        },
        logoutProfile(state) {
            state.user = null
            state.profile = null
            localStorage.removeItem("user")
            localStorage.removeItem("profile")
        },
    },
})

export const { setUser, setProfile, setLoading, logoutProfile } =
    profileSlice.actions
export default profileSlice.reducer
