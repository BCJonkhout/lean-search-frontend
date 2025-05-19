import Link from "next/link";
import SigninWithPassword from "./SigninWithPassword";

export default function Signin() {
  return (
      <>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
                  Sign In
              </h2>
          </div>

          <div>
              <SigninWithPassword/>
          </div>

          <div className="mt-6 text-center">
              <p>
                  Don’t have any account?{" "}
                  <Link href="/auth/sign-up" className="text-primary">
                      Sign Up
                  </Link>
              </p>
          </div>
      </>
  );
}
