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
    <div> 
      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
        <span className="w-1.5 h-6 bg-primary-500 rounded-full mr-3"></span>
        {title}
      </h3> 
      <ResponsiveContainer width="100%" height={350}> 
        <PieChart> 
          <Pie 
            data={data} 
            cx="50%" 
            cy="50%" 
            innerRadius={80} 
            outerRadius={120} 
            paddingAngle={5} 
            dataKey="valor" 
          > 
            {data.map((entry, index) => ( 
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="none" 
              /> 
            ))} 
          </Pie> 
          <Tooltip 
            formatter={(value) => `$${value.toLocaleString('es-CL', { minimumFractionDigits: 2 })}`} 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
          /> 
          <Legend iconType="circle" /> 
        </PieChart> 
      </ResponsiveContainer> 
    </div> 
  ); 
}; 

export default CustomPieChart; 
