import { IDashboardContentProps } from "@/lib/types";

export function Content({
  currentContent,
  contentMap,
}: IDashboardContentProps) {
  return <div className="h-full w-full p-4">{contentMap[currentContent]}</div>;
}
