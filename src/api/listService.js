// src/services/listService.js
import api from './axios';
import { apiService } from './apiService';

export const listService = {
  // GET /projects/:projectId/lists
  getAllListsByProject: (projectId) => {
    return api.get(`/lists/${projectId}/lists`);
  },

  // GET /lists/:id
  getListById: (id) => {
    return api.get(`/lists/${id}`);
  },

  // POST /projects/:projectId/lists
  createList: (projectId, listData) => {
    return apiService.postFormData(`/lists/${projectId}/lists`, listData);
  },

  // PUT /lists/:id
  updateList: (id, listData) => {
    return api.put(`/lists/${id}`, listData);
  },

  // DELETE /lists/:id
  deleteList: (id) => {
    return api.delete(`/lists/${id}`);
  },

  // PATCH /lists/:id/claim
  claimList: (id) => {
    return api.patch(`/lists/${id}/claim`);
  },

  // PATCH /lists/:id/status
  updateListStatus: (id, statusData) => {
    return api.patch(`/lists/${id}/status`, statusData);
  },

  /* ============================
      PROJECT MEMBER FEATURES
     ============================ */
  
  // POST /projects/:projectId/invite
  inviteUserToProject: (projectId, userData) => {
    return api.post(`/lists/${projectId}/invite`, userData);
  },

  // GET /projects/:projectId/members
  getProjectMembers: (projectId) => {
    return api.get(`/lists/${projectId}/members`);
  },

  // DELETE /projects/:projectId/members/:userId
  removeUserFromProject: (projectId, userId) => {
    return api.delete(`/lists/${projectId}/members/${userId}`);
  },
};
