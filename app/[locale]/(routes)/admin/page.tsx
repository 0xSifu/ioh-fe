import Link from "next/link";

import { getUser } from "@/actions/get-user";

import { Button } from "@/components/ui/button";
import Container from "../components/ui/Container";

import GptCard from "./_components/GptCard";
import ResendCard from "./_components/ResendCard";
import OpenAiCard from "./_components/OpenAiCard";

const AdminPage = async () => {
  const user = await getUser();
  console.log("TEST : ",user);
  
  return (
    <Container
      title="Administration"
      description={"Here you can setup your SaasHQ instance"}
    >
      <div className="space-x-2">
        <Button asChild>
          <Link href="/admin/users">Users administration</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/modules">Modules administration</Link>
        </Button>
      </div>
      <div className="flex flex-row flex-wrap space-y-2 md:space-y-0 gap-2">
        <GptCard />
        <ResendCard />
        <OpenAiCard />        
      </div>      
    </Container>
  );
};

export default AdminPage;
