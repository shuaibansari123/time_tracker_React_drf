import axios from 'axios';

// Base configuration for Axios requests
const HOST = process.env.REACT_APP_API_HOST || '127.0.0.1:8000';
const ROOT_URL = `http://${HOST}/api/v1`;

// Configuration for HTTP headers
const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// General handler for making API requests with axios
const handleAxiosRequest = async (method, endpoint, { record = {}, token } = {}) => {
  const url = `${ROOT_URL}/${endpoint}`;
  const config = getConfig(token);

  try {
    switch (method) {
      case 'get': return (await axios.get(url, config)).data;
      case 'post': return (await axios.post(url, record, config)).data;
      case 'put': return (await axios.put(url, record, config)).data;
      case 'delete': return (await axios.delete(url, { data: record, ...config }));
      default: throw new Error(`Unsupported method: ${method}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Exported functions for specific API endpoints
export const makeGetRequest = (endpoint, token) => handleAxiosRequest('get', endpoint, { token });
export const makePostRequest = (endpoint, record, token) => handleAxiosRequest('post', endpoint, { record, token });
export const makePutRequest = (endpoint, record, token) => handleAxiosRequest('put', endpoint, { record, token });
export const makeDeleteRequest = (endpoint, record, token) => handleAxiosRequest('delete', endpoint, { record, token });
