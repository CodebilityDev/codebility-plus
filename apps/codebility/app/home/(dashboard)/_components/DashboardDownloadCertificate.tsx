"use client";

import type { RefObject } from "react";
import React, { forwardRef } from "react";
import Image from "next/image";
import { CertificateProps } from "@/types/home/codev";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const handleDownload = async (
  certRef: RefObject<HTMLDivElement>,
  name: string,
) => {
  if (!certRef.current) return;

  const canvas = await html2canvas(certRef.current, {
    useCORS: true,
    scale: 2,
    backgroundColor: null,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`${name}.pdf`);
};

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  (props, ref) => {
    const {
      background,
      logo,
      name,
      course,
      date_from,
      date_to,
      description,
      key_projects,
      signature,
      signature_name,
      signature_title,
    } = props;

    return (
      <div
        ref={ref}
        className="relative h-[700px] w-[1000px] overflow-hidden border font-sans text-white shadow-md"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex h-full w-full flex-col justify-between px-40 py-10 text-center">
          <div>
            <img className="mx-auto w-60" src={logo} alt="logo" />
            <h1 className="mt-3 leading-tight">
              <span className="my-5 text-5xl font-bold">CERTIFICATE</span>
            </h1>
            <h1>
              <span className="text-3xl">OF COMPLETION</span>
            </h1>
            <p className="mt-1 text-base">This certifies that</p>
            <h2 className="mt-1 text-3xl font-semibold">
              {name.toUpperCase()}
            </h2>
            <hr className="mx-20 my-3 border-t border-white" />
            <p className="text-sm">
              has successfully completed the <strong>{course}</strong> at
              <b> Codebility </b> from <strong>{date_from}</strong> to{" "}
              <strong>{date_to}</strong>
            </p>

            <p className="mt-2 text-sm leading-relaxed">
              During this period, <b>{name}</b> {description}
            </p>
          </div>

          {/* Projects */}
          <div className="mt-3">
            <h3 className="mb-2 text-base font-semibold">
              Key Projects Completed:
            </h3>
            <ul className="mx-auto grid grid-cols-2 gap-x-8 gap-y-3 px-20 text-left text-sm">
              {key_projects.map((proj, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 leading-relaxed"
                >
                  <span className="mt-[2px] text-base text-white">•</span>
                  <span className="underline">{proj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Signature */}
          <div className="mt-2">
            <div className="relative mx-auto mt-4 w-fit">
              <p className="text-center text-sm">
                {signature_name}
                <br />
                <span className="text-sm" style={{ color: "cyan" }}>
                  {signature_title}
                </span>
              </p>
              <img
                src={signature}
                alt="signature"
                className="pointer-events-none absolute -top-8 left-1/2 w-60 -translate-x-1/2 opacity-90"
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

Certificate.displayName = "Certificate";

export default Certificate;
