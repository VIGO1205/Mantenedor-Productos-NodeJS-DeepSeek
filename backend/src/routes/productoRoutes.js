import express from 'express'; 
import { 
  getProductos, 
  getProductoById, 
  createProducto, 
  updateProducto, 
  deleteProducto, 
  getDashboardStats, 
  getCategorias 
} from '../controllers/productoController.js'; 

const router = express.Router(); 

router.get('/', getProductos); 
router.get('/dashboard', getDashboardStats); 
router.get('/categorias', getCategorias); 
router.get('/:id', getProductoById); 
router.post('/', createProducto); 
router.put('/:id', updateProducto); 
router.delete('/:id', deleteProducto); 

export default router; 
