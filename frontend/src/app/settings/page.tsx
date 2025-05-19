import type { Metadata } from "next";
import { PersonalInfoForm } from "./_components/personal-info";

export const metadata: Metadata = {
  title: "Settings Page",
};

export default function SettingsPage() {
  return (
      <div className="mx-auto w-full max-w-[1080px]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
                  Settings
              </h2>
          </div>

              <div className="col-span-5 xl:col-span-3">
                  <PersonalInfoForm/>
              </div>
      </div>
  );
};

