import { DataTypes } from 'sequelize'; 
import sequelize from '../config/database.js'; 

const Producto = sequelize.define('Producto', { 
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  }, 
  sku: { 
    type: DataTypes.STRING(50), 
    unique: true, 
    allowNull: false 
  }, 
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  }, 
  descripcion: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  }, 
  categoria: { 
    type: DataTypes.STRING(50), 
    allowNull: false 
  }, 
  precio_compra: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false, 
    validate: { 
      min: 0 
    } 
  }, 
  precio_venta: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false, 
    validate: { 
      min: 0 
    } 
  }, 
  stock_actual: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0, 
    validate: { 
      min: 0 
    } 
  }, 
  stock_minimo: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 5, 
    validate: { 
      min: 0 
    } 
  }, 
  proveedor: { 
    type: DataTypes.STRING(100), 
    allowNull: true 
  }, 
  fecha_creacion: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }, 
  fecha_ultima_actualizacion: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  } 
}, { 
  tableName: 'productos', 
  hooks: { 
    beforeUpdate: (producto) => { 
      producto.fecha_ultima_actualizacion = new Date(); 
    } 
  } 
}); 

export default Producto; 
