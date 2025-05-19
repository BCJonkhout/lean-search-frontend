"use client";

import Link from "next/link";
import SigninWithPassword from "./SigninWithPassword";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Signin() {
  const { t } = useLanguage();
  
  return (
      <>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
                  {t('common.signIn')}
              </h2>
          </div>

          <div>
              <SigninWithPassword/>
          </div>

          <div className="mt-6 text-center">
              <p>
                  {t('auth.noAccount')}{" "}
                  <Link href="/auth/sign-up" className="text-primary">
                      {t('common.signUp')}
                  </Link>
              </p>
          </div>
      </>
  );
}