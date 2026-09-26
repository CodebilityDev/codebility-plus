const PartnerCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/5 p-5 lg:w-96">
      <h3 className="text-xl font-semibold text-customViolet-200">{title}</h3>
      <p className="text-base font-normal">{description}</p>
    </div>
  );
};

export default PartnerCard;
