"use client";

import { EmailIcon, PasswordIcon, UserIcon } from "@/assets/icons";
import React, { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import {useLanguage} from "@/contexts/LanguageContext";

export default function SignupWithPassword() {
    const { t } = useLanguage();

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setError(""); // clear error on input change
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const { authService } = await import('@/services');
            
            // Parse full name into first_name and surname
            const nameParts = data.name.trim().split(' ');
            const first_name = nameParts[0] || '';
            const surname = nameParts.slice(1).join(' ') || '';

            if (!first_name) {
                setError("Please enter your full name");
                setLoading(false);
                return;
            }

            const response = await authService.register({
                first_name,
                surname,
                email: data.email,
                password: data.password,
            });

            if (response.success && response.data) {
                authService.storeAuthData(response.data);
                // Redirect to new chat or dashboard
                window.location.href = '/new-chat';
            }
        } catch (error: any) {
            setLoading(false);
            console.error('Registration error:', error);
            setError(error.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputGroup
                type="text"
                label={t('auth.name')}
                className="mb-4 [&_input]:py-[15px]"
                placeholder={t('auth.name')}
                name="name"
                handleChange={handleChange}
                value={data.name}
                icon={<UserIcon />}
            />

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
                className="mb-4 [&_input]:py-[15px]"
                placeholder={t('auth.password')}
                name="password"
                handleChange={handleChange}
                value={data.password}
                icon={<PasswordIcon />}
            />

            <InputGroup
                type="password"
                label={t('auth.confirmPassword')}
                className="mb-5 [&_input]:py-[15px]"
                placeholder={t('auth.confirmPassword')}
                name="confirmPassword"
                handleChange={handleChange}
                value={data.confirmPassword}
                icon={<PasswordIcon />}
            />

            {error && <p className="mb-4 text-red text-sm">{error}</p>}

            <div className="mb-4.5">
                <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
                >
                    Sign Up
                    {loading && (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
                    )}
                </button>
            </div>
        </form>
    );
}
