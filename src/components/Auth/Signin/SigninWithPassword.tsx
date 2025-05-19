"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import {Alert} from "@/components/ui-elements/alert";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SigninWithPassword() {
  const router = useRouter();
  const { t } = useLanguage();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    // Simulate login and store user info
    window.localStorage.setItem("token", "abc");
    window.localStorage.setItem("name", "John Doe");
    window.localStorage.setItem("email", "john@doe.com");
    window.dispatchEvent(new Event("authChanged"));

    setShowSuccess(true); // show alert

    setTimeout(() => {
      setLoading(false);
      router.push("/new-chat");
    }, 3000);
  };

  return (
      <>
        {showSuccess && (
            <div className="max-w-4xl mx-auto w-full mb-6">
              <Alert
                  variant="success"
                  title={t('common.signIn')}
                  description={t('home.description')}
              />
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputGroup
              type="email"
              label={t('auth.email')}
              className="mb-4 [&_input]:py-[15px]"
              placeholder={t('auth.email')}
              name="email"
              handleChange={handleChange}
              value={data.email}
              icon={<EmailIcon />}
          />

          <InputGroup
              type="password"
              label={t('auth.password')}
              className="mb-5 [&_input]:py-[15px]"
              placeholder={t('auth.password')}
              name="password"
              handleChange={handleChange}
              value={data.password}
              icon={<PasswordIcon />}
          />

          <div className="mb-4.5">
            <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
            >
              {t('common.signIn')}
              {loading && (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
              )}
            </button>
          </div>
        </form>
      </>
  );
}
