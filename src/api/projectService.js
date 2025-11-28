import api from './axios';

export const projectService = {
  getAllProjects: () => {
    return api.get('/projects');
  },
  
  getProjectById: (id) => {
    return api.get(`/projects/${id}`);
  },
  
  createProject: (projectData) => {
    return api.post('/projects', projectData);
  },
  
  updateProject: (id, projectData) => {
    return api.put(`/projects/${id}`, projectData);
  },
  
  deleteProject: (id) => {
    return api.delete(`/projects/${id}`);
  },
  
  searchProjects: (query) => {
    return api.get(`/projects/search?q=${encodeURIComponent(query)}`);
  },
};