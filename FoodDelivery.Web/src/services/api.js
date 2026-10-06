const API_BASE_URL = 'http://localhost:5000/api';

export const getAuthToken = () => localStorage.getItem('quickbite_token');

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('quickbite_token', token);
  } else {
    localStorage.removeItem('quickbite_token');
  }
};

export const getUserData = () => {
  const user = localStorage.getItem('quickbite_user');
  return user ? JSON.parse(user) : null;
};

export const setUserData = (user) => {
  if (user) {
    localStorage.setItem('quickbite_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('quickbite_user');
  }
};

export const apiRequest = async (endpoint, method = 'GET', body = null, authRequired = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401 && authRequired) {
        setAuthToken(null);
        setUserData(null);
        window.location.href = '/login';
      }
      throw new Error(result.message || 'An error occurred while processing your request.');
    }

    return result.data ?? result;
  } catch (error) {
    throw error;
  }
};
