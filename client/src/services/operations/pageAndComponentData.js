import { toast } from "react-hot-toast"

import { apiConnector } from "../apiConnector"
import { catalogData } from "../apis"

export const getCatalogPageData = async (categoryId) => {
    const toastId = toast.loading("Loading...")
    let result = { success: false, data: null, message: '' };
    
    try {
        console.log('Fetching catalog page data for categoryId:', categoryId);
        
        // Ensure we have a valid categoryId or null
        const requestData = categoryId ? { categoryId } : {};
        
        console.log('Sending request to:', catalogData.CATALOGPAGEDATA_API);
        console.log('Request data:', requestData);
        
        const response = await apiConnector(
            "POST",
            catalogData.CATALOGPAGEDATA_API,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
        
        console.log('Catalog page API response:', response);
        
        if (!response) {
            throw new Error("No response received from server");
        }
        
        if (!response.data) {
            throw new Error("No data in response");
        }
        
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch catalog data");
        }
        
        result = { ...response.data };
        
        // Ensure we have the expected data structure
        if (!result.data) {
            result.data = {
                selectedCategory: { name: categoryId ? 'Category' : 'All Courses', courses: [] },
                differentCategory: { name: 'Other Categories', courses: [] },
                mostSellingCourses: []
            };
        }
        
        // Ensure all required arrays exist
        if (!result.data.selectedCategory?.courses) {
            result.data.selectedCategory = { ...(result.data.selectedCategory || {}), courses: [] };
        }
        if (!result.data.differentCategory?.courses) {
            result.data.differentCategory = { ...(result.data.differentCategory || {}), courses: [] };
        }
        if (!result.data.mostSellingCourses) {
            result.data.mostSellingCourses = [];
        }
        
        console.log('Processed catalog page data:', {
            selectedCategory: result.data.selectedCategory?.name,
            selectedCourses: result.data.selectedCategory?.courses?.length || 0,
            differentCategory: result.data.differentCategory?.name,
            differentCourses: result.data.differentCategory?.courses?.length || 0,
            mostSelling: result.data.mostSellingCourses?.length || 0
        });
        
    } catch (error) {
        console.error("CATALOGPAGEDATA_API ERROR:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            
            // Handle specific HTTP errors
            if (error.response.status === 404) {
                result = {
                    success: true,
                    data: {
                        selectedCategory: { name: categoryId ? 'Category' : 'All Courses', courses: [] },
                        differentCategory: { name: 'Other Categories', courses: [] },
                        mostSellingCourses: []
                    },
                    message: 'No courses found for this category'
                };
            } else {
                throw error; // Re-throw to be caught by the outer catch
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
            result.message = 'No response from server. Please check your connection.';
        } else {
            console.error('Request setup error:', error.message);
            result.message = error.message || 'Failed to load catalog data';
        }
        
        toast.error(result.message);
    } finally {
        toast.dismiss(toastId);
    }
    
    return result;
}
