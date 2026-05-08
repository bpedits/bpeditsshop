type Props = { title: string; children: React.ReactNode };

const box =
  "space-y-4 text-[15px] leading-relaxed text-muted sm:text-[14px] [&_h2]:mt-8 [&_h2]:text-[16px] [&_h2]:font-semibold [&_h2]:text-foreground sm:[&_h2]:mt-10 sm:[&_h2]:text-[15px] [&_h3]:mt-6 [&_h3]:text-[14px] [&_h3]:font-semibold [&_h3]:text-foreground sm:[&_h3]:text-[13px] [&_ul]:list-disc [&_ul]:pl-4 sm:[&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-4 sm:[&_ol]:pl-5 [&_a]:font-medium [&_a]:text-tint [&_a]:underline";

export function LegalProse({ title, children }: Props) {
  return (
    <div className="mx-auto max-w-3xl page-gutter-x py-10 sm:py-14 md:py-16">
      <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-foreground sm:text-[32px] md:text-[40px]">
        {title}
      </h1>
      <div className={`mt-6 sm:mt-8 ${box}`}>{children}</div>
    </div>
  );
}
