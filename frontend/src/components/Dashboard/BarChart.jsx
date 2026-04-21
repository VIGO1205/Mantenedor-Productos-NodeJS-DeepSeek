import React from 'react'; 
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'; 

const CustomBarChart = ({ data, title }) => { 
  return ( 
    <div> 
      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-1.5 h-6 bg-primary-500 rounded-full mr-3"></span>
        {title}
      </h3> 
      <ResponsiveContainer width="100%" height={350}> 
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}> 
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /> 
          <XAxis 
            dataKey="categoria" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          /> 
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          /> 
          <Tooltip 
            cursor={{ fill: '#f8fafc' }} 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
          /> 
          <Legend iconType="circle" /> 
          <Bar 
            dataKey="cantidad" 
            fill="#3b82f6" 
            name="Cantidad de Productos" 
            radius={[4, 4, 0, 0]} 
            barSize={40} 
          /> 
        </BarChart> 
      </ResponsiveContainer> 
    </div> 
  ); 
}; 

export default CustomBarChart; 
