const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('civic_token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData, do not set Content-Type header so browser sets boundary
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),
  getDemoAccounts: () => request('/auth/demo-accounts'),

  // Complaints
  previewAI: (formData) => request('/complaints/preview-ai', { method: 'POST', body: formData }),
  createComplaint: (formData) => request('/complaints', { method: 'POST', body: formData }),
  getComplaints: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/complaints?${query}`);
  },
  getComplaintById: (id) => request(`/complaints/${id}`),
  updateDepartment: (id, payload) => request(`/complaints/${id}/department`, { method: 'PATCH', body: JSON.stringify(payload) }),
  updateStatus: (id, formData) => request(`/complaints/${id}/status`, { method: 'PATCH', body: formData }),

  // Clusters
  getClusters: () => request('/clusters'),
  getClusterById: (id) => request(`/clusters/${id}`),

  // Verifications
  submitVerification: (complaintId, formData) => request(`/verifications/${complaintId}`, { method: 'POST', body: formData }),

  // Copilot
  askCopilot: (question, currentIssueId = null) => request('/copilot/ask', {
    method: 'POST',
    body: JSON.stringify({ question, currentIssueId })
  }),

  // Analytics
  getAnalytics: () => request('/analytics'),
  getAreaOverview: (area) => request(`/analytics/area-overview?area=${encodeURIComponent(area || 'Central City Zone')}`),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
};
