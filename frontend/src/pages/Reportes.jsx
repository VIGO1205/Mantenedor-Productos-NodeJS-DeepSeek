import React, { useState, useEffect } from 'react'; 
import Layout from '../components/Layout/Layout'; 
import { productoAPI } from '../services/api'; 
import toast from 'react-hot-toast'; 
import { FiFileText, FiDownload, FiPrinter } from 'react-icons/fi'; 

const Reportes = () => { 
  const [categorias, setCategorias] = useState([]); 
  const [selectedCategoria, setSelectedCategoria] = useState(''); 
  const [generating, setGenerating] = useState(false); 
  const [reportType, setReportType] = useState('operacional'); 

  useEffect(() => { 
    loadCategorias(); 
  }, []); 

  const loadCategorias = async () => { 
    try { 
      const response = await productoAPI.getCategorias(); 
      setCategorias(response.data); 
    } catch (error) { 
      toast.error('Error al cargar categorías'); 
    } 
  }; 

  const generatePDF = async (type) => { 
    setGenerating(true); 
    try { 
      let response;
      if (type === 'operacional') {
        response = await productoAPI.getReporteOperacional(selectedCategoria);
      } else {
        response = await productoAPI.getReporteGestion();
      }
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' })); 
      const link = document.createElement('a'); 
      link.href = url; 
      link.download = `reporte_${type}_${Date.now()}.pdf`; 
      link.click(); 
      window.URL.revokeObjectURL(url); 
      
      toast.success('Reporte generado exitosamente'); 
    } catch (error) { 
      console.error('Error al generar reporte:', error);
      toast.error('Error al generar reporte real desde el servidor'); 
    } finally { 
      setGenerating(false); 
    } 
  }; 

  return ( 
    <Layout> 
      <div className="space-y-6"> 
        <div> 
          <h1 className="text-3xl font-bold text-gray-800">Reportes</h1> 
          <p className="text-gray-500 mt-1">Genera reportes profesionales en PDF</p> 
        </div> 

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 
          {/* Reporte Operacional */} 
          <div className="card"> 
            <div className="flex items-start justify-between mb-4"> 
              <div> 
                <h3 className="text-xl font-semibold text-gray-800">Reporte Operacional</h3> 
                <p className="text-gray-500 text-sm mt-1"> 
                  Listado detallado de inventario con filtro por categoría 
                </p> 
              </div> 
              <FiFileText className="text-3xl text-primary-500" /> 
            </div> 
            
            <div className="space-y-4"> 
              <div> 
                <label className="block text-sm font-medium text-gray-700 mb-1"> 
                  Categoría * 
                </label> 
                <select 
                  className="input-field" 
                  value={selectedCategoria} 
                  onChange={(e) => setSelectedCategoria(e.target.value)} 
                > 
                  <option value="">Todas las categorías</option> 
                  {categorias.map((cat) => ( 
                    <option key={cat} value={cat}>{cat}</option> 
                  ))} 
                </select> 
              </div> 
              
              <button 
                className="btn-primary w-full flex items-center justify-center gap-2" 
                onClick={() => generatePDF('operacional')} 
                disabled={generating} 
              > 
                <FiDownload /> 
                {generating ? 'Generando...' : 'Generar PDF Operacional'} 
              </button> 
            </div> 
          </div> 

          {/* Reporte de Gestión */} 
          <div className="card"> 
            <div className="flex items-start justify-between mb-4"> 
              <div> 
                <h3 className="text-xl font-semibold text-gray-800">Reporte de Gestión</h3> 
                <p className="text-gray-500 text-sm mt-1"> 
                  Análisis estratégico con KPIs y gráficos 
                </p> 
              </div> 
              <FiPrinter className="text-3xl text-primary-500" /> 
            </div> 
            
            <div className="space-y-4"> 
              <div className="bg-blue-50 p-3 rounded-lg"> 
                <p className="text-sm text-blue-800"> 
                  Incluye: KPIs principales, gráficos de análisis y lista de productos a reordenar 
                </p> 
              </div> 
              
              <button 
                className="btn-primary w-full flex items-center justify-center gap-2" 
                onClick={() => generatePDF('gestion')} 
                disabled={generating} 
              > 
                <FiPrinter /> 
                {generating ? 'Generando...' : 'Generar Reporte de Gestión'} 
              </button> 
            </div> 
          </div> 
        </div> 

        {/* Vista previa de información */} 
        <div className="card"> 
          <h3 className="text-lg font-semibold text-gray-800 mb-4"> 
            Información de Reportes 
          </h3> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"> 
            <div className="flex items-start gap-2"> 
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div> 
              <div> 
                <strong>Reporte Operacional:</strong> Tabla detallada de productos con SKU, nombre, stock y valor total. 
                Ideal para control diario de inventario. 
              </div> 
            </div> 
            <div className="flex items-start gap-2"> 
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div> 
              <div> 
                <strong>Reporte de Gestión:</strong> Análisis completo con KPIs, gráficos y recomendaciones. 
                Ideal para toma de decisiones estratégicas. 
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
    </Layout> 
  ); 
}; 

export default Reportes; 
