"use client";

import { cn } from "@/lib/utils";

//TODO : Improve mobile version to display the image down the corresponding text instead of at the full bottom

export function TextComponent({
  number,
  title,
  content,
  isOpen,
  loadingWidthPercent,
}: Readonly<{
  number: number;
  title: string;
  content: string;
  isOpen: boolean;
  loadingWidthPercent?: number;
}>) {
  return (
    <div
      className={cn(
        "transform-gpu rounded-lg border transition-all",
        isOpen
        ? "border-neutral-500/10 bg-gradient-to-b from-neutral-200/15 to-neutral-200/5 dark:border-neutral-500/15 dark:from-[#2E3A48]/30 dark:to-[#374151]/15 dark:shadow-[2px_4px_25px_0px_rgba(46,58,72,0.1)_inset]"
        : "scale-90 border-transparent opacity-75",
      )}
    >
      <div className="flex w-full items-center gap-4 p-4">
      <p
        className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[#475569] text-neutral-300"
        )}
        >
        {number}
        </p>

        <h2
  className={cn(
    "text-left text-xl font-medium text-neutral-500 dark:text-[#E5E7EB]" // Slightly lighter gray
  )}
>
  {title}
</h2>

      </div>
      <div
        className={cn(
          "w-full transform-gpu overflow-hidden text-left text-neutral-600 transition-all duration-500 dark:text-[#9CA3AF]", // Softer gray
          isOpen ? " max-h-64" : "max-h-0",
        )}
      >
        <p className="p-4 text-lg">{content}</p>
        <div className="w-full px-4 pb-4">
          <div className="relative h-1 w-full overflow-hidden rounded-full">
            <div
              className={cn("absolute left-0 top-0 h-1 bg-neutral-500")}
              style={{ width: `${loadingWidthPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
