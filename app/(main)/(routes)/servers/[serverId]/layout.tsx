import { ServerSidebar } from "@/components/servers/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import  db  from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  // Đảm bảo params được truyền đúng
  const { serverId } = await params;

  const profile = await currentProfile();

  if (!profile) {
    return RedirectToSignIn({});
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId, // Truyền trực tiếp từ destructured params
    },
  });

  if (!server) {
    redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex fixed h-full w-60 z-20 flex-col inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
