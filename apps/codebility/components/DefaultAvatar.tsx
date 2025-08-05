import getRandomColor from "@/lib/getRandomColor";

interface DefaultAvatarProps {
  className?: string;
  size?: number;
}

const DefaultAvatar = ({ className = "", size = 40 }: DefaultAvatarProps) => {
  /* const bgColor = getRandomColor(); */

  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
        alt="Default Avatar"
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    </div>
  );
};

export default DefaultAvatar;
