"use client";

import { EmailIcon, PasswordIcon, UserIcon } from "@/assets/icons";
import React, { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";

export default function SignupWithPassword() {
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            console.log("User registered:", data);
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputGroup
                type="text"
                label="Name"
                className="mb-4 [&_input]:py-[15px]"
                placeholder="Enter your full name"
                name="name"
                handleChange={handleChange}
                value={data.name}
                icon={<UserIcon />}
            />

            <InputGroup
                type="email"
                label="Email"
                className="mb-4 [&_input]:py-[15px]"
                placeholder="Enter your email"
                name="email"
                handleChange={handleChange}
                value={data.email}
                icon={<EmailIcon />}
            />

            <InputGroup
                type="password"
                label="Password"
                className="mb-4 [&_input]:py-[15px]"
                placeholder="Enter your password"
                name="password"
                handleChange={handleChange}
                value={data.password}
                icon={<PasswordIcon />}
            />

            <InputGroup
                type="password"
                label="Retype Password"
                className="mb-5 [&_input]:py-[15px]"
                placeholder="Retype your password"
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
