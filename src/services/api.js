const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

const getHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
    };
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }
    return headers;
};

const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // If response is not JSON, use text or default message
            try {
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            } catch (textError) {
                // If we can't parse response at all
            }
        }
        throw new Error(errorMessage);
    }

    // For successful responses, try to parse JSON
    try {
        return await response.json();
    } catch (e) {
        // If response is not JSON but status is OK, return empty object
        if (response.status >= 200 && response.status < 300) {
            return {};
        }
        throw new Error('Invalid JSON response');
    }
};

export const api = {
    get: async (endpoint) => {
        try {
            // Ensure we're in a browser environment
            if (typeof window === 'undefined') {
                throw new Error('Cannot make API calls from server-side');
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    ...getHeaders(),
                    'Accept': 'application/json',
                },
                credentials: 'include', // Allow credentials to be sent
                mode: 'cors', // Ensure CORS is enabled
                cache: 'no-cache', // Disable cache
                redirect: 'follow', // Follow redirects
                referrerPolicy: 'no-referrer', // No referrer
            });
            return handleResponse(response);
        } catch (error) {
            console.error('API GET error:', error);
            // Provide more specific error messaging
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to connect to the server. Please check your internet connection and make sure the server is running.');
            }
            throw new Error(`Network error: ${error.message || 'Unable to connect to server'}`);
        }
    },
    post: async (endpoint, body) => {
        try {
            // Ensure we're in a browser environment
            if (typeof window === 'undefined') {
                throw new Error('Cannot make API calls from server-side');
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    ...getHeaders(),
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
                credentials: 'include', // Allow credentials to be sent
                mode: 'cors', // Ensure CORS is enabled
                cache: 'no-cache', // Disable cache
                redirect: 'follow', // Follow redirects
                referrerPolicy: 'no-referrer', // No referrer
            });
            return handleResponse(response);
        } catch (error) {
            console.error('API POST error:', error);
            // Provide more specific error messaging
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to connect to the server. Please check your internet connection and make sure the server is running.');
            }
            throw new Error(`Network error: ${error.message || 'Unable to connect to server'}`);
        }
    },
    put: async (endpoint, body) => {
        try {
            // Ensure we're in a browser environment
            if (typeof window === 'undefined') {
                throw new Error('Cannot make API calls from server-side');
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "PUT",
                headers: {
                    ...getHeaders(),
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
                credentials: 'include', // Allow credentials to be sent
                mode: 'cors', // Ensure CORS is enabled
                cache: 'no-cache', // Disable cache
                redirect: 'follow', // Follow redirects
                referrerPolicy: 'no-referrer', // No referrer
            });
            return handleResponse(response);
        } catch (error) {
            console.error('API PUT error:', error);
            // Provide more specific error messaging
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to connect to the server. Please check your internet connection and make sure the server is running.');
            }
            throw new Error(`Network error: ${error.message || 'Unable to connect to server'}`);
        }
    },
    delete: async (endpoint) => {
        try {
            // Ensure we're in a browser environment
            if (typeof window === 'undefined') {
                throw new Error('Cannot make API calls from server-side');
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "DELETE",
                headers: {
                    ...getHeaders(),
                    'Accept': 'application/json',
                },
                credentials: 'include',
                mode: 'cors',
                cache: 'no-cache',
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            });
            return handleResponse(response);
        } catch (error) {
            console.error('API DELETE error:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to connect to the server. Please check your internet connection and make sure the server is running.');
            }
            throw new Error(`Network error: ${error.message || 'Unable to connect to server'}`);
        }
    },
    patch: async (endpoint, body) => {
        try {
            // Ensure we're in a browser environment
            if (typeof window === 'undefined') {
                throw new Error('Cannot make API calls from server-side');
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "PATCH",
                headers: {
                    ...getHeaders(),
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
                credentials: 'include',
                mode: 'cors',
                cache: 'no-cache',
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            });
            return handleResponse(response);
        } catch (error) {
            console.error('API PATCH error:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to connect to the server. Please check your internet connection and make sure the server is running.');
            }
            throw new Error(`Network error: ${error.message || 'Unable to connect to server'}`);
        }
    },
    upload: async (endpoint, formData) => {
        try {
            if (typeof window === 'undefined') {
                throw new Error('Cannot make API calls from server-side');
            }

            const headers = getHeaders();
            delete headers['Content-Type']; // Let browser set multipart/form-data with boundary

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: headers,
                body: formData,
                credentials: 'include',
                mode: 'cors',
            });
            return handleResponse(response);
        } catch (error) {
            console.error('API UPLOAD error:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }
    }
};
