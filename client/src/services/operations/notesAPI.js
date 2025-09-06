import { apiConnector } from "../apiconnector";
import { notes } from "../apis";

export const createNewNote = async (data, token) => {
    try {
        const response = await apiConnector("POST", notes.CREATE_NOTE, data, {
            Authorization: `Bearer ${token}`,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating note:", error);
        throw error;
    }
};

export const fetchUserNotes = async (token, courseId = null) => {
    try {
        const url = courseId 
            ? `${notes.GET_NOTES}?courseId=${courseId}`
            : notes.GET_NOTES;
            
        const response = await apiConnector("GET", url, null, {
            Authorization: `Bearer ${token}`,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching notes:", error);
        throw error;
    }
};

export const updateUserNote = async (noteId, data, token) => {
    try {
        const response = await apiConnector("PUT", `${notes.UPDATE_NOTE}/${noteId}`, data, {
            Authorization: `Bearer ${token}`,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
};

export const deleteUserNote = async (noteId, token) => {
    try {
        const response = await apiConnector("DELETE", `${notes.DELETE_NOTE}/${noteId}`, null, {
            Authorization: `Bearer ${token}`,
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
};
