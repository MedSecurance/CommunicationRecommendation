import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5287";

export const GetDevices = async (getAuthHeaders) => {
  try {
    const response = await fetch(`${API_BASE_URL}/device-manager/devices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
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

export const AddDevice = async (device, getAuthHeaders) => {
  try {
    debugger;
    const response = await fetch(`${API_BASE_URL}/device-manager/devices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(device), // Include device data in the request body
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding device:', error);
    throw error;
  }
};

export const DeleteDevice = async (deviceId, getAuthHeaders) => {
  try {
    const response = await fetch(`${API_BASE_URL}/device-manager/devices/${deviceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
};

export const GetDeviceDetails = async (deviceId, getAuthHeaders) => {
  try {
    const response = await fetch(`${API_BASE_URL}/device-manager/devices/${deviceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching device details:', error);
    throw error;
  }
};

export const UpdateDevice = async (device, deviceId, getAuthHeaders) => {
  try {
    const response = await fetch(`${API_BASE_URL}/device-manager/devices/${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(device), // Include device data in the request body
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

  } catch (error) {
    console.error('Error updating device:', error);
    throw error;
  }
};
