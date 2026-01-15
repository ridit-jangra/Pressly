import { IDashboardContentProps } from "@/lib/types";

export function Content({
  setCurrentContent,
  currentContent,
}: IDashboardContentProps) {
  return <div className="h-full w-full">{currentContent}</div>;
}
