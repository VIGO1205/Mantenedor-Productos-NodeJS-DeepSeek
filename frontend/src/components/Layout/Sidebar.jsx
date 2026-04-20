import React from 'react'; 
import { NavLink } from 'react-router-dom'; 
import { 
  FiPackage, 
  FiBarChart2, 
  FiFileText, 
  FiSettings 
} from 'react-icons/fi'; 

const Sidebar = () => { 
  const menuItems = [ 
    { path: '/', icon: FiBarChart2, label: 'Dashboard' }, 
    { path: '/productos', icon: FiPackage, label: 'Productos' }, 
    { path: '/reportes', icon: FiFileText, label: 'Reportes' }, 
    { path: '/configuracion', icon: FiSettings, label: 'Configuración' } 
  ]; 

  return ( 
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200"> 
      <div className="p-6 border-b border-gray-200"> 
        <h1 className="text-xl font-bold text-gray-800">Gestión de Productos</h1> 
        <p className="text-sm text-gray-500">Sistema de Inventario</p> 
      </div> 
      
      <nav className="p-4"> 
        {menuItems.map((item) => ( 
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${ 
                isActive 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100' 
              }` 
            } 
          > 
            <item.icon className="text-xl" /> 
            <span>{item.label}</span> 
          </NavLink> 
        ))} 
      </nav> 
    </aside> 
  ); 
}; 

export default Sidebar; 
