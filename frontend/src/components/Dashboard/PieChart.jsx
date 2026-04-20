import React from 'react'; 
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'; 

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']; 

const CustomPieChart = ({ data, title }) => { 
  return ( 
    <div className="card"> 
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3> 
      <ResponsiveContainer width="100%" height={400}> 
        <PieChart> 
          <Pie 
            data={data} 
            cx="50%" 
            cy="50%" 
            labelLine={false} 
            label={({ categoria, valor }) => `${categoria}: $${valor.toFixed(2)}`} 
            outerRadius={150} 
            fill="#8884d8" 
            dataKey="valor" 
          > 
            {data.map((entry, index) => ( 
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> 
            ))} 
          </Pie> 
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} /> 
          <Legend /> 
        </PieChart> 
      </ResponsiveContainer> 
    </div> 
  ); 
}; 

export default CustomPieChart; 
