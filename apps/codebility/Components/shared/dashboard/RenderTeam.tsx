interface RenderTeamProps {
  imgURL: string | React.ReactNode;
}

const RenderTeam: React.FC<RenderTeamProps> = ({ imgURL }) => {
  return (
    <div className="flex items-center gap-2">
      {typeof imgURL === "string" ? (
        <img
          src={imgURL}
          alt="Team Member"
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        imgURL
      )}
    </div>
  );
};

export default RenderTeam;
