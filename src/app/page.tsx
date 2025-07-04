// import User from "@/components/User/User";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { DownloadCatalogButton } from "@/components/DownloadCatalogButton/DownloadCatalogButton";
import { SearchCertificateButton } from "@/components/SearchCertificateButton/SearchCertificateButton";

export default async function HomePage() {
  // const session = await getServerSession(authOptions);

  return (
    <>
      <DownloadCatalogButton />

      {/* <h2>Client Session</h2>
      <User />

      <h2>Server Session</h2>
      {JSON.stringify(session)} */}

      {/* <SearchCertificateSection /> */}
      <SearchCertificateButton />
    </>
  );
}