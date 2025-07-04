// import { LoginForm } from "@/components/LoginForm/LoginForm";

// export default function LoginPage() {
//   return (
//     <div>
//       <LoginForm />
//     </div>
//   )
// }

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/admin-dashboard");
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
}