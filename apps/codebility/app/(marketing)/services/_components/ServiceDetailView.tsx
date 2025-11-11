"use client";

import Image from "next/image";
import Link from "next/link";
import { defaultAvatar } from "@/public/assets/images";
import { motion } from "framer-motion";

import { Button } from "@codevs/ui";

export const ServiceDetailView = ({ service, onBack }) => {
  console.log("ServiceDetailView rendered with service:", service);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-8 pb-24 sm:px-6 md:pb-8">
      {/* Back Button */}
      <div className="mb-6 mt-24">
        <Button
          onClick={onBack}
          className="from-customTeal to-customViolet-100 via-customBlue-100 h-12 rounded-full bg-gradient-to-r p-0.5 hover:bg-gradient-to-br md:w-40"
        >
          <span className="bg-black-500 flex h-full w-full items-center justify-center rounded-full text-sm text-white lg:text-lg">
            ← Back to Services
          </span>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        <Image
          src={service.main_image || defaultAvatar}
          alt={service.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Header Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h1 className="mb-3 text-4xl font-extrabold md:text-6xl">
              {service.name}
            </h1>
            <p className="max-w-2xl text-lg text-gray-200 md:text-xl">
              {service.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Details Section */}
      <section className="mt-24 space-y-24">
        {/* Info + Image Split */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
        >
          <div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              About the Service
            </h2>
            <p className="mt-6 leading-relaxed text-gray-400">
              {service.details ||
                "This section can describe what the service offers in depth, how it helps clients, and why it stands out."}
            </p>
          </div>

          <div className="relative h-[350px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-xl">
            <Image
              src={service.secondary_image || service.main_image}
              alt={`${service.name} showcase`}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-lg backdrop-blur-sm transition hover:from-white/20"
            >
              <h3 className="text-xl font-semibold text-white">
                {service[`highlight_${i}_title`] || `Feature ${i}`}
              </h3>
              <p className="mt-3 text-sm text-gray-400">
                {service[`highlight_${i}_desc`] ||
                  "Short description of a core feature or benefit related to this service."}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
