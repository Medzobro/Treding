
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceChart = () => {
  const data = [
    { name: 'الإثنين', profit: 45.50 },
    { name: 'الثلاثاء', profit: 78.20 },
    { name: 'الأربعاء', profit: 156.80 },
    { name: 'الخميس', profit: 98.50 },
    { name: 'الجمعة', profit: 125.50 },
    { name: 'السبت', profit: 189.30 },
    { name: 'الأحد', profit: 234.70 }
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'الربح ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'الربح']}
            labelStyle={{ color: '#374151' }}
          />
          <Line 
            type="monotone" 
            dataKey="profit" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
