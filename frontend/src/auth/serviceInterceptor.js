import React, { useContext } from 'react';
import { KeycloakContext } from '../keycloak-provider';

export const useApiRequest = () => {

    const { getAuthHeaders } = useContext(KeycloakContext);

    const apiRequest = async (url, options) => {

        console.log("try to request" , url);

        var authHeaders = await getAuthHeaders();

        try {
            let response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    ...authHeaders,
                },
            });

            console.log("Response status:" , response.status);


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
