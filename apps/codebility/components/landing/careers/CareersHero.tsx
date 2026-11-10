import Link from "next/link";
import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import {
  BriefcaseBusiness,
  Building2,
  Globe2,
  Rocket,
  Search,
} from "lucide-react";

export function CareersHero() {
  return (
    <section className="careers-hero">
      <div className="careers-container">
        <Eyebrow variant="outline">Careers · Open roles</Eyebrow>
        <h1>
          Work on products
          <br />
          <span className="cb-accent-text">clients actually ship</span>
        </h1>
        <p>
          Paid and contract roles with Codebility and our partner companies.
          Remote-first, with teams across the Philippines and clients worldwide.
        </p>
        <form
          action="/careers#open-positions"
          className="careers-search"
          role="search"
        >
          <label className="careers-search-input">
            <Search size={18} />
            <input
              name="search"
              placeholder="Search roles or skills..."
              aria-label="Search roles or skills"
            />
          </label>
          <label className="careers-search-select">
            <BriefcaseBusiness size={16} />
            <select name="filter" aria-label="Role type">
              <option value="">All types</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </label>
          <label className="careers-search-select">
            <Globe2 size={16} />
            <select name="location" aria-label="Work location">
              <option value="">All locations</option>
              <option value="remote">Remote</option>
              <option value="Philippines">Philippines</option>
            </select>
          </label>
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
        <div className="careers-hero-filters">
          {[
            "All",
            "Full-time",
            "Part-time",
            "Senior",
            "AI & Automation",
            "Mobile",
          ].map((filter) => (
            <Link
              key={filter}
              href={
                filter === "All"
                  ? "/careers#open-positions"
                  : `/careers?filter=${encodeURIComponent(filter)}#open-positions`
              }
            >
              {filter}
            </Link>
          ))}
        </div>
        <div className="careers-hero-stats">
          {[
            {
              icon: Globe2,
              title: "7 of 8 remote",
              text: "work from anywhere",
            },
            {
              icon: Building2,
              title: "12 partner companies",
              text: "real client projects",
            },
            {
              icon: Rocket,
              title: "37 projects shipped",
              text: "web, mobile and AI",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <span className="careers-icon">
                <Icon size={19} />
              </span>
              <p>
                <strong>{title}</strong>
                <small>{text}</small>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
