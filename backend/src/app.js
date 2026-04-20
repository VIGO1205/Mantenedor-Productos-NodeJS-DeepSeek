import express from 'express'; 
import cors from 'cors'; 
import dotenv from 'dotenv'; 

dotenv.config(); 

import productoRoutes from './routes/productoRoutes.js'; 
import reporteRoutes from './routes/reporteRoutes.js'; 
import sequelize from './config/database.js'; 
import reporteService from './services/reporteService.js'; 
import { errorHandler } from './middlewares/errorHandler.js'; 

const app = express(); 
const PORT = process.env.PORT || 3000; 

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use('/api/productos', productoRoutes); 
app.use('/api/reportes', reporteRoutes); 

app.use(errorHandler); 

async function startServer() { 
  try { 
    await sequelize.authenticate(); 
    console.log('✅ Conexión a PostgreSQL establecida'); 
    
    await sequelize.sync({ alter: true }); 
    console.log('✅ Modelos sincronizados'); 
    
    // Iniciar Express primero
    const server = app.listen(PORT, async () => { 
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`); 
      
      try {
        // Inicializar jsreport después de que Express ya tiene el puerto
        await reporteService.init();
        console.log('✅ Servicio de reportes inicializado');
      } catch (error) {
        console.error('❌ Error al inicializar jsreport:', error);
      }
    });

    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.error(`❌ El puerto ${PORT} está ocupado. Intenta reiniciando la terminal.`);
        process.exit(1);
      }
    });
  } catch (error) { 
    console.error('❌ Error al iniciar el servidor:', error); 
  } 
} 

startServer(); 
