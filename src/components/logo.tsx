import Image from "next/image";

export function Logo() {
  return (
      <div className="relative w-[10.847rem] aspect-[3/1]">
          <Image
              src="/images/logo/symbollogo.png"
              fill
              alt="Symbol logo"
              className="object-contain"
          />
      </div>

  );
}
