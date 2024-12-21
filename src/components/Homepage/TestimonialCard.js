import { Award } from "lucide-react";

export function TestimonialCard({ quote, author, role, rating }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Award key={i} className="h-5 w-5 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 italic mb-6 text-lg leading-relaxed">
        "{quote}"
      </p>
      <div>
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-gray-500">{role}</p>
      </div>
    </div>
  );
}
