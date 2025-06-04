import {DocumentIcon, PlusIcon} from "@heroicons/react/24/outline";
import {SettingsIcon} from "@/components/Layouts/header/user-info/icons";

type NavSubItem = {
  titleKey: string;
  url: string;
};

type NavItem = {
  titleKey: string;
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
        titleKey: "common.newChat",
        icon: PlusIcon,
        url: "/chat",
        items: [],
      },
    ]
  },
  {
    label: "FILES",
    items: [
      {
        titleKey: "common.newFile",
        icon: DocumentIcon,
        url: "/new-file",
        items: [],
      }
    ]
  },
  {
    label: "OTHERS",
    items: [
      {
        titleKey: "common.settings",
        icon: SettingsIcon,
        url: "/settings",
        items: [],
      }
    ]
  }
];
