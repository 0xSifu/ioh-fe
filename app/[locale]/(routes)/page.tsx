import { Suspense } from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import {
  DollarSignIcon
} from "lucide-react";
import { getDictionary } from "@/dictionaries";
import Container from "./components/ui/Container";
import NotionsBox from "./components/dasboard/notions";
import LoadingBox from "./components/dasboard/loading-box";
import StorageQuota from "./components/dasboard/storage-quota";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getModules } from "@/actions/get-modules";
import { getStorageSize } from "@/actions/documents/get-storage-size";
import { getExpectedRevenue } from "@/actions/crm/opportunity/get-expected-revenue";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const token = session?.user?.accessToken;
  const email = session?.user?.email;
  
  const lang = session?.user?.userLanguage;
  const dict = await getDictionary(lang as "en");

  const modules = await getModules();
  
  const storage = await getStorageSize();
  const revenue = await getExpectedRevenue();
  
  const secondBrainModule = modules.find(
    (module) => module.name === "secondBrain"
  );

  return (
    <Container
      title={dict.DashboardPage.containerTitle}
      description={
        "Welcome to the HIC cockpit,"
      }
    >
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<LoadingBox />}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Claim
              </CardTitle>
              <DollarSignIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">{"0"}</div>
            </CardContent>
          </Card>
        </Suspense>
        <Suspense fallback={<LoadingBox />}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {dict.DashboardPage.expectedRevenue}
              </CardTitle>
              <DollarSignIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">
                {
                  revenue.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              </div>
            </CardContent>
          </Card>
        </Suspense>
        <StorageQuota actual={storage} title={dict.DashboardPage.storage} />
        {secondBrainModule?.enabled && (
          <Suspense fallback={<LoadingBox />}>
            <NotionsBox />
          </Suspense>
        )}
      </div>
    </Container>
  );
};

export default DashboardPage;