const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// GET request
export const getData = async (endpoint) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};

// POST request
export const postData = async (endpoint, data) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to post data');
  return response.json();
};

// PUT request
export const updateData = async (endpoint, data) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update data');
  return response.json();
};

// DELETE request
export const deleteData = async (endpoint) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete data');
  return response.json();
};
