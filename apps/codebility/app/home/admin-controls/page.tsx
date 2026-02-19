import Link from "next/link";
import SettingsCard from "@/app/home/settings/_components/SettingsCard";
import { H1 } from "@/components/shared/dashboard";
import { adminControlsCardData } from "@/constants/settings";
import PageContainer from "../_components/PageContainer";

const AdminControls = () => {
  return (
    <PageContainer maxWidth="xl">
      <H1>Admin Controls</H1>
      <div className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {adminControlsCardData.map((card) => (
          <Link key={card.path} href={card.path}>
            <SettingsCard
              imageName={card.imageName}
              imageAlt={card.imageAlt}
              title={card.title}
              description={card.description}
            />
          </Link>
        ))}
      </div>
    </PageContainer>
  );
};

export default AdminControls;
