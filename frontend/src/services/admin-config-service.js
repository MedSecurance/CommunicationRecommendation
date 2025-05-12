const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5287";

export const GetAdminConfigs = async (getAuthHeaders) => {
  try {

    var authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/protocol-evaluator/admin-config`, {
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

export const UpdateAdminConfig = async (updatedAdminConfig, getAuthHeaders) => {
  try {

    var authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/protocol-evaluator/admin-config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(updatedAdminConfig),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
};
