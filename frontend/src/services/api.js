const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getTickets = async (search = "", status = "") => {
  const params = new URLSearchParams();
  if (search.trim()) params.append("search", search.trim());
  if (status && status !== "All") params.append("status", status);
  
  const url = `${API_BASE_URL}/tickets${params.toString() ? `?${params.toString()}` : ""}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch tickets");
  return response.json();
};

export const getTicketDetail = async (id) => {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
  if (!response.ok) throw new Error("Failed to fetch ticket details");
  return response.json();
};

export const createTicket = async (ticketData) => {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticketData),
  });
  if (!response.ok) throw new Error("Failed to create ticket");
  return response.json();
};

export const updateTicket = async (id, updateData) => {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) throw new Error("Failed to update ticket");
  return response.json();
};