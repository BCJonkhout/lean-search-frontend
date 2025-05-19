"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  
  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const handleLanguageChange = (lang: 'en' | 'nl') => {
    setLanguage(lang);
    setDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center rounded-lg border border-stroke p-1.5 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
        aria-label={t('common.language')}
      >
        <Image
          src={`/images/icon/flag-${language}.svg`}
          width={24}
          height={24}
          alt={language === 'en' ? 'English' : 'Nederlands'}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark">
          <ul className="py-1">
            <li>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-2 dark:hover:bg-meta-4 ${
                  language === 'en' ? 'bg-gray-2 dark:bg-meta-4' : ''
                }`}
              >
                <Image
                  src="/images/icon/flag-en.svg"
                  width={20}
                  height={20}
                  alt="English"
                />
                <span>English</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLanguageChange('nl')}
                className={`flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-2 dark:hover:bg-meta-4 ${
                  language === 'nl' ? 'bg-gray-2 dark:bg-meta-4' : ''
                }`}
              >
                <Image
                  src="/images/icon/flag-nl.svg"
                  width={20}
                  height={20}
                  alt="Nederlands"
                />
                <span>Nederlands</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};