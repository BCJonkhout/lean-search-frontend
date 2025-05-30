"use client";

import Signup from "@/components/Auth/Signup";
import {useLanguage} from "@/contexts/LanguageContext";

export default function SignIn() {
  const { t } = useLanguage();

  return (
    <>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <Signup />
            </div>
          </div>

          <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
            <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none min-h-[600px]">
              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                {t('common.signUp')}
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                {t('common.welcome')}
              </h1>

              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                {t('auth.signUpText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
