// userPageServices.js 
import { makeGetRequest, makePostRequest, makeDeleteRequest, makePutRequest } from './baseServices';

const getToken = () => localStorage.getItem('token');

export const getAllTasks = async () => {
  const token = getToken();
  try {
    const response = await makeGetRequest('act_tasks/', token);
    console.log("Response data: ", response);
    return response;
  } catch (error) {
    console.error("Error fetching task list:", error);
    return null;
  }
};

// ActType Services
export const postActType = async (record) => {
  const token = getToken();
  try {
    const response = await makePostRequest('act_tasks/act_types/post', record, token);
    return response;
  } catch (error) {
    console.error("Error posting new Act Type:", error);
    throw error; // Rethrowing the error might be useful if the caller needs to handle it.
  }
};

export const updateActType = async (id, data) => {
    const token = getToken();
    try {
      const response = await makePutRequest(`act_tasks/act_types/${id}/`,data, token);
      return response.data;
    } catch (error) {
      console.error('Error updating Act Type:', error);
      throw error;
    }
  };


export const deleteActType = async (id) => {
  const token = getToken();
  try {
    const response = await makeDeleteRequest(`act_tasks/act_types/${id}/`,id, token);
    return response.status;
  } catch (error) {
    console.error("Error deleting ActType:", error);
    throw error;
  }
};


// ActName Services
export const postActName = async (record) => {
    const token = getToken();
    try {
        const response = await makePostRequest('act_tasks/act_names/post', record, token);
        return response;
    } catch (error) {
        console.error("Error posting new Act Name:", error);
        throw error;
    }
  };

export const deleteActName = async (id) => {
    const token = getToken();
    try {
        const response = await makeDeleteRequest(`act_tasks/act_names/${id}/`,id, token);
        return response.status;
    } catch (error) {
        console.error("Error deleting ActName:", error);
        throw error;
    }
    }