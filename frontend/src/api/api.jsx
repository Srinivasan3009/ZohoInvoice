const BASE_URL = "http://localhost:8080/backend-1.0-SNAPSHOT/api";

export const loginUser = async (data) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};
export const getItems = async () => {
  const res = await fetch(`${BASE_URL}/items`);
  return res.json();
};

export const addItem = async (item) => {
  const res = await fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  return res.json();
};