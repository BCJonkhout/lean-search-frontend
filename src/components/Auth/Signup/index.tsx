import Link from "next/link";
import React from "react";
import SignupWithPassword from "@/components/Auth/Signup/SignupWithPassword";
import {useLanguage} from "@/contexts/LanguageContext";

export default function Signup() {
    const { t } = useLanguage();

    return (
        <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
                    {t('common.signUp')}
                </h2>
            </div>

            <div>
                <SignupWithPassword />
            </div>

            <div className="mt-6 text-center">
                <p>
                    {t('auth.haveAccount')}{" "}
                    <Link href="/auth/sign-in" className="text-primary">
                        {t('common.signIn')}
                    </Link>
                </p>
            </div>
        </>
    );
}
