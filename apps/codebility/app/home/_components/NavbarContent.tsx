// Server Component for static navbar content
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/server";

export default async function NavbarContent() {
  // For now, we'll just return the logo part as a server component
  // The rest requires client-side interactivity
  return (
    <div className="flex items-center gap-4">
      <Link 
        href="/" 
        className="flex items-center gap-2"
        prefetch={true}
      >
        <Image
          src="/assets/svgs/codebility-black.svg"
          alt="Codebility Logo"
          width={120}
          height={30}
          className="h-8 w-auto dark:hidden"
          priority
        />
        <Image
          src="/assets/svgs/codebility-white.svg"
          alt="Codebility Logo"
          width={120}
          height={30}
          className="hidden h-8 w-auto dark:block"
          priority
        />
      </Link>
    </div>
  );
}