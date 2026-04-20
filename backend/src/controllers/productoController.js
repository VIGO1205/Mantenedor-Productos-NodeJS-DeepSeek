import productoService from '../services/productoService.js'; 
import { productoSchema, actualizarProductoSchema } from '../validations/productoValidation.js'; 

export const getProductos = async (req, res) => { 
  try { 
    const { search, categoria, orderBy, orderDirection, limit, offset } = req.query; 
    const result = await productoService.getAll({ 
      search, 
      categoria, 
      orderBy, 
      orderDirection, 
      limit, 
      offset 
    }); 
    res.json(result); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

export const getProductoById = async (req, res) => { 
  try { 
    const producto = await productoService.getById(req.params.id); 
    res.json(producto); 
  } catch (error) { 
    res.status(404).json({ error: error.message }); 
  } 
}; 

export const createProducto = async (req, res) => { 
  try { 
    const { error, value } = productoSchema.validate(req.body); 
    if (error) { 
      return res.status(400).json({ error: error.details[0].message }); 
    } 
    const producto = await productoService.create(value); 
    res.status(201).json(producto); 
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  } 
}; 

export const updateProducto = async (req, res) => { 
  try { 
    const { error, value } = actualizarProductoSchema.validate(req.body); 
    if (error) { 
      return res.status(400).json({ error: error.details[0].message }); 
    } 
    const producto = await productoService.update(req.params.id, value); 
    res.json(producto); 
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  } 
}; 

export const deleteProducto = async (req, res) => { 
  try { 
    const result = await productoService.delete(req.params.id); 
    res.json(result); 
  } catch (error) { 
    res.status(404).json({ error: error.message }); 
  } 
}; 

export const getDashboardStats = async (req, res) => { 
  try { 
    const stats = await productoService.getDashboardStats(); 
    res.json(stats); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

export const getCategorias = async (req, res) => { 
  try { 
    const categorias = await productoService.getCategorias(); 
    res.json(categorias); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 
