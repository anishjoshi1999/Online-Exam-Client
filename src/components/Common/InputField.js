import React from 'react'

function InputField({ label, icon: Icon, ...props }) {
  return (
    <div className="space-y-2">
    {label && (
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
    )}
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black transition-all duration-200"
      />
    </div>
  </div>
  )
}

export default InputField