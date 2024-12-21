export function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
      <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
        <Icon className="h-7 w-7 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
