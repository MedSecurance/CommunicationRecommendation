import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Adjust path as needed

export const useApiRequest = () => {


    const { getAuthHeaders, refreshToken, logout } = useContext(AuthContext);

    const apiRequest = async (url, options) => {

        console.log("try to request" , url);

        try {
            let response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    ...getAuthHeaders(),
                },
            });

            console.log("Response status:" , response.status);

            if (response.status === 401) {
                // Try to refresh token
                const tokenRefreshed = await refreshToken();
                if (tokenRefreshed) {

                    console.log("Token Refreshed");

                    // Retry the original request with the new token
                    response = await fetch(url, {
                        ...options,
                        headers: {
                            ...options.headers,
                            ...getAuthHeaders(),
                        },
                    });

                    console.log("New Response", response);


                } else {

                    console.log("Not refreshed. Go to logout");

                    // Redirect to login if refresh fails
                    logout();
                    return;
                }
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            console.log("Response is okay");

            // Check if there is content to parse
            const contentType = response.headers.get('Content-Type');
            if (response.status === 204 || response.status === 304 || !contentType) {
                // No content to return (204: No Content, 304: Not Modified)
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    };

    return { apiRequest };
};
