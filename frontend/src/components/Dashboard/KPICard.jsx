import React from 'react'; 

const KPICard = ({ title, value, icon: Icon, color = 'primary' }) => { 
  const colors = { 
    primary: 'bg-blue-50 text-blue-600', 
    success: 'bg-green-50 text-green-600', 
    warning: 'bg-yellow-50 text-yellow-600', 
    danger: 'bg-red-50 text-red-600' 
  }; 

  return ( 
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"> 
      <div className="flex items-center justify-between"> 
        <div> 
          <p className="text-sm text-gray-500 mb-1">{title}</p> 
          <p className="text-2xl font-bold text-gray-800">{value}</p> 
        </div> 
        <div className={`p-3 rounded-lg ${colors[color]}`}> 
          <Icon className="text-2xl" /> 
        </div> 
      </div> 
    </div> 
  ); 
}; 

export default KPICard; 
