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
      <div className="space-y-6"> 
        <div> 
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1> 
          <p className="text-gray-500 mt-1">Análisis de inventario y métricas clave</p> 
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
            value={`$${stats?.kpis?.valorTotalInventario?.toFixed(2) || 0}`} 
            icon={FiDollarSign} 
            color="success" 
          /> 
          <KPICard 
            title="Productos Bajo Stock" 
            value={stats?.kpis?.productosBajoStock || 0} 
            icon={FiAlertCircle} 
            color="warning" 
          /> 
          <KPICard 
            title="Producto Más Valioso" 
            value={stats?.kpis?.productoMasValioso?.nombre || 'N/A'} 
            icon={FiStar} 
            color="danger" 
          /> 
        </div> 

        {/* Gráficos */} 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 
          <CustomBarChart 
            data={stats?.charts?.topCategorias || []} 
            title="Top 10 Categorías con Más Productos" 
          /> 
          <CustomPieChart 
            data={stats?.charts?.distribucionValor || []} 
            title="Distribución de Valor por Categoría" 
          /> 
        </div> 

        {/* Productos Bajo Stock */} 
        <div className="card"> 
          <h3 className="text-lg font-semibold text-gray-800 mb-4"> 
            Productos que Necesitan Reorden 
          </h3> 
          <div className="overflow-x-auto"> 
            <table className="w-full"> 
              <thead className="bg-gray-50"> 
                <tr> 
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">SKU</th> 
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Nombre</th> 
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Categoría</th> 
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Stock Actual</th> 
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Stock Mínimo</th> 
                </tr> 
              </thead> 
              <tbody> 
                {stats?.productosBajoStock?.map((producto) => ( 
                  <tr key={producto.id} className="border-t border-gray-200 hover:bg-gray-50"> 
                    <td className="px-4 py-3 text-sm text-gray-700">{producto.sku}</td> 
                    <td className="px-4 py-3 text-sm text-gray-700">{producto.nombre}</td> 
                    <td className="px-4 py-3 text-sm text-gray-700">{producto.categoria}</td> 
                    <td className="px-4 py-3 text-sm text-red-600 font-semibold"> 
                      {producto.stock_actual} 
                    </td> 
                    <td className="px-4 py-3 text-sm text-gray-700">{producto.stock_minimo}</td> 
                  </tr> 
                ))} 
              </tbody> 
            </table> 
          </div> 
        </div> 
      </div> 
    </Layout> 
  ); 
}; 

export default Dashboard; 
