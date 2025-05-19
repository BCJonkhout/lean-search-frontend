import {DocumentIcon, PlusIcon} from "@heroicons/react/24/outline";
import {SettingsIcon} from "@/components/Layouts/header/user-info/icons";

type NavSubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  icon: React.ElementType;
  url?: string;
  items: NavSubItem[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};


export const NAV_DATA: NavSection[] = [
  {
    label: "CHAT",
    items: [
      {
        title: "New Chat",
        icon: PlusIcon,
        items: [],
      },
    ]
  },
  {
    label: "FILES",
    items: [
      {
        title: "New File",
        icon: DocumentIcon,
        items: [],
      }
    ]
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Settings",
        icon: SettingsIcon,
        items: [],
      }
    ]
  }
];
