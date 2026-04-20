import axios from 'axios'; 

const api = axios.create({ 
  baseURL: '/api', 
  headers: { 
    'Content-Type': 'application/json' 
  } 
}); 

export const productoAPI = { 
  getAll: (params) => api.get('/productos', { params }), 
  getById: (id) => api.get(`/productos/${id}`), 
  create: (data) => api.post('/productos', data), 
  update: (id, data) => api.put(`/productos/${id}`, data), 
  delete: (id) => api.delete(`/productos/${id}`), 
  getDashboard: () => api.get('/productos/dashboard'), 
  getCategorias: () => api.get('/productos/categorias'),
  // Nuevos endpoints para reportes PDF reales
  getReporteOperacional: (categoria) => api.get('/reportes/operacional', { 
    params: { categoria },
    responseType: 'blob' 
  }),
  getReporteGestion: () => api.get('/reportes/gestion', { 
    responseType: 'blob' 
  })
}; 

export default api; 
