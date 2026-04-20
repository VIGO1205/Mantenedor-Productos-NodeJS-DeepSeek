import Joi from 'joi'; 

export const productoSchema = Joi.object({ 
  sku: Joi.string().max(50).required(), 
  nombre: Joi.string().max(100).required(), 
  descripcion: Joi.string().allow('', null), 
  categoria: Joi.string().max(50).required(), 
  precio_compra: Joi.number().min(0).required(), 
  precio_venta: Joi.number().min(0).required(), 
  stock_actual: Joi.number().integer().min(0).required(), 
  stock_minimo: Joi.number().integer().min(0).required(), 
  proveedor: Joi.string().max(100).allow('', null) 
}); 

export const actualizarProductoSchema = productoSchema.fork( 
  ['sku', 'nombre', 'categoria', 'precio_compra', 'precio_venta', 'stock_actual', 'stock_minimo'], 
  (schema) => schema.optional() 
); 
