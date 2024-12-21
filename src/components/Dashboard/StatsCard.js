import React from 'react'

function StatsCard({ title, value, change, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`
        p-2 rounded-lg
        ${change > 0 ? 'bg-green-100' : change < 0 ? 'bg-red-100' : 'bg-gray-100'}
      `}>
        <Icon className={`
          w-5 h-5
          ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}
        `} />
      </div>
    </div>
    {change !== 0 && (
      <div className="mt-2 flex items-center">
        <span className={`
          text-sm font-medium
          ${change > 0 ? 'text-green-600' : 'text-red-600'}
        `}>
          {change > 0 ? '+' : ''}{change}%
        </span>
        <span className="text-gray-500 text-sm ml-1">vs last month</span>
      </div>
    )}
  </div>
  )
}

export default StatsCard