import { auth } from "@/lib/auth";
import { HomeView } from "../modules/home/ui/views/home-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { caller } from "@/trpc/server";

const page = async () => {
  // const data = await caller.hello({text: "Antoin server"}); // Example of using TRPC server-side

  const session = await auth.api.getSession({
    headers: await headers(), 
  }); 

  if(!session) {
    redirect('/sign-in'); 
  }
  return ( <HomeView/> );
}
 
export default page;