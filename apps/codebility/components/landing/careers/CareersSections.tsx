import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { MetricCard } from "@/components/global/design-system/MetricCard";
import { hiringSteps } from "@/constants/landing/careers/careers-content";
import {
  ArrowRight,
  Building2,
  Globe2,
  MessageSquare,
  Rocket,
  Users,
} from "lucide-react";

export function CareersImpact() {
  const metrics = [
    {
      icon: Globe2,
      value: "7 of 8",
      label: "Remote-first",
      description: "7 of our 8 open roles are fully remote.",
    },
    {
      icon: Building2,
      value: "12",
      label: "Partner companies",
      description:
        "Work directly with teams in Australia, Singapore and beyond.",
    },
    {
      icon: Rocket,
      value: "37",
      label: "Projects shipped",
      description: "Web apps, mobile apps, AI tools and storefronts.",
    },
    {
      icon: Users,
      value: "100+",
      label: "Strong community",
      description:
        "Developers, designers and QA who review and support each other.",
    },
  ];
  return (
    <section className="careers-section careers-impact">
      <div className="careers-container">
        <div className="careers-centered-heading">
          <Eyebrow variant="outline">Why Codebility</Eyebrow>
          <h2>
            Real clients, <span className="cb-accent-text">real impact</span>
          </h2>
          <p>Your work goes live, not into a drawer.</p>
        </div>
        <div className="careers-impact-grid">
          <div
            className="careers-projects"
            aria-label="A selection of products built by Codebility"
          >
            <Image
              src="/assets/images/index/projects-large.jpg"
              alt="Websites and applications built by Codebility, including Tap Up and Zwift Tech"
              width={600}
              height={431}
              sizes="(max-width: 767px) 90vw, 45vw"
              className="careers-project-image"
            />
          </div>
          <div className="careers-metrics">
            {metrics.map(({ icon: Icon, ...metric }) => (
              <MetricCard
                key={metric.label}
                {...metric}
                icon={<Icon />}
                className="careers-metric"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CareersProcess() {
  return (
    <section className="careers-section">
      <div className="careers-container careers-process-grid">
        <div>
          <Eyebrow variant="outline">Hiring process</Eyebrow>
          <h2>
            What happens
            <br />
            after <span className="cb-accent-text">you apply</span>
          </h2>
          <p className="careers-description">
            Four steps, and we keep you updated at each one.
          </p>
          <Button asChild size="sm" className="mt-12">
            <a href="#open-positions">
              See open roles <ArrowRight size={16} />
            </a>
          </Button>
        </div>
        <ol className="careers-timeline">
          {hiringSteps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CareersInvitation() {
  return (
    <section className="careers-section">
      <div className="careers-container">
        <div className="careers-invitation">
          <div>
            <Eyebrow variant="outline">Don’t see your role?</Eyebrow>
            <h2>
              We’re always meeting
              <br />
              <span className="cb-accent-text">great people</span>
            </h2>
            <p className="careers-description">
              Send your CV and we’ll reach out when a role fits your skills.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="sm">
                <a href="mailto:hello@codebility.tech?subject=Career%20opportunities">
                  Send your CV <ArrowRight size={16} />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="#careers-newsletter">Get job alerts</a>
              </Button>
            </div>
          </div>
          <div className="careers-starting-out">
            <span className="careers-icon">
              <MessageSquare size={21} />
            </span>
            <h3>Just starting out?</h3>
            <p>
              Join the CoDev program to build experience on real projects with
              mentors.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/sign-up">
                Be a CoDev <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </div>
        <span id="careers-newsletter" className="scroll-mt-24" />
      </div>
    </section>
  );
}
