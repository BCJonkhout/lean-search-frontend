import {DocumentIcon, PlusIcon, FolderOpenIcon, UsersIcon} from "@heroicons/react/24/outline";
import {SettingsIcon} from "@/components/Layouts/header/user-info/icons";

type NavSubItem = {
  titleKey: string;
  url: string;
  requiredRole?: 'ADMIN' | 'USER';
};

type NavItem = {
  titleKey: string;
  icon: React.ElementType;
  url?: string;
  items: NavSubItem[];
  requiredRole?: 'ADMIN' | 'USER';
};

type NavSection = {
  labelKey: string;
  items: NavItem[];
};


// Helper function to filter navigation items based on user role
export const filterNavItemsByRole = (items: NavItem[], userRole: 'ADMIN' | 'USER' | null): NavItem[] => {
  // If user is not authenticated, don't show any navigation items
  if (!userRole) return [];
  
  return items.filter(item => {
    if (!item.requiredRole) return true; // No role requirement - available to all authenticated users
    return item.requiredRole === userRole || userRole === 'ADMIN'; // ADMIN can access everything
  }).map(item => ({
    ...item,
    items: item.items.filter(subItem => {
      if (!subItem.requiredRole) return true; // No role requirement - available to all authenticated users
      return subItem.requiredRole === userRole || userRole === 'ADMIN';
    })
  }));
};

export const NAV_DATA: NavSection[] = [
  {
    labelKey: "navigation.chat",
    items: [
      {
        titleKey: "common.newChat",
        icon: PlusIcon,
        url: "/chat",
        items: [],
      },
    ]
  },
  {
    labelKey: "navigation.files",
    items: [
      {
        titleKey: "common.newFile",
        icon: DocumentIcon,
        url: "/new-file",
        items: [],
      },
      {
        titleKey: "common.myFiles",
        icon: FolderOpenIcon,
        url: "/files",
        items: [],
      }
    ]
  },
  {
    labelKey: "navigation.others",
    items: [
      {
        titleKey: "common.settings",
        icon: SettingsIcon,
        url: "/settings",
        items: [],
      },
      {
        titleKey: "common.users",
        icon: UsersIcon,
        url: "/admin/users",
        items: [],
        requiredRole: "ADMIN",
      }
    ]
  }
];
