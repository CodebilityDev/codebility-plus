import { Suspense } from "react";
import { ThemeProvider } from "@/store/providers/ThemeProvider";
import ReactQueryProvider from "@/hooks/query/reactQuery";
import { UserProvider } from "@/store/UserProvider";
import { getCurrentCodev } from "@/lib/server/current-codev";
import { getSidebarData } from "@/constants/sidebar";
import { Toaster } from "sonner";

import HomeChrome from "./_components/HomeChrome";
import MobileNav from "./_components/MobileNav";
import SurveyWidget, { type Survey } from "./_components/SurveyWidget";
import { getDismissedSurveys, getPendingSurveyForUser } from "@/actions/settings/surveys";
import LeftSidebarServer, {
  getSidebarRoleId,
} from "@/components/shared/dashboard/LeftSidebarServer";
import { SidebarSkeleton } from "@/components/shared/dashboard/SidebarSkeleton";

/**
 * The layout body renders immediately; the user fetch happens in a suspended
 * child.
 *
 * Previously this component awaited `getCurrentCodev()` (two serial Supabase
 * round-trips: auth then codev) before returning any JSX, so nothing streamed
 * until both completed. The fetch now starts on the same tick as the render and
 * the shell paints while it resolves.
 *
 * The user is still resolved on the server and seeded before its consumers
 * render, so nothing regresses to a client-side fetch or a no-user flash.
 * `getCurrentCodev` stays `cache()`d, so the sidebar's own caller shares this
 * one read.
 */
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUserPromise = getCurrentCodev();

  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <Suspense fallback={<HomeShellFallback />}>
          <UserBoundary currentUserPromise={currentUserPromise}>
            {children}
          </UserBoundary>
        </Suspense>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{ className: "dark:bg-gray-800 dark:text-white" }}
        />
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

type CurrentUserPromise = ReturnType<typeof getCurrentCodev>;

/**
 * Awaits the user, then seeds the store before rendering consumers.
 *
 * `UserProvider` seeds during render, so this await is what guarantees `Navbar`
 * (which returns null without a user) has one on its first pass. Sitting inside
 * the parent Suspense boundary means it does not hold back the outer document.
 */
async function UserBoundary({
  currentUserPromise,
  children,
}: {
  currentUserPromise: CurrentUserPromise;
  children: React.ReactNode;
}) {
  const currentUser = await currentUserPromise;

  const sidebarPromise = getSidebarData(getSidebarRoleId(currentUser));

  const surveyPromise = Promise.all([
    getPendingSurveyForUser(),
    getDismissedSurveys(),
  ]);

  return (
    <UserProvider initialUser={currentUser}>
      <HomeChrome
        sidebar={
          <Suspense fallback={<SidebarSkeleton />}>
            <SidebarSlot sidebarPromise={sidebarPromise} />
          </Suspense>
        }
        mobileNav={
          <Suspense fallback={null}>
            <MobileNavSlot sidebarPromise={sidebarPromise} />
          </Suspense>
        }
        survey={
          <Suspense fallback={null}>
            <SurveySlot surveyPromise={surveyPromise} />
          </Suspense>
        }
      >
        {children}
      </HomeChrome>
    </UserProvider>
  );
}

/** Matches the chrome's own background so the swap is not a visible flash. */
function HomeShellFallback() {
  return (
    <div className="background-light850_dark100 flex min-h-screen flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden w-20 flex-shrink-0 bg-gray-100 lg:block dark:bg-gray-800" />
        <main className="flex-1 overflow-y-auto pt-[60px]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-64 items-center justify-center">
              <div className="border-customBlue-500 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

type SidebarPromise = ReturnType<typeof getSidebarData>;

async function SidebarSlot({
  sidebarPromise,
}: {
  sidebarPromise: SidebarPromise;
}) {
  return <LeftSidebarServer sidebarData={await sidebarPromise} />;
}

/**
 * MobileNav is a client component needing resolved links. This server wrapper
 * awaits the shared promise so the layout itself never blocks on it.
 */
async function MobileNavSlot({
  sidebarPromise,
}: {
  sidebarPromise: SidebarPromise;
}) {
  return <MobileNav sidebarData={await sidebarPromise} />;
}

type SurveyPromise = Promise<
  [
    Awaited<ReturnType<typeof getPendingSurveyForUser>>,
    Awaited<ReturnType<typeof getDismissedSurveys>>,
  ]
>;

async function SurveySlot({ surveyPromise }: { surveyPromise: SurveyPromise }) {
  const [pending, dismissed] = await surveyPromise;

  return (
    <SurveyWidget
      pendingSurvey={"data" in pending ? pending.data : null}
      initialDismissed={
        ("data" in dismissed ? (dismissed.data ?? []) : []) as Survey[]
      }
    />
  );
}
