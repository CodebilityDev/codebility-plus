import getRandomColor from "@/lib/getRandomColor";

interface ProjectAvatarProps {
  className?: string;
  size?: number;
}

const ProjectAvatar = ({ className = "", size = 40 }: ProjectAvatarProps) => {
  const bgColor = getRandomColor();

  return (
    <div
      className={`${bgColor} flex items-center justify-center rounded-none ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
        alt="Project Avatar"
        width={size}
        height={size}
        className="rounded-none object-cover"
      />
    </div>
  );
};

export default ProjectAvatar;
