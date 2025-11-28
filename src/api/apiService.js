import api from './axios';

export const apiService = {
  get: (endpoint) => {
    return api.get(endpoint);
  },
  
  post: (endpoint, data) => {
    return api.post(endpoint, data);
  },
  
  put: (endpoint, data) => {
    return api.put(endpoint, data);
  },
  
  delete: (endpoint) => {
    return api.delete(endpoint);
  },
  
  // Generic request method for more complex scenarios
  request: (config) => {
    return api.request(config);
  },

  // khusus upload file
  postFormData: (endpoint, formData) => 
    api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};