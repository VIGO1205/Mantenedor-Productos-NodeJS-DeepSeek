import React, { useState, useEffect } from 'react'; 
import { FiPackage, FiDollarSign, FiAlertCircle, FiStar } from 'react-icons/fi'; 
import Layout from '../components/Layout/Layout'; 
import KPICard from '../components/Dashboard/KPICard'; 
import CustomBarChart from '../components/Dashboard/BarChart'; 
import CustomPieChart from '../components/Dashboard/PieChart'; 
import { productoAPI } from '../services/api'; 
import toast from 'react-hot-toast'; 

const Dashboard = () => { 
  const [stats, setStats] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => { 
    loadDashboardStats(); 
  }, []); 

  const loadDashboardStats = async () => { 
    try { 
      const response = await productoAPI.getDashboard(); 
      setStats(response.data); 
    } catch (error) { 
      toast.error('Error al cargar estadísticas'); 
    } finally { 
      setLoading(false); 
    } 
  }; 

  if (loading) { 
    return ( 
      <Layout> 
        <div className="flex items-center justify-center h-96"> 
          <div className="text-gray-500">Cargando dashboard...</div> 
        </div> 
      </Layout> 
    ); 
  } 

  return ( 
    <Layout> 
      <div className="space-y-8"> 
        {/* Header section with modern design */}
        <div className="relative overflow-hidden bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Panel de Control de Inventario
            </h1> 
            <p className="text-lg text-gray-600 mt-3 max-w-2xl leading-relaxed">
              Bienvenido al sistema de gestión. Aquí puedes monitorear el rendimiento de tus productos, 
              controlar los niveles de stock y visualizar la distribución de valor en tiempo real.
            </p> 
          </div>
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary-50 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-50 rounded-full opacity-50 blur-2xl"></div>
        </div> 

        {/* KPIs */} 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
          <KPICard 
            title="Total Productos" 
            value={stats?.kpis?.totalProductos || 0} 
            icon={FiPackage} 
            color="primary" 
          /> 
          <KPICard 
            title="Valor Inventario" 
            value={`$${stats?.kpis?.valorTotalInventario?.toLocaleString('es-CL', { minimumFractionDigits: 2 }) || 0}`} 
            icon={FiDollarSign} 
            color="success" 
          /> 
          <KPICard 
            title="Bajo Stock" 
            value={stats?.kpis?.productosBajoStock || 0} 
            icon={FiAlertCircle} 
            color="warning" 
          /> 
          <KPICard 
            title="Más Valioso" 
            value={stats?.kpis?.productoMasValioso?.nombre || 'N/A'} 
            icon={FiStar} 
            color="danger" 
          /> 
        </div> 

        {/* Gráficos section with improved spacing */} 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> 
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <CustomBarChart 
              data={stats?.charts?.topCategorias || []} 
              title="Top 10 Categorías con Más Productos" 
            /> 
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <CustomPieChart 
              data={stats?.charts?.distribucionValor || []} 
              title="Distribución de Valor por Categoría" 
            /> 
          </div>
        </div> 

        {/* Productos Bajo Stock Table with improved design */} 
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"> 
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <div>
              <h3 className="text-xl font-bold text-gray-800"> 
                Alertas de Reabastecimiento
              </h3> 
              <p className="text-sm text-gray-500 mt-1">Productos que han alcanzado o están por debajo del stock mínimo</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider">
              Acción Requerida
            </span>
          </div>
          <div className="overflow-x-auto"> 
            <table className="w-full"> 
              <thead className="bg-gray-50/50"> 
                <tr> 
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th> 
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th> 
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</th> 
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Actual</th> 
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Mínimo</th> 
                </tr> 
              </thead> 
              <tbody className="divide-y divide-gray-100"> 
                {stats?.productosBajoStock?.length > 0 ? (
                  stats.productosBajoStock.map((producto) => ( 
                    <tr key={producto.id} className="hover:bg-blue-50/30 transition-colors group"> 
                      <td className="px-6 py-4 text-sm font-medium text-gray-600 group-hover:text-primary-600 transition-colors">{producto.sku}</td> 
                      <td className="px-6 py-4 text-sm text-gray-800 font-semibold">{producto.nombre}</td> 
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                          {producto.categoria}
                        </span>
                      </td> 
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex items-center justify-center">
                          <span className="flex items-center px-3 py-1 rounded-lg bg-red-50 text-red-700 font-bold border border-red-100">
                            <FiAlertCircle className="mr-1.5" />
                            {producto.stock_actual} 
                          </span>
                        </div>
                      </td> 
                      <td className="px-6 py-4 text-sm text-center text-gray-500 font-medium">{producto.stock_minimo}</td> 
                    </tr> 
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">
                      No hay productos con bajo stock actualmente.
                    </td>
                  </tr>
                )} 
              </tbody> 
            </table> 
          </div> 
        </div> 
      </div> 
    </Layout> 
  ); 
}; 

export default Dashboard; 
