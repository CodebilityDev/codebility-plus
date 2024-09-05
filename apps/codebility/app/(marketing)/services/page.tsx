import Footer from "../_components/marketing-footer"
import Hero from "./_components/services-hero"
import Navigation from "../_components/marketing-navigation"
import { PoppinFont } from "../_lib/font"
import Calendly from "../_components/marketing-calendly"
import ServicesTab from "./_components/services-tab"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"

export default async function ServicesPage() {
  const supabase = getSupabaseServerComponentClient();
  const { data } = await supabase.from("service")
  .select();

  const services = data || [];
  return (
    <div
      className={`relative flex w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303] ${PoppinFont.className}`}
    >
      <Navigation />
      <Hero />

      <ServicesTab servicesData={services}/>
      <Calendly />
      <Footer />
    </div>
  )
}

