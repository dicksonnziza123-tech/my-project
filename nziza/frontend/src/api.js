export const API_BASE = "http://localhost:2000";

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      throw data || { message: response.statusText };
    }
    return data;
  } catch (err) {
    if (!response.ok) {
      throw err;
    }
    return text;
  }
}
