import React from "react";

export const DetailedStep = ({
  title,
  description,
  imageSrc,
  imageAlt,
  ariaLabel,
  index,
}) => (
  <article
    className="relative bg-white rounded-2xl shadow-lg transition-transform hover:scale-[1.04] p-8"
    aria-label={ariaLabel}
  >
    <div
      className={`flex flex-col md:flex-row ${
        index % 2 === 1 ? "md:flex-row-reverse" : ""
      } items-center gap-8`}
    >
      <div className="w-full md:w-1/2">
        <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl"
            aria-hidden="true"
          >
            {index + 1}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </article>
);
