"use client";

export const ServiceDetailView = ({ service, onBack }) => {
  console.log("ServiceDetailView rendered with service:", service);

  return (
    <div className="mt-32 flex min-h-screen flex-col gap-4 bg-[#030303] px-8 py-8 text-white md:px-8 lg:px-16">
      <button
        onClick={onBack}
        className="mb-8 flex w-fit items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-white transition-all hover:bg-white/20"
      >
        ← Back to Services
      </button>
      <h1 className="mb-4 text-4xl font-bold">{service.name}</h1>
      <p className="text-gray-400">{service.description}</p>
      {/* Design here */}
      <div className="mt-8">
        <p className="text-xl">Full-page detail view for: {service.name}</p>
        <p className="mt-4 text-gray-500">Add your custom design here</p>
      </div>
    </div>
  );
};
