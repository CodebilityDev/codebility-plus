import Section from "@/app/(marketing)/Section"
import { partnerData } from "@/app/(marketing)/ai-integration/components/data"
import PartnerCard from "@/app/(marketing)/ai-integration/components/PartnerCard"

const Partner = () => {
  return (
    <Section className="flex flex-col items-center gap-10 lg:hidden">
      <h2 className="text-center text-4xl font-semibold">Why Partner with Codebility?</h2>
      <div className="grid w-[95%] grid-cols-1 gap-5 md:grid-cols-2">
        {partnerData.map((partner) => (
          <PartnerCard key={partner.id} title={partner.title} description={partner.description} />
        ))}
      </div>
    </Section>
  )
}

export default Partner
