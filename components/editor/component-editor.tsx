"use client";

import {
  IComponentChildOption,
  IComponentEditorProps,
  IComponentOption,
  IExtendedComponent,
  IExtendedLayout,
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
import { LayoutComponentBase } from "../site/layoutComponent";

export function ComponentEditor({
  currentSelectedComponent,
  setCurrentSelectedComponent,
  currentSelectedLayout,
  setCurrentSelectedLayout,
  formValues,
  setFormValues,
  setDraggableComponents,
  draggableComponents,
  layouts,
  setLayouts,
  colors,
  customColors,
}: IComponentEditorProps) {
  const [options, setOptions] = useState<IComponentOption[]>();
  const [childOptions, setChildOptions] = useState<IComponentChildOption[]>();
  const [isLayout, setIsLayout] = useState(false);

  useEffect(() => {
    if (currentSelectedLayout) {
      setIsLayout(true);
      setOptions(currentSelectedLayout.layout.editOptions);
      setChildOptions(currentSelectedLayout.layout.childOptions);

      if (
        currentSelectedLayout.state &&
        Object.keys(currentSelectedLayout.state).length > 0
      ) {
        setFormValues(currentSelectedLayout.state);
      } else {
        const initialValues: Record<string, any> = {};
        currentSelectedLayout.layout.childOptions?.forEach((child) => {
          child.options.forEach((option) => {
            const key = `${child.parentId}-${option.label}`;
            initialValues[key] = option.default ?? "";
          });
        });
        setFormValues(initialValues);
      }
    } else if (currentSelectedComponent) {
      setIsLayout(false);
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
    }
  }, [currentSelectedComponent, currentSelectedLayout]);

  const handleValueChange = (key: string, value: any) => {
    setFormValues((prev: Record<string, any>) => ({
      ...prev,
      [key]: value,
    }));

    if (isLayout && currentSelectedLayout) {
      // Update layout
      setLayouts((prev: IExtendedLayout[]) =>
        prev.map((layout) => {
          if (layout.instanceId === currentSelectedLayout.instanceId) {
            const LayoutClass = layout.layout
              .constructor as new () => LayoutComponentBase;
            const newLayoutInstance = new LayoutClass();

            const newState = {
              ...layout.state,
              [key]: value,
            };

            newLayoutInstance.applyState(newState);

            return {
              ...layout,
              layout: newLayoutInstance,
              state: newState,
            };
          }
          return layout;
        }),
      );

      // Update current selected layout
      setCurrentSelectedLayout({
        ...currentSelectedLayout,
        state: {
          ...currentSelectedLayout.state,
          [key]: value,
        },
      });
    } else if (currentSelectedComponent) {
      // Update component
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
        }),
      );

      // Also update in layouts
      setLayouts((prev: IExtendedLayout[]) =>
        prev.map((layout) => {
          const updatedComponents = { ...layout.components };
          let componentFound = false;

          Object.keys(updatedComponents).forEach((zoneKey) => {
            updatedComponents[zoneKey] = updatedComponents[zoneKey].map(
              (comp) => {
                if (comp.instanceId === currentSelectedComponent.instanceId) {
                  componentFound = true;
                  const ComponentClass = comp.content.node
                    .constructor as new () => Component;
                  const newNode = new ComponentClass();

                  const newState = {
                    ...comp.state,
                    [key]: value,
                  };

                  newNode.applyState(newState);

                  return {
                    ...comp,
                    content: { node: newNode },
                    state: newState,
                  };
                }
                return comp;
              },
            );
          });

          if (componentFound) {
            return {
              ...layout,
              components: updatedComponents,
            };
          }
          return layout;
        }),
      );
    }
  };

  const handleClose = () => {
    setCurrentSelectedComponent(null);
    setCurrentSelectedLayout(null);
  };

  if (!currentSelectedComponent && !currentSelectedLayout) return null;

  return (
    <div className="flex flex-col gap-3 w-full max-h-full p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium">
          {isLayout ? "Layout Editor" : "Component Editor"}
        </p>
        <Button variant={"ghost"} onClick={handleClose}>
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
                                        parseFloat(e.target.value),
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
                                        e.target.value,
                                      )
                                    }
                                  />
                                )}
                                {option.type === "color" && (
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
                                        {colors && (
                                          <>
                                            <SelectItem
                                              key={i}
                                              value={colors.primary}
                                              className={`bg-${colors.primary}`}
                                            >
                                              Primary
                                            </SelectItem>
                                            <SelectItem
                                              key={i}
                                              value={colors.primaryForeground}
                                              className={`bg-[${colors.primaryForeground}]`}
                                            >
                                              Primary Foreground
                                            </SelectItem>
                                          </>
                                        )}
                                        {customColors &&
                                          customColors.map((opt, i) => (
                                            <SelectItem key={i} value={opt}>
                                              {opt.name}
                                            </SelectItem>
                                          ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  // <ColorPicker
                                  //   value={fieldValue}
                                  //   onChange={(e) =>
                                  //     handleValueChange(fieldKey, e)
                                  //   }
                                  // />
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
