"use client";

export function TermsAndConditionContent() {
  const contents = [
    {
      title: "Welcome to Codebility",
      detail: (
        <p>
          These Terms and Conditions govern your use of Codebility&apos;s
          website and services, located at Codebility.tech By accessing this
          website and engaging our services, you agree to comply with and be
          bound by these terms. If you do not agree with any part of these terms
          and conditions, please do not use our services.
        </p>
      ),
    },
    {
      title: "Definition",
      detail: (
        <>
          <p>
            1.1 &quot;Company&quot;, &quot;We&quot;, &quot;Our&quot;, or
            &quot;Us&quot; refers to Codebility.
          </p>
          <p>
            1.2 &quot;Client&quot;, &quot;You&quot;, or &quot;Your&quot; refers
            to the individual or entity using our website and services.
          </p>
          <p>
            1.3 &quot;Services&quot; refers to the website development and
            related services offered by Codebility.
          </p>
          <p>
            1.4 &quot;Developer&quot; refers to any individual employed or
            contracted by Codebility to provide services.
          </p>
        </>
      ),
    },
    {
      title: "Services Provided",
      detail: (
        <>
          <p>
            2.1 We offer comprehensive website development services designed to
            help clients establish and enhance their online presence.
          </p>
          <p>
            2.2 Clients may schedule appointments with our developers for
            various projects, including but not limited to, website design,
            development, and maintenance.
          </p>
        </>
      ),
    },
    {
      title: "Client Obligations",
      detail: (
        <>
          <p>
            3.1 Clients must provide all necessary information and materials
            required for the completion of the project in a timely manner.
          </p>
          <p>
            3.2 Clients are responsible for ensuring the accuracy and
            completeness of all information provided.
          </p>
          <p>
            3.3 Clients must collaborate effectively with our developers and
            provide prompt feedback to facilitate the project&apos;s progress.
          </p>
          <p>
            3.4 Clients agree to honor scheduled appointments or provide at
            least 24 hours&apos; notice for cancellations or rescheduling.
          </p>
        </>
      ),
    },
    {
      title: "Confidentiality",
      detail: (
        <>
          <p>
            4.1 Both parties agree to maintain the confidentiality of any
            proprietary information disclosed during the course of the project.
          </p>
          <p>
            4.2 Confidential information shall not be disclosed to any third
            party without prior written consent from the disclosing party.
          </p>
        </>
      ),
    },
    {
      title: "Termination",
      detail: (
        <>
          <p>
            6.1 Either party may terminate the agreement at any time by
            providing written notice to the other party.
          </p>
          <p>
            6.2 In the event of termination, all materials provided by the
            client will be returned, and any work completed up to the date of
            termination will be delivered to the client.
          </p>
        </>
      ),
    },
    {
      title: "Limitation of Liability",
      detail: (
        <>
          <p>
            7.1 We shall not be liable for any indirect, incidental, special, or
            consequential damages arising from the use of our services.
          </p>
          <p>
            7.2 Our total liability to the client shall be limited to the scope
            of the services provided through scheduled appointments.
          </p>
        </>
      ),
    },
    {
      title: "Dispute Resolution",
      detail: (
        <>
          <p>
            8.1 Any disputes arising from these terms and conditions shall be
            resolved through good faith negotiation between the parties.
          </p>
          <p>
            8.2 If a resolution cannot be reached, the dispute shall be settled
            through binding arbitration in accordance with the rules of
            [Arbitration Organization].
          </p>
        </>
      ),
    },
    {
      title: "Governing Law",
      detail: (
        <>
          <p>
            9.1 These terms and conditions are governed by and construed in
            accordance with the laws of [Your Jurisdiction]
          </p>
          <p>
            9.2 Any legal action or proceeding relating to these terms and
            conditions shall be brought exclusively in the courts of [Your
            Jurisdiction].
          </p>
        </>
      ),
    },
    {
      title: "Intellectual Property",
      detail: (
        <>
          <p>
            5.1 Upon project completion, and subject to any separate written
            agreement, the client will own the intellectual property rights to
            the completed website and any related materials.
          </p>
          <p>
            5.2 We reserve the right to showcase the completed project in our
            portfolio and marketing materials, unless otherwise agreed upon in
            writing.
          </p>
          <p>
            3.3 Clients must collaborate effectively with our developers and
            provide prompt feedback to facilitate the project&apos;s progress.
          </p>
          <p>
            3.4 Clients agree to honor scheduled appointments or provide at
            least 24 hours&apos; notice for cancellations or rescheduling.
          </p>
        </>
      ),
    },
    {
      title: "Changes to Terms and Conditions",
      detail: (
        <>
          <p>
            10.1 We reserve the right to modify these terms and conditions at
            any time.
          </p>
          <p>
            10.2 Any changes will be effective immediately upon posting on our
            website. Continued use of our services following any changes
            constitutes acceptance of the new terms.
          </p>
        </>
      ),
    },
    {
      title: "Contact Information",
      detail: <></>,
    },
  ];

  return (
    <div className="bg-black-800 flex max-h-[540px] flex-col gap-5 overflow-y-auto p-4 text-white">
      <p className="self-end text-xs italic text-[#898989] sm:text-sm">
        Last Updated: May 23, 2024
      </p>
      {contents.map((content, index) => (
        <div key={index} className="flex flex-col gap-[10px]">
          <h2 className="text-sm font-semibold sm:text-base" id={content.title}>
            {index !== 0 ? `${index}.` : ""} {content.title}
          </h2>
          <span className="text-sm text-[#898989] sm:text-base">
            {content.detail}
          </span>
        </div>
      ))}
    </div>
  );
}
