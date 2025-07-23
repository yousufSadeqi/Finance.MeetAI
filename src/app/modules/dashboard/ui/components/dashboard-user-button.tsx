import { GeneratedAvatar } from "@/components/avatar-generator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { ChevronDownIcon, CreditCard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";


export const DashboardUserButton = () => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const isMobile = useIsMobile();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        }
      }
    });
  };

  if (isPending || !data?.user) {
    return null;
  }

  if(isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="w-full rounded-xl border border-border/10 p-3 flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors">
          {data.user.image ? (
          <Avatar className="w-9 h-9">
            <AvatarImage src={data.user.image} alt={data.user.name || "User"} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="initials"
            className="w-9 h-9"
          />
        )}

        {/* Name + Email */}
        <div className="flex flex-col text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-white">{data.user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{data.user.email}</p>
        </div>

        {/* Dropdown Icon */}
        <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold">
              {data.user.name}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">
              {data.user.email}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full border border-border/20 hover:bg-accent/30 transition-colors"
              onClick={() => {}}
              aria-label="Billing"
            >
              <CreditCard className="w-4 h-4 mr-2 text-primary" />
              <span>Billing</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full border border-destructive/30 hover:bg-destructive/10 text-destructive transition-colors"
              onClick={onLogout}
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="w-full rounded-xl border border-border/10 p-3 flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Open user menu"
      >
        {/* Avatar */}
        {data.user.image ? (
          <Avatar className="w-9 h-9">
            <AvatarImage src={data.user.image} alt={data.user.name || "User"} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="initials"
            className="w-9 h-9"
          />
        )}

        {/* Name + Email */}
        <div className="flex flex-col text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-white">{data.user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{data.user.email}</p>
        </div>

        {/* Dropdown Icon */}
        <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="right"
        className="w-72 bg-background border border-border/10 rounded-xl shadow-xl p-2"
      >
        {/* User Info */}
        <DropdownMenuLabel className="pb-2 border-b border-border/10">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold truncate text-primary">{data.user.name}</span>
            <span className="text-xs text-muted-foreground truncate">{data.user.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent/40 gap-2"
          onClick={() => {}}
          aria-label="Billing"
        >
          <span>Billing</span>
          <CreditCard className="w-4 h-4 text-primary" />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive gap-2"
          aria-label="Logout"
        >
          <span>Logout</span>
          <LogOut className="w-4 h-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardUserButton;
