import { WebOsShell } from "@/components/shell/WebOsShell";
import { getAppScreens } from "@/data/apps";

export default function Home() {
  const apps = getAppScreens();

  return (
    <main className="relative mx-auto h-dvh w-full max-w-md overflow-hidden bg-[#040611] sm:border-x sm:border-white/10">
      <WebOsShell apps={apps} />
    </main>
  );
}
