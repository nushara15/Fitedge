
"use client"
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Newspaper, BarChart, Users, Settings, LogOut, Dumbbell, Mail, ShieldCheck, ShoppingCart, Loader2, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from "firebase/auth";
import { app } from '@/lib/firebase';
import { useEffect } from 'react';
import { useFCM } from '@/hooks/use-fcm';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/purchases', label: 'Purchases', icon: ShoppingCart },
    { href: '/admin/messages', label: 'Messages', icon: Mail },
    { href: '/admin/success-stories', label: 'Success Stories', icon: ShieldCheck },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
    { href: '/admin/settings', 'label': 'Settings', 'icon': Settings },
  ];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = getAuth(app);
  const { user, loading } = useAuth();
  const { requestPermission, fcmToken } = useFCM();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [loading, user, router]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/admin/login');
    });
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <Dumbbell className="h-8 w-8 text-primary" />
                <span className="font-bold font-headline text-2xl group-data-[collapsible=icon]:hidden">FitEdge</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild
                  isActive={pathname.startsWith(item.href) && (item.href !== '/admin/dashboard' || pathname === '/admin/dashboard')}
                  tooltip={{
                    children: item.label
                  }}
                  >
                  <Link href={item.href}>
                    <item.icon/>
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                <Avatar className="group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                    <AvatarImage src={user?.photoURL || "https://picsum.photos/100/100"} alt="Admin" data-ai-hint="person portrait" />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold text-sm">{user?.displayName || 'Admin User'}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto group-data-[collapsible=icon]:hidden" onClick={handleLogout}>
                  <LogOut />
                </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold">{menuItems.find(item => pathname.startsWith(item.href) && item.href !=='#')?.label || 'Dashboard'}</h1>
            </div>
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={fcmToken ? 'default' : 'outline'} size="icon" onClick={requestPermission}>
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{fcmToken ? 'Subscribed to notifications' : 'Click to enable notifications'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </header>
        <main className="p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
