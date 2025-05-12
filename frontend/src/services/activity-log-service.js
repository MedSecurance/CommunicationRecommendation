const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5287";

export const GetActivityLog = async (getAuthHeaders) => {
  try {

    var authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/activity-log`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {

    console.error('Error fetching adminConfigs:', error);
    throw error;
    
  }
};