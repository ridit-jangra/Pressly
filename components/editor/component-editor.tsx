"use client";

import {
  IComponentChildOption,
  IComponentEditorProps,
  IComponentOption,
} from "@/lib/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../shadcn/collapsible";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import { Button } from "../shadcn/button";
import { XIcon, ArrowLeftIcon, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export function ComponentEditor({
  currentSelectedComponent,
  setCurrentSelectedComponent,
}: IComponentEditorProps) {
  const [options, setOptoins] = useState<IComponentOption[]>([
    {
      id: "typography",
      label: "Typography",
    },
  ]);

  const [childOptions, setChildOptions] = useState<IComponentChildOption[]>([
    {
      parentId: "typography",
      options: [
        {
          label: "Font Family",
          default: "sans-serif",
          options: ["sans-serif", "sans", "monospace", "serif"],
          type: "select",
        },
        {
          label: "Font Style",
          default: "Regular",
          options: ["Regular", "Medium", "SemiBold", "Bold", "Black"],
          type: "select",
        },
      ],
    },
  ]);

  const handleGetOptions = (
    option: IComponentOption
  ): IComponentChildOption[] => {
    const filteredOptions = childOptions.filter(
      (v) => v.parentId === option.id
    );

    return filteredOptions;
  };

  return (
    <div className="flex flex-col gap-3 w-full h-full p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium">Component Editor</p>
        <Button
          variant={"ghost"}
          onClick={() => setCurrentSelectedComponent(null as any)}
        >
          <XIcon style={{ width: "24px", height: "auto" }} />
        </Button>
      </div>
      <div className="flex flex-col gap-3 w-full">
        {options.map((v, i) => (
          <Collapsible open={true} className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-1">
              <CollapsibleTrigger>
                <Button variant="ghost" size="icon">
                  <ChevronsUpDown />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
              <h4 className="text-lg font-medium">Components</h4>
            </div>

            <CollapsibleContent className="flex h-full w-full gap-3 p-2 grid-cols-2">
              {handleGetOptions(v).map((v, i) => (
                <div key={i} className="w-full grid grid-cols-2 gap-3">
                  {v.options.map((v, i) => (
                    <div key={i} className="flex flex-col w-full gap-2">
                      <p className="text-left">{v.label}</p>
                      {v.type === "select" && (
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue>{v.default}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{v.label}</SelectLabel>
                              {v.options.map((v, i) => (
                                <SelectItem value={v}>{v}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
