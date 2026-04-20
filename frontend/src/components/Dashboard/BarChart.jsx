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
    <div className="card"> 
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3> 
      <ResponsiveContainer width="100%" height={400}> 
        <BarChart data={data}> 
          <CartesianGrid strokeDasharray="3 3" /> 
          <XAxis dataKey="categoria" /> 
          <YAxis /> 
          <Tooltip /> 
          <Legend /> 
          <Bar dataKey="cantidad" fill="#3b82f6" name="Cantidad de Productos" /> 
        </BarChart> 
      </ResponsiveContainer> 
    </div> 
  ); 
}; 

export default CustomBarChart; 
