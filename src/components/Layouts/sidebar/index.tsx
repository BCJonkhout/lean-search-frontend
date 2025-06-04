"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA, filterNavItemsByRole } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { chatService, Conversation } from "@/services";
import ChatSearchModal from "@/components/ChatSearchModal";

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentConversationId = searchParams.get('id');
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));

    // Uncomment the following line to enable multiple expanded items
    // setExpandedItems((prev) =>
    //   prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    // );
  };

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    NAV_DATA.some((section) => {
      return section.items.some((item) => {
        return item.items.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.titleKey)) {
              toggleExpanded(item.titleKey);
            }

            // Break the loop
            return true;
          }
        });
      });
    });
  }, [expandedItems, pathname]);

  useEffect(() => {
    // Only load conversations if not on an auth page
    if (!pathname.startsWith('/auth/')) {
      loadConversations();
    }
  }, [pathname]);

  useEffect(() => {
    // Listen for new conversation creation
    const handleConversationCreated = () => {
      loadConversations();
    };

    window.addEventListener('conversationCreated', handleConversationCreated);
    
    return () => {
      window.removeEventListener('conversationCreated', handleConversationCreated);
    };
  }, []);

  const loadConversations = async () => {
    try {
      const response = await chatService.getConversations();
      if (response.success && response.data) {
        // Take first 5 conversations (already sorted by recency in backend)
        setConversations(response.data.conversations.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link
              href={"https://symbol.nl/"}
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>

                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {NAV_DATA.map((section) => {
              const filteredItems = filterNavItemsByRole(section.items, user?.role || null);
              
              // Don't render section if no items are visible
              if (filteredItems.length === 0) return null;
              
              return (
                <div key={section.labelKey}>
                  <div className="mb-6">
                    <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                      {t(section.labelKey)}
                    </h2>

                    <nav role="navigation" aria-label={t(section.labelKey)}>
                      <ul className="space-y-2">
                        {filteredItems.map((item) => (
                        <li key={item.titleKey}>
                          {item.items.length ? (
                            <div>
                              <MenuItem
                                isActive={item.items.some(
                                  ({ url }) => url === pathname,
                                )}
                                onClick={() => toggleExpanded(item.titleKey)}
                              >
                                <item.icon
                                  className="size-6 shrink-0"
                                  aria-hidden="true"
                                />

                                <span>{t(item.titleKey)}</span>

                                <ChevronUp
                                  className={cn(
                                    "ml-auto rotate-180 transition-transform duration-200",
                                    expandedItems.includes(item.titleKey) &&
                                      "rotate-0",
                                  )}
                                  aria-hidden="true"
                                />
                              </MenuItem>

                              {expandedItems.includes(item.titleKey) && (
                                <ul
                                  className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                  role="menu"
                                >
                                  {item.items.map((subItem) => (
                                    <li key={subItem.titleKey} role="none">
                                      <MenuItem
                                        as="link"
                                        href={subItem.url}
                                        isActive={pathname === subItem.url}
                                      >
                                        <span>{t(subItem.titleKey)}</span>
                                      </MenuItem>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ) : (
                            <MenuItem
                              className="flex items-center gap-3 py-3"
                              as="link"
                              href={item.url || "#"}
                              isActive={pathname === item.url}
                            >
                              <item.icon
                                className="size-6 shrink-0"
                                aria-hidden="true"
                              />

                              <span>{t(item.titleKey)}</span>
                            </MenuItem>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>

                {/* Add recent conversations after CHAT section */}
                {section.labelKey === "navigation.chat" && (
                  <div className="mb-6">
                    <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                      {t('chats.recentChats')}
                    </h2>
                    <nav role="navigation" aria-label="Recent chats">
                      <ul className="space-y-2">
                        {conversations.slice(0, 5).map((conversation) => (
                          <li key={conversation.id}>
                            <MenuItem
                              as="link"
                              href={`/chat?id=${conversation.id}`}
                              isActive={pathname === `/chat` && currentConversationId === conversation.id}
                              className="flex items-center gap-3 py-2"
                            >
                              <span className="truncate text-sm">
                                {conversation.title || t('chats.noConversations')}
                              </span>
                            </MenuItem>
                          </li>
                        ))}
                        {/* See all chats option */}
                        <li>
                          <MenuItem
                            onClick={() => setShowSearchModal(true)}
                            className="flex items-center gap-3 py-2 text-primary cursor-pointer"
                            isActive={false}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-sm">
                              {t('chats.seeAll')}
                            </span>
                          </MenuItem>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </aside>

      {/* Chat Search Modal */}
      <ChatSearchModal 
        open={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
      />
    </>
  );
}
