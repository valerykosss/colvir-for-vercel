import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
// import { Download } from "lucide-react";


export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if(session?.user) {
        return <h2>Admin dashboard - welcome back {session?.user.login}</h2>
    }
    // console.log(session);

    return <h2>Please login to see this page</h2>
}