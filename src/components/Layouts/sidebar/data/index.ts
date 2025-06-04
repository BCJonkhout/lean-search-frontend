import {DocumentIcon, PlusIcon, FolderOpenIcon} from "@heroicons/react/24/outline";
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
  labelKey: string;
  items: NavItem[];
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
      }
    ]
  }
];
