import Producto from '../models/Producto.js'; 
import sequelize from '../config/database.js'; 

const productosEjemplo = [ 
  { 
    sku: 'PROD-001', 
    nombre: 'Laptop Gaming GamerPro X1', 
    descripcion: 'Laptop de alto rendimiento para gaming y trabajo profesional', 
    categoria: 'Electrónica', 
    precio_compra: 800.00, 
    precio_venta: 1299.99, 
    stock_actual: 15, 
    stock_minimo: 5, 
    proveedor: 'TechDistributors SA' 
  }, 
  { 
    sku: 'PROD-002', 
    nombre: 'Mouse Inalámbrico Ergo', 
    descripcion: 'Mouse ergonómico con conexión Bluetooth', 
    categoria: 'Periféricos', 
    precio_compra: 25.00, 
    precio_venta: 49.99, 
    stock_actual: 45, 
    stock_minimo: 10, 
    proveedor: 'AccessoriesPlus' 
  }, 
  { 
    sku: 'PROD-003', 
    nombre: 'Monitor 27" 4K UHD', 
    descripcion: 'Monitor profesional con resolución 4K', 
    categoria: 'Electrónica', 
    precio_compra: 350.00, 
    precio_venta: 599.99, 
    stock_actual: 8, 
    stock_minimo: 3, 
    proveedor: 'DisplayWorld' 
  }, 
  { 
    sku: 'PROD-004', 
    nombre: 'Teclado Mecánico RGB', 
    descripcion: 'Teclado mecánico con switches azules', 
    categoria: 'Periféricos', 
    precio_compra: 60.00, 
    precio_venta: 129.99, 
    stock_actual: 2, 
    stock_minimo: 5, 
    proveedor: 'AccessoriesPlus' 
  }, 
  { 
    sku: 'PROD-005', 
    nombre: 'Silla Ergonómica Ejecutiva', 
    descripcion: 'Silla con soporte lumbar ajustable', 
    categoria: 'Mobiliario', 
    precio_compra: 150.00, 
    precio_venta: 299.99, 
    stock_actual: 10, 
    stock_minimo: 4, 
    proveedor: 'OfficeFurniture' 
  } 
]; 

async function runSeed() { 
  try { 
    await sequelize.authenticate(); 
    await sequelize.sync({ force: true }); 
    
    for (const producto of productosEjemplo) { 
      await Producto.create(producto); 
    } 
    
    console.log('✅ Datos de ejemplo insertados correctamente'); 
    process.exit(0); 
  } catch (error) { 
    console.error('❌ Error al insertar datos:', error); 
    process.exit(1); 
  } 
} 

runSeed(); 
