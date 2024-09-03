import { home_SectionT } from "@/types/home"

const Section = ({ children, className, id }: home_SectionT) => {
  return (
    <section id={`${id}`} className={`mx-auto py-10 lg:py-20 ${className}`}>
      {children}
    </section>
  )
}

export default Section
