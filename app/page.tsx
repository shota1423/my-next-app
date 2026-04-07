import { redirect } from "next/navigation";

export default function Page() {
  // ルートにアクセスしたら `/todo` に即リダイレクトします
  redirect("/todo");
}
