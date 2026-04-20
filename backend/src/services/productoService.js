import Producto from '../models/Producto.js'; 
import { Op } from 'sequelize'; 

class ProductoService { 
  async getAll(filters = {}) { 
    const where = {}; 
    
    if (filters.search) { 
      where[Op.or] = [ 
        { sku: { [Op.iLike]: `%${filters.search}%` } }, 
        { nombre: { [Op.iLike]: `%${filters.search}%` } }, 
        { categoria: { [Op.iLike]: `%${filters.search}%` } } 
      ]; 
    } 
    
    if (filters.categoria) { 
      where.categoria = filters.categoria; 
    } 
    
    const order = filters.orderBy 
      ? [[filters.orderBy, filters.orderDirection || 'ASC']] 
      : [['id', 'ASC']]; 
    
    const limit = filters.limit ? parseInt(filters.limit) : 100; 
    const offset = filters.offset ? parseInt(filters.offset) : 0; 
    
    const { count, rows } = await Producto.findAndCountAll({ 
      where, 
      order, 
      limit, 
      offset 
    }); 
    
    return { 
      total: count, 
      productos: rows, 
      pagination: { 
        limit, 
        offset, 
        hasMore: offset + limit < count 
      } 
    }; 
  } 
  
  async getById(id) { 
    const producto = await Producto.findByPk(id); 
    if (!producto) { 
      throw new Error('Producto no encontrado'); 
    } 
    return producto; 
  } 
  
  async create(data) { 
    const existing = await Producto.findOne({ where: { sku: data.sku } }); 
    if (existing) { 
      throw new Error('Ya existe un producto con este SKU'); 
    } 
    return await Producto.create(data); 
  } 
  
  async update(id, data) { 
    const producto = await this.getById(id); 
    
    if (data.sku && data.sku !== producto.sku) { 
      const existing = await Producto.findOne({ where: { sku: data.sku } }); 
      if (existing) { 
        throw new Error('Ya existe un producto con este SKU'); 
      } 
    } 
    
    await producto.update(data); 
    return producto; 
  } 
  
  async delete(id) { 
    const producto = await this.getById(id); 
    await producto.destroy(); 
    return { message: 'Producto eliminado exitosamente' }; 
  } 
  
  async getDashboardStats() { 
    const productos = await Producto.findAll(); 
    
    const totalProductos = productos.length; 
    
    const valorTotalInventario = productos.reduce((sum, p) => 
      sum + (p.stock_actual * parseFloat(p.precio_compra)), 0 
    ); 
    
    const productosBajoStock = productos.filter(p => p.stock_actual < p.stock_minimo); 
    
    let productoMasValioso = null; 
    let maxValor = 0; 
    productos.forEach(p => { 
      const valor = p.stock_actual * parseFloat(p.precio_compra); 
      if (valor > maxValor) { 
        maxValor = valor; 
        productoMasValioso = p; 
      } 
    }); 
    
    const categoriasMap = new Map(); 
    productos.forEach(p => { 
      const count = categoriasMap.get(p.categoria) || 0; 
      categoriasMap.set(p.categoria, count + 1); 
    }); 
    
    const topCategorias = Array.from(categoriasMap.entries()) 
      .map(([categoria, cantidad]) => ({ categoria, cantidad })) 
      .sort((a, b) => b.cantidad - a.cantidad) 
      .slice(0, 10); 
    
    const distribucionValor = []; 
    productos.forEach(p => { 
      const valor = p.stock_actual * parseFloat(p.precio_compra); 
      const existing = distribucionValor.find(d => d.categoria === p.categoria); 
      if (existing) { 
        existing.valor += valor; 
      } else { 
        distribucionValor.push({ categoria: p.categoria, valor }); 
      } 
    }); 
    
    return { 
      kpis: { 
        totalProductos, 
        valorTotalInventario, 
        productosBajoStock: productosBajoStock.length, 
        productoMasValioso: productoMasValioso ? { 
          id: productoMasValioso.id, 
          nombre: productoMasValioso.nombre, 
          valor: maxValor 
        } : null 
      }, 
      charts: { 
        topCategorias, 
        distribucionValor: distribucionValor.filter(d => d.valor > 0) 
      }, 
      productosBajoStock: productosBajoStock.map(p => ({ 
        id: p.id, 
        sku: p.sku, 
        nombre: p.nombre, 
        stock_actual: p.stock_actual, 
        stock_minimo: p.stock_minimo, 
        categoria: p.categoria 
      })) 
    }; 
  } 
  
  async getCategorias() { 
    const categorias = await Producto.findAll({ 
      attributes: ['categoria'], 
      group: ['categoria'], 
      raw: true 
    }); 
    return categorias.map(c => c.categoria); 
  } 
} 

export default new ProductoService(); 
