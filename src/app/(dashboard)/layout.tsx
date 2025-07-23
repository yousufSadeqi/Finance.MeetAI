import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../modules/dashboard/ui/components/dashboard-sidebar";
import { DashBoardNavbar } from "../modules/dashboard/ui/components/dashboard-navbar";

interface Props {
    children: React.ReactNode;
}

const layout = ({children} : Props) => {
    return ( 
        <SidebarProvider>
            <DashboardSidebar/>
            <main className="flex flex-col h-screen w-screen bg-muted"> 
                <DashBoardNavbar/>
                {children}
            </main> 
        </SidebarProvider>
    );
}
 
export default layout;