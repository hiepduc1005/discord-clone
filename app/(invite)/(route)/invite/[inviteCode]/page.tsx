import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params:  Promise<{ slug: string
    inviteCode: string;
    }>
}

const InviteCodePage = async ({
  params,
}: InviteCodePageProps) => {
  // Lấy thông tin profile của người dùng
  const profile = await currentProfile();

  // Nếu không có profile, redirect tới trang đăng nhập
  if (!profile) {
    return <RedirectToSignIn />;
  }

  // Nếu inviteCode không tồn tại, redirect về trang chủ
  if (!(await params).inviteCode) {
    return redirect("/");
  }

  // Tìm server có inviteCode và người dùng đã là thành viên
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: (await params).inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // Nếu server đã tồn tại, redirect tới server đó
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  // Cập nhật server, thêm thành viên vào server nếu inviteCode hợp lệ
  const server = await db.server.update({
    where: {
      inviteCode: (await params).inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  // Nếu thành công, redirect tới server vừa cập nhật
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  // Trường hợp không có server nào tìm thấy hoặc cập nhật thất bại
  return <div>InviteCode</div>;
};

export default InviteCodePage;
