import Image from "next/image";

type Props = { className?: string };

const LOGO_SRC = "/BP logo + fav icon.png";

/** Logo inkl. Favicon-Mark (PNG aus `/public`) */
export function LogoPlaceholder({ className = "" }: Props) {
  return (
    <span className={`relative inline-block h-7 w-[7.25rem] shrink-0 sm:h-9 sm:w-[9.2rem] ${className}`}>
      <Image
        src={encodeURI(LOGO_SRC)}
        alt=""
        role="presentation"
        fill
        sizes="(max-width: 640px) 116px, 148px"
        className="object-contain object-left"
        priority
        unoptimized
      />
    </span>
  );
}
