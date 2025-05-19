import Link from "next/link";
import React from "react";
import SignupWithPassword from "@/components/Auth/Signup/SignupWithPassword";

export default function Signup() {
    return (
        <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
                    Sign Up
                </h2>
            </div>

            <div>
                <SignupWithPassword />
            </div>

            <div className="mt-6 text-center">
                <p>
                    Already have an account?{" "}
                    <Link href="/auth/sign-in" className="text-primary">
                        Sign In
                    </Link>
                </p>
            </div>
        </>
    );
}
