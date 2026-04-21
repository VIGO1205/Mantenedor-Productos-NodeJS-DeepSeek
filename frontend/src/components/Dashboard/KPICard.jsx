import React from 'react'; 

const KPICard = ({ title, value, icon: Icon, color = 'primary' }) => { 
  const colors = { 
    primary: 'bg-blue-50 text-blue-600 border-blue-100', 
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100', 
    warning: 'bg-amber-50 text-amber-600 border-amber-100', 
    danger: 'bg-rose-50 text-rose-600 border-rose-100' 
  }; 

  return ( 
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"> 
      <div className="flex items-center justify-between"> 
        <div className="flex-1"> 
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p> 
          <p className="text-2xl font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors">
            {value}
          </p> 
        </div> 
        <div className={`p-4 rounded-xl border ${colors[color]} transition-all duration-300 group-hover:scale-110`}> 
          <Icon className="text-2xl" /> 
        </div> 
      </div> 
    </div> 
  ); 
}; 

export default KPICard; 
