
const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5287";

export const postWifiAnswersToApi = async (answers, getAuthHeaders) => {
  try {
    var authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/protocol-evaluator/evaluate/wifi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(answers),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success:', data);

    return data;
  } catch (error) {
    console.error('Error posting answers:', error);
    throw error;
  }
};

export const postBluetoothAnswersToApi = async (answers, getAuthHeaders) => {
  try {

    var authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/protocol-evaluator/evaluate/bluetooth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,

      },
      body: JSON.stringify(answers),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success:', data);

    return data;
  } catch (error) {
    console.error('Error posting answers:', error);
    throw error;
  }
};

export const postLoraWanAnswersToApi = async (answers, getAuthHeaders) => {
  try {

    var authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/protocol-evaluator/evaluate/lorawan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,

      },
      body: JSON.stringify(answers),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success:', data);

    return data;
  } catch (error) {
    console.error('Error posting answers:', error);
    throw error;
  }
};

export const postGsmAnswersToApi = async (answers, getAuthHeaders) => {
  try {

    var authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/protocol-evaluator/evaluate/gsm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(answers),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success:', data);

    return data;
  } catch (error) {
    console.error('Error posting answers:', error);
    throw error;
  }
};

export const getRiskAssessments = async (apiRequest) => {
  try {

    return await apiRequest(`${API_BASE_URL}/protocol-evaluator/risk-assessments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

export const getRiskAssessmentById = async (id, getAuthHeaders) => {
  try {

    var authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/protocol-evaluator/risk-assessments/${id}`, {
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
    console.error('Error fetching devices:', error);
    throw error;
  }
};

export const deleteRiskAssessmentById = async (id, apiRequest) => {
  try {

    return await apiRequest(`${API_BASE_URL}/protocol-evaluator/risk-assessments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

