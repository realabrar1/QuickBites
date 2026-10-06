import { apiRequest, setAuthToken, setUserData } from './api';

export const authService = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', 'POST', { email, password });
    if (data.token) {
      setAuthToken(data.token);
      setUserData(data.user);
    }
    return data;
  },

  register: async (fullName, email, phoneNumber, password, role = 'Customer') => {
    return await apiRequest('/auth/register', 'POST', {
      fullName,
      email,
      phoneNumber,
      password,
      role
    });
  },

  logout: () => {
    setAuthToken(null);
    setUserData(null);
  }
};
