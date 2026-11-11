"use client";

import type { JobListing } from "@/types/global/job-listings";
import type { z } from "zod";
import { useRef, useState } from "react";
import { submitJobApplication } from "@/actions/global/job-application";
import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { TextField } from "@/components/global/design-system/TextField";
import { useCareers } from "@/providers/landing/careers/CareersProvider";
import { applicationSchema } from "@/utils/global/job-application";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Loader2, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";

type ApplicationData = z.infer<typeof applicationSchema>;
const stepFields: (keyof ApplicationData)[][] = [
  [
    "firstName",
    "lastName",
    "email",
    "phone",
    "yearsOfExperience",
    "referredBy",
  ],
  ["linkedIn", "github", "portfolio"],
  ["coverLetter", "experience"],
];
const acceptedExtensions = /\.(pdf|doc|docx)$/i;

export function CareersApplication({ jobs }: { jobs: JobListing[] | null }) {
  const { selectedJob, selectJob } = useCareers();
  const job =
    selectedJob ??
    jobs?.find((item) => /AI|automation/i.test(item.title)) ??
    jobs?.[0];
  const [step, setStep] = useState(0);
  const [resume, setResume] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [message, setMessage] = useState("");
  const [submittedJobId, setSubmittedJobId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const {
    register,
    trigger,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      yearsOfExperience: "",
      referredBy: "",
      linkedIn: "",
      github: "",
      portfolio: "",
      coverLetter: "",
      experience: "",
    },
  });

  const chooseFile = (file?: File) => {
    if (!file) return;
    if (!acceptedExtensions.test(file.name)) {
      setFileError("Choose a PDF, DOC or DOCX file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Your CV must be 5 MB or smaller.");
      return;
    }
    setResume(file);
    setFileError("");
  };

  const submit = async (data: ApplicationData) => {
    if (!job) return;
    setMessage("");
    try {
      const result = await submitJobApplication(job.id, data, resume);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setSubmittedJobId(job.id);
      reset();
      setResume(null);
    } catch {
      setMessage("We couldn’t submit your application. Please try again.");
    }
  };

  const next = async () => {
    if (await trigger(stepFields[step])) setStep((current) => current + 1);
  };

  return (
    <div className="careers-container careers-application-grid">
      <div>
        <Eyebrow variant="outline">Apply</Eyebrow>
        <h2>
          A shorter, <span className="cb-accent-text">clearer</span>
          <br />
          application
        </h2>
        <p className="careers-description">
          Three short steps instead of one long form. The role stays visible the
          whole time.
        </p>
        <div className="careers-role-summary">
          <span className="careers-applying-label">Applying for</span>
          <h3>{job?.title ?? "Your next opportunity"}</h3>
          <p>
            {job
              ? `${job.level} · ${job.type} · ${job.remote ? "Remote" : job.location}`
              : "Choose an open role to start your application."}
          </p>
          <ul>
            {(job?.requirements ?? []).slice(0, 3).map((requirement) => (
              <li key={requirement}>
                <Check size={15} />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
          {jobs && jobs.length > 1 && (
            <label className="careers-role-picker">
              Change role
              <select
                aria-label="Role to apply for"
                value={job?.id ?? ""}
                disabled={isSubmitting}
                onChange={(event) => {
                  const nextJob = jobs.find(
                    (item) => item.id === event.target.value,
                  );
                  if (nextJob) {
                    selectJob(nextJob);
                    setSubmittedJobId(null);
                  }
                }}
              >
                {jobs.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>
      <div className="careers-form-panel">
        {submittedJobId && submittedJobId === job?.id ? (
          <div className="careers-application-success" role="status">
            <span className="careers-icon">
              <Check />
            </span>
            <h3>Application received</h3>
            <p>
              Thank you for applying. Our team will review your application and
              contact you by email about next steps.
            </p>
            <Button
              onClick={() => {
                setSubmittedJobId(null);
                setStep(0);
              }}
            >
              Apply for another role
            </Button>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={(event) => {
              if (step < 2) {
                event.preventDefault();
                void next();
              } else {
                void handleSubmit(submit)(event);
              }
            }}
          >
            <ol
              className="careers-form-steps"
              aria-label="Application progress"
            >
              {["Your details", "Links & CV", "Experience"].map(
                (title, index) => (
                  <li
                    key={title}
                    aria-current={step === index ? "step" : undefined}
                  >
                    <span>
                      {step > index ? <Check size={13} /> : index + 1}
                    </span>
                    {title}
                  </li>
                ),
              )}
            </ol>
            {step === 0 && (
              <div className="careers-form-fields">
                <TextField
                  label="First name"
                  placeholder="Juan"
                  autoComplete="given-name"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                />
                <TextField
                  label="Last name"
                  placeholder="Dela Cruz"
                  autoComplete="family-name"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                />
                <TextField
                  label="Email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  {...register("email")}
                  error={errors.email?.message}
                />
                <TextField
                  label="Phone"
                  type="tel"
                  placeholder="+63 9XX XXX XXXX"
                  autoComplete="tel"
                  {...register("phone")}
                  error={errors.phone?.message}
                />
                <TextField
                  label="Years of experience"
                  type="number"
                  min="0"
                  max="60"
                  placeholder="Select years"
                  {...register("yearsOfExperience")}
                  error={errors.yearsOfExperience?.message}
                />
                <TextField
                  label="Referred by (optional)"
                  placeholder="Name of referrer"
                  {...register("referredBy")}
                />
              </div>
            )}
            {step === 1 && (
              <div className="space-y-5">
                <TextField
                  label="LinkedIn (optional)"
                  type="url"
                  placeholder="https://linkedin.com/in/you"
                  {...register("linkedIn")}
                  error={errors.linkedIn?.message}
                />
                <TextField
                  label="GitHub (optional)"
                  type="url"
                  placeholder="https://github.com/you"
                  {...register("github")}
                  error={errors.github?.message}
                />
                <TextField
                  label="Portfolio (optional)"
                  type="url"
                  placeholder="https://your-work.com"
                  {...register("portfolio")}
                  error={errors.portfolio?.message}
                />
              </div>
            )}
            {step < 2 && (
              <div
                className="careers-upload"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  chooseFile(event.dataTransfer.files[0]);
                }}
              >
                <input
                  ref={fileInput}
                  type="file"
                  id="careers-resume"
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                  aria-label="Upload your CV"
                  onChange={(event) => chooseFile(event.target.files?.[0])}
                />
                <label htmlFor="careers-resume">
                  <Send size={22} />
                  <strong>{resume ? resume.name : "Upload your CV"}</strong>
                  <small>PDF, DOC or DOCX · max 5 MB or drop it here</small>
                </label>
                {resume && (
                  <button
                    type="button"
                    aria-label="Remove CV"
                    onClick={() => {
                      setResume(null);
                      if (fileInput.current) fileInput.current.value = "";
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
            {step === 2 && (
              <div className="space-y-5">
                <label className="careers-textarea-label">
                  Why are you a good fit?
                  <textarea
                    rows={4}
                    placeholder="Tell us what interests you about this role (at least 50 characters)."
                    {...register("coverLetter")}
                    aria-invalid={!!errors.coverLetter}
                  />
                  {errors.coverLetter && (
                    <span className="careers-error">
                      {errors.coverLetter.message}
                    </span>
                  )}
                </label>
                <label className="careers-textarea-label">
                  Relevant experience
                  <textarea
                    rows={4}
                    placeholder="Share a project or experience relevant to this role (at least 20 characters)."
                    {...register("experience")}
                    aria-invalid={!!errors.experience}
                  />
                  {errors.experience && (
                    <span className="careers-error">
                      {errors.experience.message}
                    </span>
                  )}
                </label>
                <p className="careers-description">
                  {resume
                    ? `CV attached: ${resume.name}`
                    : "No CV attached. You can go back to add one."}
                </p>
              </div>
            )}
            {fileError && (
              <p className="careers-error" role="alert">
                {fileError}
              </p>
            )}
            {message && (
              <p className="careers-error" role="alert">
                {message}
              </p>
            )}
            {!job && jobs !== null && (
              <p className="careers-description">
                Applications will open when a role is available.
              </p>
            )}
            <div className="careers-form-footer">
              <span>Step {step + 1} of 3</span>
              <div className="flex gap-3">
                {step > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => setStep((current) => current - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button size="sm" type="submit" disabled={!job || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      {step === 2 ? "Submit application" : "Continue"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
