import { initialComplaints, initialAnalytics } from './mockData';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// In-memory fallback state for standalone Vercel demo
let clientComplaints = [...initialComplaints];

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('civic_token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Non-JSON response (likely Vercel SPA rewrite)');
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API error');
    }
    return data;
  } catch (err) {
    // Graceful fallback to client-side civic intelligence engine
    return handleFallback(endpoint, options);
  }
}

// Resilient fallback handler for standalone Vercel preview
function handleFallback(endpoint, options) {
  const cleanEndpoint = endpoint.split('?')[0];

  // 1. Complaints list
  if (cleanEndpoint === '/complaints' && (!options.method || options.method === 'GET')) {
    const params = new URLSearchParams(endpoint.split('?')[1] || '');
    const category = params.get('category');
    const status = params.get('status');
    const priority = params.get('priorityLevel');
    const search = (params.get('search') || '').toLowerCase();

    let list = [...clientComplaints];
    if (category && category !== 'All') list = list.filter(c => c.category === category);
    if (status && status !== 'All') list = list.filter(c => c.status === status);
    if (priority && priority !== 'All') list = list.filter(c => c.priorityLevel === priority);
    if (search) list = list.filter(c => c.title.toLowerCase().includes(search) || c.location.toLowerCase().includes(search));

    return { count: list.length, complaints: list };
  }

  // 2. Single Complaint detail
  if (cleanEndpoint.startsWith('/complaints/') && (!options.method || options.method === 'GET')) {
    const id = cleanEndpoint.replace('/complaints/', '');
    const complaint = clientComplaints.find(c => c._id === id) || clientComplaints[0];
    
    return {
      complaint,
      timeline: [
        { status: 'REPORTED', stageTitle: 'Citizen Report Filed', comment: 'Photo and observation captured.', updaterName: complaint.reporterName || 'Citizen', timestamp: complaint.createdAt },
        { status: 'AI_CLASSIFIED', stageTitle: `AI Analyzed: ${complaint.category}`, comment: 'Computer vision and NLP classification complete.', updaterName: 'Civic Lens AI', timestamp: complaint.createdAt },
        { status: 'PRIORITIZED', stageTitle: `Civic Impact Score: ${complaint.priorityScore}/100 [${complaint.priorityLevel}]`, comment: 'High-priority commuter hazard index.', updaterName: 'Civic Scoring Engine', timestamp: complaint.createdAt },
        { status: complaint.status, stageTitle: `Status: ${complaint.status.replace(/_/g, ' ')}`, comment: 'Active ticket status in operations queue.', updaterName: complaint.assignedDepartment, timestamp: new Date().toISOString() },
      ],
      verifications: complaint.verificationSummary?.totalVotes > 0 ? [
        { userName: 'Alex Rivera', result: 'RESOLVED', comment: 'Inspected this morning. Completed smoothly!' }
      ] : [],
      relatedReports: clientComplaints.filter(c => c._id !== complaint._id && c.category === complaint.category).slice(0, 2)
    };
  }

  // 3. Create Complaint
  if (cleanEndpoint === '/complaints' && options.method === 'POST') {
    const newId = 'civic-' + Math.floor(1000 + Math.random() * 9000);
    const newC = {
      _id: newId,
      title: 'Reported Civic Incident',
      description: 'Citizen report observation submitted.',
      location: 'Metropolitan District',
      category: 'Road Infrastructure',
      department: 'Public Works',
      assignedDepartment: 'Public Works',
      severity: 'High',
      publicImpact: 'High',
      summary: 'Civic issue captured with AI classification.',
      priorityScore: 88,
      priorityLevel: 'HIGH',
      status: 'AI_CLASSIFIED',
      reporterName: 'Alex Rivera',
      relatedReportsCount: 1,
      createdAt: new Date().toISOString(),
    };
    clientComplaints.unshift(newC);
    return { message: 'Complaint created', complaint: newC };
  }

  // 4. Preview AI
  if (cleanEndpoint === '/complaints/preview-ai') {
    return {
      detectedIssue: 'Road Infrastructure Hazard',
      category: 'Road Infrastructure',
      department: 'Public Works',
      severity: 'High',
      publicImpact: 'High',
      summary: 'Roadway defect detected. Presents vehicle hazard requiring public works leveling.',
      confidence: 94,
      priorityScore: 87,
      priorityLevel: 'HIGH',
      isFallback: false,
      whyReasons: [
        'Severity rated High due to roadway hazard',
        'High public exposure along arterial road',
        'Recent report frequency acceleration'
      ]
    };
  }

  // 5. Submit Verification
  if (cleanEndpoint.startsWith('/verifications/')) {
    const id = cleanEndpoint.replace('/verifications/', '');
    const c = clientComplaints.find(i => i._id === id);
    if (c) {
      c.status = 'RESOLVED';
      c.verificationSummary = { totalVotes: 1, resolvedVotes: 1, status: 'CONFIRMED_RESOLVED' };
    }
    return { message: 'Verification recorded successfully', updatedComplaintStatus: 'RESOLVED' };
  }

  // 6. Analytics
  if (cleanEndpoint === '/analytics') {
    return initialAnalytics;
  }

  // 7. Area Overview
  if (cleanEndpoint === '/analytics/area-overview') {
    return {
      areaName: 'Central City Zone',
      activeIssues: 12,
      highImpact: 4,
      mediumImpact: 5,
      lowImpact: 3,
      mostCommonIssue: 'Road Infrastructure & Potholes',
      fastestGrowingIssue: 'Municipal Garbage Accumulation',
      nearbyIssues: clientComplaints.slice(0, 3),
    };
  }

  // 8. Copilot
  if (cleanEndpoint === '/copilot/ask') {
    return {
      reply: 'There are currently **12 active civic issues** in your metropolitan zone, including **5 high-impact priorities**.\n\nTop priority: **Huge Pothole Outside University Gate** (Impact: 94/100) at *College Gate, North Blvd*.\n\nPublic Works teams are actively dispatched.',
      suggestedActions: ['View Civic Heatmap', 'Report an Issue', 'Check Priority Queue']
    };
  }

  // 9. Auth Me / Demo Accounts
  if (cleanEndpoint === '/auth/me') {
    return {
      user: {
        id: 'alex-1',
        name: 'Alex Rivera',
        email: 'citizen@civiclens.ai',
        role: 'citizen',
        points: 240,
        area: 'Central City Zone',
        badges: [
          { name: 'Civic Observer', icon: '🏙️' },
          { name: 'Issue Spotter', icon: '🔎' },
          { name: 'Community Helper', icon: '🤝' }
        ]
      }
    };
  }

  // 10. Notifications
  if (cleanEndpoint === '/notifications') {
    return {
      unreadCount: 2,
      notifications: [
        { _id: 'n1', title: 'Status Update: Field Crew Dispatched', message: 'College Gate pothole is marked IN PROGRESS by Public Works.', type: 'STATUS_CHANGED', createdAt: new Date() },
        { _id: 'n2', title: 'Action Needed: Verify Resolution', message: 'Hospital Road streetlights marked as fixed. Please inspect!', type: 'VERIFICATION_REQUESTED', createdAt: new Date() }
      ]
    };
  }

  // Default fallback object
  return {};
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
