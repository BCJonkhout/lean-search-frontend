"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
    Dropdown,
    DropdownContent,
    DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { Avatar } from "@mui/material";

export function UserInfo() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const refreshUserState = useCallback(() => {
        const token = localStorage.getItem("token");
        const storedName = localStorage.getItem("name");
        const storedEmail = localStorage.getItem("email");

        setIsAuthenticated(!!token);
        setName(storedName);
        setEmail(storedEmail);
    }, []);

    useEffect(() => {
        refreshUserState();

        const handleChange = () => refreshUserState();

        window.addEventListener("storage", handleChange);
        window.addEventListener("authChanged", handleChange);

        return () => {
            window.removeEventListener("storage", handleChange);
            window.removeEventListener("authChanged", handleChange);
        };
    }, [refreshUserState]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        refreshUserState();
        setIsOpen(false);
    };

    const getInitials = (fullName: string | null) => {
        if (!fullName) return "";
        return fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    return (
        <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
            <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
                <span className="sr-only">My Account</span>

                <figure className="flex items-center gap-3">
                    <Avatar
                        sx={{
                            bgcolor: isAuthenticated ? "primary.main" : "primary.light",
                            color: "white",
                            width: 48,
                            height: 48,
                            fontWeight: 600,
                            fontSize: "1rem",
                        }}
                    >
                        {isAuthenticated && name ? (
                            getInitials(name)
                        ) : (
                            <UserIcon className="w-5 h-5 text-white" />
                        )}
                    </Avatar>

                    <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
                        <span>{isAuthenticated ? name : "Login"}</span>
                        <ChevronUpIcon
                            aria-hidden
                            className={cn("rotate-180 transition-transform", isOpen && "rotate-0")}
                            strokeWidth={1.5}
                        />
                    </figcaption>
                </figure>
            </DropdownTrigger>

            <DropdownContent
                className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
                align="end"
            >
                <h2 className="sr-only">User information</h2>

                {isAuthenticated && (
                    <>
                        <figure className="flex items-center gap-2.5 px-5 py-3.5">
                            <Avatar
                                sx={{
                                    bgcolor: "primary.main",
                                    color: "white",
                                    width: 48,
                                    height: 48,
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                }}
                            >
                                {getInitials(name)}
                            </Avatar>

                            <figcaption className="space-y-1 text-base font-medium">
                                <div className="mb-2 leading-none text-dark dark:text-white">
                                    {name}
                                </div>
                                <div className="leading-none text-gray-6">{email}</div>
                            </figcaption>
                        </figure>

                        <hr className="border-[#E8E8E8] dark:border-dark-3" />
                    </>
                )}

                {isAuthenticated ? (
                    <>
                        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
                            <Link
                                href="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
                            >
                                <SettingsIcon />
                                <span className="mr-auto text-base font-medium">Settings</span>
                            </Link>
                        </div>

                        <hr className="border-[#E8E8E8] dark:border-dark-3" />

                        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
                            >
                                <LogOutIcon />
                                <span className="text-base font-medium">Log out</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
                        <Link
                            href="/auth/sign-in"
                            onClick={() => setIsOpen(false)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
                        >
                            <UserIcon />
                            <span className="text-base font-medium">Login</span>
                        </Link>
                    </div>
                )}
            </DropdownContent>
        </Dropdown>
    );
}
