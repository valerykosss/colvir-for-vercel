import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/SignUpForm/SignUpForm";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect("/admin-dashboard");
  }
  
  return (
    <div>
      <SignUpForm />
    </div>
  )
}