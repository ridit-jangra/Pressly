"use client";

import {
  IComponentChildOption,
  IComponentEditorProps,
  IComponentOption,
  IExtendedComponent,
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
import { XIcon, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../shadcn/input";
import { Label } from "../shadcn/label";
import { Component } from "../site/component";
import { ScrollArea } from "../shadcn/scroll-area";
import ColorPicker from "../shadcn/color-picker";

export function ComponentEditor({
  currentSelectedComponent,
  setCurrentSelectedComponent,
  formValues,
  setFormValues,
  setDraggableComponents,
}: IComponentEditorProps) {
  if (!currentSelectedComponent) return;

  const [options, setOptions] = useState<IComponentOption[]>();
  const [childOptions, setChildOptions] = useState<IComponentChildOption[]>();

  useEffect(() => {
    if (!currentSelectedComponent) return;

    setOptions(currentSelectedComponent.content.node.editOptions);
    setChildOptions(currentSelectedComponent.content.node.childOptions);

    if (
      currentSelectedComponent.state &&
      Object.keys(currentSelectedComponent.state).length > 0
    ) {
      setFormValues(currentSelectedComponent.state);
    } else {
      const initialValues: Record<string, any> = {};
      currentSelectedComponent.content.node.childOptions?.forEach((child) => {
        child.options.forEach((option) => {
          const key = `${child.parentId}-${option.label}`;
          initialValues[key] = option.default ?? "";
        });
      });
      setFormValues(initialValues);
    }
  }, [currentSelectedComponent]);

  const handleValueChange = (key: string, value: any) => {
    setFormValues((prev: Record<string, any>) => ({
      ...prev,
      [key]: value,
    }));

    setDraggableComponents((prev: IExtendedComponent[]) =>
      prev.map((item) => {
        if (item.instanceId === currentSelectedComponent.instanceId) {
          const ComponentClass = item.content.node
            .constructor as new () => Component;
          const newNode = new ComponentClass();

          const newState = {
            ...item.state,
            [key]: value,
          };

          newNode.applyState(newState);

          return {
            ...item,
            content: { node: newNode },
            state: newState,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full max-h-full p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium">Component Editor</p>
        <Button
          variant={"ghost"}
          onClick={() => setCurrentSelectedComponent(null as any)}
        >
          <XIcon style={{ width: "24px", height: "auto" }} />
        </Button>
      </div>

      <ScrollArea className={"h-[calc(100vh-9.5rem)]"}>
        <div className="flex flex-col gap-3 w-full">
          {options &&
            options.map((v, i) => (
              <Collapsible
                key={i}
                defaultOpen
                className="flex w-full flex-col gap-2"
              >
                <div className="flex items-center">
                  <CollapsibleTrigger>
                    <Button variant="ghost" size="icon">
                      <ChevronsUpDown />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                  <h4 className="text-lg font-medium">{v.label}</h4>
                </div>

                <CollapsibleContent className="flex h-full w-full gap-3 p-2 grid-cols-2">
                  {childOptions &&
                    childOptions
                      .filter((child) => child.parentId === v.id)
                      .map((child, childIndex) => (
                        <div
                          key={childIndex}
                          className="w-full grid grid-cols-2 gap-3"
                        >
                          {child.options.map((option, optIndex) => {
                            const fieldKey = `${child.parentId}-${option.label}`;
                            const fieldValue =
                              formValues[fieldKey] ?? option.default ?? "";

                            return (
                              <div
                                key={optIndex}
                                className="flex flex-col w-full gap-2"
                              >
                                <Label htmlFor={option.label.toLowerCase()}>
                                  {option.label}
                                </Label>
                                {option.type === "select" && (
                                  <Select
                                    value={fieldValue}
                                    onValueChange={(value) => {
                                      option.onChange?.(value);
                                      handleValueChange(fieldKey, value);
                                    }}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue>{fieldValue}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>
                                          {option.label}
                                        </SelectLabel>
                                        {option.options.map((opt, i) => (
                                          <SelectItem key={i} value={opt}>
                                            {opt}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                )}
                                {option.type === "number" && (
                                  <Input
                                    type="number"
                                    min={option.min}
                                    max={option.max}
                                    value={fieldValue}
                                    onChange={(e) =>
                                      handleValueChange(
                                        fieldKey,
                                        e.target.value
                                      )
                                    }
                                  />
                                )}
                                {option.type === "text" && (
                                  <Input
                                    type="text"
                                    value={fieldValue}
                                    onChange={(e) =>
                                      handleValueChange(
                                        fieldKey,
                                        e.target.value
                                      )
                                    }
                                  />
                                )}
                                {option.type === "color" && (
                                  <ColorPicker
                                    value={fieldValue}
                                    onChange={(e) =>
                                      handleValueChange(fieldKey, e)
                                    }
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
