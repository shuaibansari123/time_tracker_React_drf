import { makeGetRequest, makePostRequest, makeDeleteRequest } from './baseServices';

const getToken = () => localStorage.getItem('token');


// Function to fetch all tasks
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

// Function to make POST requests for task forms
export const postTaskForm = async (record) => {
  const token = getToken();
  await makePostRequest('dashboard/post/', record, token);
};

// Function to post record filters
export const postRecordFilter = async (record) => {
  const token = getToken();
  return await makePostRequest('dashboard/records/post/', record, token);
};

// Function to delete records
export const deleteRecord = async (record_ids) => {
  const token = getToken();
  console.log('Deleting records:', record_ids);
  return await makeDeleteRequest('dashboard/records/delete', record_ids, token);
};
