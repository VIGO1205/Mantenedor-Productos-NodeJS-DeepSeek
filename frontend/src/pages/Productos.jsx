import React, { useState, useEffect } from 'react'; 
import Layout from '../components/Layout/Layout'; 
import { productoAPI } from '../services/api'; 
import toast from 'react-hot-toast'; 
import Swal from 'sweetalert2'; 
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi'; 

const Productos = () => { 
  const [productos, setProductos] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [search, setSearch] = useState(''); 
  const [categorias, setCategorias] = useState([]); 
  const [filtroCategoria, setFiltroCategoria] = useState(''); 
  const [showModal, setShowModal] = useState(false); 
  const [editingProduct, setEditingProduct] = useState(null); 
  const [pagination, setPagination] = useState({ 
    offset: 0, 
    limit: 10, 
    total: 0, 
    hasMore: false 
  }); 
  const [orderBy, setOrderBy] = useState({ field: 'id', direction: 'ASC' }); 

  const [formData, setFormData] = useState({ 
    sku: '', 
    nombre: '', 
    descripcion: '', 
    categoria: '', 
    precio_compra: '', 
    precio_venta: '', 
    stock_actual: '', 
    stock_minimo: '', 
    proveedor: '' 
  }); 

  useEffect(() => { 
    loadCategorias(); 
  }, []); 

  useEffect(() => { 
    loadProductos(); 
  }, [search, filtroCategoria, pagination.offset, orderBy]); 

  const loadCategorias = async () => { 
    try { 
      const response = await productoAPI.getCategorias(); 
      setCategorias(response.data); 
    } catch (error) { 
      console.error('Error al cargar categorías:', error); 
    } 
  }; 

  const loadProductos = async () => { 
    setLoading(true); 
    try { 
      const response = await productoAPI.getAll({ 
        search, 
        categoria: filtroCategoria, 
        limit: pagination.limit, 
        offset: pagination.offset, 
        orderBy: orderBy.field, 
        orderDirection: orderBy.direction 
      }); 
      setProductos(response.data.productos); 
      setPagination(prev => ({ 
        ...prev, 
        total: response.data.total, 
        hasMore: response.data.pagination.hasMore 
      })); 
    } catch (error) { 
      toast.error('Error al cargar productos'); 
    } finally { 
      setLoading(false); 
    } 
  }; 

  const resetForm = () => { 
    setFormData({ 
      sku: '', 
      nombre: '', 
      descripcion: '', 
      categoria: '', 
      precio_compra: '', 
      precio_venta: '', 
      stock_actual: '', 
      stock_minimo: '', 
      proveedor: '' 
    }); 
    setEditingProduct(null); 
  }; 

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    
    // Validaciones 
    if (!formData.sku || !formData.nombre || !formData.categoria) { 
      toast.error('SKU, Nombre y Categoría son obligatorios'); 
      return; 
    } 

    try { 
      if (editingProduct) { 
        await productoAPI.update(editingProduct.id, formData); 
        toast.success('Producto actualizado exitosamente'); 
      } else { 
        await productoAPI.create(formData); 
        toast.success('Producto creado exitosamente'); 
      } 
      setShowModal(false); 
      resetForm(); 
      loadProductos(); 
    } catch (error) { 
      toast.error(error.response?.data?.error || 'Error al guardar producto'); 
    } 
  }; 

  const handleEdit = (producto) => { 
    setEditingProduct(producto); 
    setFormData({ 
      sku: producto.sku, 
      nombre: producto.nombre, 
      descripcion: producto.descripcion || '', 
      categoria: producto.categoria, 
      precio_compra: producto.precio_compra, 
      precio_venta: producto.precio_venta, 
      stock_actual: producto.stock_actual, 
      stock_minimo: producto.stock_minimo, 
      proveedor: producto.proveedor || '' 
    }); 
    setShowModal(true); 
  }; 

  const handleDelete = async (id, nombre) => { 
    const result = await Swal.fire({ 
      title: '¿Eliminar producto?', 
      text: `¿Estás seguro de eliminar "${nombre}"?`, 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#3085d6', 
      confirmButtonText: 'Sí, eliminar', 
      cancelButtonText: 'Cancelar' 
    }); 

    if (result.isConfirmed) { 
      try { 
        await productoAPI.delete(id); 
        toast.success('Producto eliminado exitosamente'); 
        loadProductos(); 
      } catch (error) { 
        toast.error('Error al eliminar producto'); 
      } 
    } 
  }; 

  const handleSort = (field) => { 
    setOrderBy(prev => ({ 
      field, 
      direction: prev.field === field && prev.direction === 'ASC' ? 'DESC' : 'ASC' 
    })); 
  }; 

  const nextPage = () => { 
    if (pagination.hasMore) { 
      setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit })); 
    } 
  }; 

  const prevPage = () => { 
    if (pagination.offset > 0) { 
      setPagination(prev => ({ ...prev, offset: prev.offset - prev.limit })); 
    } 
  }; 

  const ProductModal = () => ( 
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> 
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"> 
        <div className="p-6 border-b border-gray-200"> 
          <h2 className="text-2xl font-bold text-gray-800"> 
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'} 
          </h2> 
        </div> 
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4"> 
          <div className="grid grid-cols-2 gap-4"> 
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1"> 
                SKU * 
              </label> 
              <input 
                type="text" 
                className="input-field" 
                value={formData.sku} 
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })} 
                required 
              /> 
            </div> 
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1"> 
                Nombre * 
              </label> 
              <input 
                type="text" 
                className="input-field" 
                value={formData.nombre} 
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} 
                required 
              /> 
            </div> 
          </div> 

          <div> 
            <label className="block text-sm font-medium text-gray-700 mb-1"> 
              Descripción 
            </label> 
            <textarea 
              className="input-field" 
              rows="3" 
              value={formData.descripcion} 
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} 
            /> 
          </div> 

          <div className="grid grid-cols-2 gap-4"> 
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1"> 
                Categoría * 
              </label> 
              <input 
                type="text" 
                className="input-field" 
                value={formData.categoria} 
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} 
                required 
              /> 
            </div> 
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1"> 
                Proveedor 
              </label> 
              <input 
                type="text" 
                className="input-field" 
                value={formData.proveedor} 
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })} 
              /> 
            </div> 
          </div> 

          <div className="grid grid-cols-2 gap-4"> 
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1"> 
                Precio Compra * 
              </label> 
              <input 
                type="number" 
                step="0.01" 
                className="input-field" 
                value={formData.precio_compra} 
                onChange={(e) => setFormData({ ...formData, precio_compra: e.target.value })} 
                required 
              /> 
            </div> 
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1"> 
                Precio Venta * 
              </label> 
              <input 
                type="number" 
                step="0.01" 
                className="input-field" 
                value={formData.precio_venta} 
                onChange={(e) => setFormData({ ...formData, precio_venta: e.target.value })} 
                required 
              /> 
            </div> 
          </div> 

          <div className="grid grid-cols-2 gap-4"> 
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1"> 
                Stock Actual * 
              </label> 
              <input 
                type="number" 
                className="input-field" 
                value={formData.stock_actual} 
                onChange={(e) => setFormData({ ...formData, stock_actual: e.target.value })} 
                required 
              /> 
            </div> 
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1"> 
                Stock Mínimo * 
              </label> 
              <input 
                type="number" 
                className="input-field" 
                value={formData.stock_minimo} 
                onChange={(e) => setFormData({ ...formData, stock_minimo: e.target.value })} 
                required 
              /> 
            </div> 
          </div> 

          <div className="flex justify-end gap-3 pt-4"> 
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => { 
                setShowModal(false); 
                resetForm(); 
              }} 
            > 
              Cancelar 
            </button> 
            <button type="submit" className="btn-primary"> 
              {editingProduct ? 'Actualizar' : 'Crear'} 
            </button> 
          </div> 
        </form> 
      </div> 
    </div> 
  ); 

  return ( 
    <Layout> 
      <div className="space-y-6"> 
        <div className="flex justify-between items-center"> 
          <div> 
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1> 
            <p className="text-gray-500 mt-1">Administra tu inventario de productos</p> 
          </div> 
          <button 
            className="btn-primary flex items-center gap-2" 
            onClick={() => { 
              resetForm(); 
              setShowModal(true); 
            }} 
          > 
            <FiPlus /> Nuevo Producto 
          </button> 
        </div> 

        {/* Filtros */} 
        <div className="card"> 
          <div className="flex flex-wrap gap-4"> 
            <div className="flex-1 min-w-[200px]"> 
              <div className="relative"> 
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> 
                <input 
                  type="text" 
                  placeholder="Buscar por SKU, nombre o categoría..." 
                  className="input-field pl-10" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                /> 
              </div> 
            </div> 
            <div className="w-64"> 
              <select 
                className="input-field" 
                value={filtroCategoria} 
                onChange={(e) => setFiltroCategoria(e.target.value)} 
              > 
                <option value="">Todas las categorías</option> 
                {categorias.map((cat) => ( 
                  <option key={cat} value={cat}>{cat}</option> 
                ))} 
              </select> 
            </div> 
            <button 
              className="btn-secondary flex items-center gap-2" 
              onClick={() => { 
                setSearch(''); 
                setFiltroCategoria(''); 
                setOrderBy({ field: 'id', direction: 'ASC' }); 
              }} 
            > 
              <FiRefreshCw /> Limpiar Filtros 
            </button> 
          </div> 
        </div> 

        {/* Tabla de Productos */} 
        <div className="card overflow-x-auto"> 
          {loading ? ( 
            <div className="text-center py-8 text-gray-500">Cargando productos...</div> 
          ) : ( 
            <> 
              <table className="w-full"> 
                <thead className="bg-gray-50"> 
                  <tr> 
                    {['ID', 'SKU', 'Nombre', 'Categoría', 'Precio Venta', 'Stock', 'Acciones'].map((col, idx) => ( 
                      <th 
                        key={idx} 
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-gray-800" 
                        onClick={() => handleSort(col.toLowerCase().replace('precio venta', 'precio_venta'))} 
                      > 
                        {col} 
                        {orderBy.field === col.toLowerCase().replace('precio venta', 'precio_venta') && ( 
                          <span className="ml-1">{orderBy.direction === 'ASC' ? '↑' : '↓'}</span> 
                        )} 
                      </th> 
                    ))} 
                  </tr> 
                </thead> 
                <tbody> 
                  {productos.map((producto) => ( 
                    <tr key={producto.id} className="border-t border-gray-200 hover:bg-gray-50"> 
                      <td className="px-4 py-3 text-sm text-gray-700">{producto.id}</td> 
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">{producto.sku}</td> 
                      <td className="px-4 py-3 text-sm text-gray-700">{producto.nombre}</td> 
                      <td className="px-4 py-3 text-sm text-gray-700"> 
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"> 
                          {producto.categoria} 
                        </span> 
                      </td> 
                      <td className="px-4 py-3 text-sm text-gray-700"> 
                        ${parseFloat(producto.precio_venta).toFixed(2)} 
                      </td> 
                      <td className="px-4 py-3"> 
                        <span className={`text-sm font-semibold ${ 
                          producto.stock_actual < producto.stock_minimo 
                            ? 'text-red-600' 
                            : 'text-green-600' 
                        }`}> 
                          {producto.stock_actual} / {producto.stock_minimo} 
                        </span> 
                      </td> 
                      <td className="px-4 py-3"> 
                        <div className="flex gap-2"> 
                          <button 
                            className="text-blue-600 hover:text-blue-800" 
                            onClick={() => handleEdit(producto)} 
                          > 
                            <FiEdit2 /> 
                          </button> 
                          <button 
                            className="text-red-600 hover:text-red-800" 
                            onClick={() => handleDelete(producto.id, producto.nombre)} 
                          > 
                            <FiTrash2 /> 
                          </button> 
                        </div> 
                      </td> 
                    </tr> 
                  ))} 
                </tbody> 
              </table> 

              {/* Paginación */} 
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200"> 
                <div className="text-sm text-gray-500"> 
                  Mostrando {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} de {pagination.total} productos 
                </div> 
                <div className="flex gap-2"> 
                  <button 
                    className="btn-secondary disabled:opacity-50" 
                    onClick={prevPage} 
                    disabled={pagination.offset === 0} 
                  > 
                    Anterior 
                  </button> 
                  <button 
                    className="btn-secondary disabled:opacity-50" 
                    onClick={nextPage} 
                    disabled={!pagination.hasMore} 
                  > 
                    Siguiente 
                  </button> 
                </div> 
              </div> 
            </> 
          )} 
        </div> 
      </div> 

      {showModal && <ProductModal />} 
    </Layout> 
  ); 
}; 

export default Productos;
