import React, { useState, useEffect } from "react";
import { getTickets, getTicketDetail, createTicket, updateTicket } from "./services/api";

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Form states for Create
  const [newTicket, setNewTicket] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
    priority: "Medium"
  });

  // Form states for Detail/Update
  const [updateStatus, setUpdateStatus] = useState("");
  const [updatePriority, setUpdatePriority] = useState("");
  const [newNote, setNewNote] = useState("");

  // Fetch tickets on load or filter change
  const fetchTicketsData = async () => {
    try {
      setLoading(true);
      const data = await getTickets(search, statusFilter);
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketsData();
  }, [search, statusFilter]);

  // Handle Create Ticket submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket(newTicket);
      setShowCreateModal(false);
      setNewTicket({ customer_name: "", customer_email: "", subject: "", description: "", priority: "Medium" });
      fetchTicketsData();
    } catch (err) {
      alert("Failed to create ticket");
    }
  };

  // Open Ticket Detail Modal
  const openDetailModal = async (id) => {
    try {
      const data = await getTicketDetail(id);
      setSelectedTicket(data);
      setUpdateStatus(data.status);
      setUpdatePriority(data.priority);
      setNewNote("");
    } catch (err) {
      alert("Failed to load ticket details");
    }
  };

  // Handle Ticket Update submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      const updated = await updateTicket(selectedTicket.id, {
        status: updateStatus,
        priority: updatePriority,
        note: newNote.trim() ? newNote : undefined
      });
      setSelectedTicket(updated);
      setNewNote("");
      fetchTicketsData();
      alert("Ticket updated successfully!");
    } catch (err) {
      alert("Failed to update ticket");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white font-bold p-2 rounded-lg">DT</div>
          <span className="text-xl font-bold tracking-tight">Datastraw Support CRM</span>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
        >
          + Create Ticket
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ticket Dashboard</h1>
          
          {/* Search & Filter Controls */}
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 bg-white"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">Loading tickets...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">No support tickets found. Create one to get started!</td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => openDetailModal(t.id)}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 font-mono text-indigo-600 font-medium">{t.ticket_uuid}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{t.customer_name}</div>
                      <div className="text-xs text-gray-500">{t.customer_email}</div>
                    </td>
                    <td className="py-3 px-4 font-medium truncate max-w-xs">{t.subject}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium ${t.priority === 'High' ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Create New Ticket</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newTicket.customer_name}
                  onChange={(e) => setNewTicket({...newTicket, customer_name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Rahul Sharma"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  value={newTicket.customer_email}
                  onChange={(e) => setNewTicket({...newTicket, customer_email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="rahul@gmail.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Order not delivered"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Describe the issue in detail..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET DETAIL & UPDATE MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  {selectedTicket.ticket_uuid}
                </span>
                <h2 className="text-lg font-bold mt-1">{selectedTicket.subject}</h2>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg text-sm">
              <div>
                <span className="text-gray-500 block text-xs">Customer</span>
                <span className="font-semibold">{selectedTicket.customer_name}</span> ({selectedTicket.customer_email})
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Created At</span>
                <span className="font-medium">{new Date(selectedTicket.created_at).toLocaleString()}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block text-xs">Description</span>
                <p className="mt-1 text-gray-800 bg-white p-3 rounded border border-gray-200">{selectedTicket.description}</p>
              </div>
            </div>

            {/* Update Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Manage Ticket</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Update Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Update Priority</label>
                  <select
                    value={updatePriority}
                    onChange={(e) => setUpdatePriority(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Internal Notes History */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Internal Notes / Activity Log</label>
                <div className="space-y-2 mb-3 max-h-36 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {selectedTicket.notes && selectedTicket.notes.length > 0 ? (
                    selectedTicket.notes.map((note) => (
                      <div key={note.id} className="bg-white p-2.5 rounded border border-gray-200 text-xs shadow-xs">
                        <div className="flex justify-between text-gray-400 mb-1">
                          <span className="font-semibold text-indigo-600">{note.author}</span>
                          <span>{new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-gray-700">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No notes added yet.</p>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Add a new internal note or update..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}