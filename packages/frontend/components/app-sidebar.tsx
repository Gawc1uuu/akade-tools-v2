'use client';

import { CarIcon, FileText, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // Dodano import Link
import { usePathname } from 'next/navigation';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { Session } from '@/lib/types';

import Logo from '../public/akade-logo.png';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Samochody',
      url: '/cars',
      icon: CarIcon,
      roles: ['ADMIN', 'USER'],
    },
    {
      title: 'Pracownicy',
      url: '/staff',
      icon: Users,
      roles: ['ADMIN'],
    },
    {
      title: 'Faktury',
      url: '/invoices',
      icon: FileText,
      roles: ['ADMIN', 'USER'],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> & { session: Session }) {
  const pathname = usePathname();
  const userRole = props.session.role;

  // Filtrujemy nawigację na podstawie roli użytkownika
  const filteredNavMain = data.navMain.filter((item) => {
    if (item.roles && !item.roles.includes(userRole)) {
      return false;
    }
    return true;
  });

  const dynamicNavMain = filteredNavMain.map((item) => ({
    ...item,
    isActive: pathname.startsWith(item.url),
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* Dodano Link wokół logo */}
        <Link href="/">
          <div className="relative h-16 w-full overflow-hidden rounded-md cursor-pointer">
            <Image src={Logo} alt="Logo" fill className="object-fill" />
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dynamicNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
