"use client";

import { Storage } from "@/lib/storage";
import { IColors, ICustomColor } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "../shadcn/button";
import { Label } from "../shadcn/label";
import ColorPicker from "../shadcn/color-picker";
import { toast } from "sonner";
import { ScrollArea } from "../shadcn/scroll-area";
import {
  Check,
  X,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
} from "lucide-react";
import { Input } from "../shadcn/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/dialog";

export function ManageColors() {
  const [colors, setColors] = useState<IColors>({
    background: "#ffffff",
    foreground: "#000000",
    accent: "#3b82f6",
    accentForeground: "#ffffff",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    primary: "#0f172a",
    primaryForeground: "#ffffff",
    secondary: "#f1f5f9",
    secondaryForeground: "#0f172a",
  });
  const [customColors, setCustomColors] = useState<ICustomColor[]>([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [originalColors, setOriginalColors] = useState<IColors | null>(null);
  const [originalCustomColors, setOriginalCustomColors] = useState<
    ICustomColor[]
  >([]);
  const [selectedColor, setSelectedColor] = useState<string | null>("primary");
  const [selectedColorType, setSelectedColorType] = useState<
    "standard" | "custom"
  >("standard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorValue, setNewColorValue] = useState("#000000");
  const [newColorDescription, setNewColorDescription] = useState("");

  const fetchColors = async () => {
    const v = (await Storage.getItem("colors", "colors")) as IColors | null;
    const customColorsData = (await Storage.getItem(
      "custom-colors",
      "custom-colors",
    )) as ICustomColor[] | null;

    if (v) {
      setColors(v);
      setOriginalColors(v);
    } else {
      const defaultColors: IColors = {
        background: "#ffffff",
        foreground: "#000000",
        accent: "#3b82f6",
        accentForeground: "#ffffff",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
        primary: "#0f172a",
        primaryForeground: "#ffffff",
        secondary: "#f1f5f9",
        secondaryForeground: "#0f172a",
      };
      setColors(defaultColors);
      setOriginalColors(defaultColors);
    }

    if (customColorsData && Array.isArray(customColorsData)) {
      setCustomColors(customColorsData);
      setOriginalCustomColors(customColorsData);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  useEffect(() => {
    if (originalColors) {
      const colorsChanged = Object.keys(colors).some(
        (key) =>
          colors[key as keyof IColors] !== originalColors[key as keyof IColors],
      );
      const customColorsChanged =
        JSON.stringify(customColors) !== JSON.stringify(originalCustomColors);
      setIsSaveDisabled(!colorsChanged && !customColorsChanged);
    }
  }, [colors, customColors, originalColors, originalCustomColors]);

  const handleColorChange = (key: keyof IColors, value: string) => {
    setColors((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCustomColorChange = (id: string, value: string) => {
    setCustomColors((prev) =>
      prev.map((color) => (color.id === id ? { ...color, value } : color)),
    );
  };

  const handleAddCustomColor = () => {
    if (!newColorName.trim()) {
      toast.error("Please enter a color name");
      return;
    }

    const newColor: ICustomColor = {
      id: `custom-${Date.now()}`,
      name: newColorName,
      value: newColorValue,
      description: newColorDescription || "Custom color",
    };

    setCustomColors((prev) => [...prev, newColor]);
    setNewColorName("");
    setNewColorValue("#000000");
    setNewColorDescription("");
    setIsAddDialogOpen(false);
    toast.success("Custom color added!");
  };

  const handleDeleteCustomColor = (id: string) => {
    setCustomColors((prev) => prev.filter((color) => color.id !== id));
    if (selectedColor === id) {
      setSelectedColor(null);
    }
    toast.success("Custom color deleted");
  };

  const handleSave = async () => {
    try {
      await Storage.setItem("colors", "colors", colors);
      await Storage.setItem("custom-colors", "custom-colors", customColors);
      setOriginalColors(colors);
      setOriginalCustomColors(customColors);
      setIsSaveDisabled(true);
      toast.success("Colors saved successfully!");
    } catch (err) {
      toast.error(`Error saving colors: ${err}`);
    }
  };

  const handleReset = () => {
    if (originalColors) {
      setColors(originalColors);
      setCustomColors(originalCustomColors);
      toast.info("Colors reset to last saved state");
    }
  };

  const colorFields: {
    key: keyof IColors;
    label: string;
    description: string;
    category: "Background" | "Text" | "Brand" | "UI";
  }[] = [
    {
      key: "primary",
      label: "Primary",
      description: "Primary brand color",
      category: "Brand",
    },
    {
      key: "primaryForeground",
      label: "Primary Foreground",
      description: "Text on primary",
      category: "Text",
    },
    {
      key: "secondary",
      label: "Secondary",
      description: "Secondary brand color",
      category: "Brand",
    },
    {
      key: "secondaryForeground",
      label: "Secondary Foreground",
      description: "Text on secondary",
      category: "Text",
    },
    {
      key: "background",
      label: "Background",
      description: "Default background",
      category: "Background",
    },
    {
      key: "foreground",
      label: "Foreground",
      description: "Default text color",
      category: "Text",
    },
    {
      key: "accent",
      label: "Accent",
      description: "Accent highlights",
      category: "UI",
    },
    {
      key: "accentForeground",
      label: "Accent Foreground",
      description: "Text on accent",
      category: "Text",
    },
    {
      key: "muted",
      label: "Muted",
      description: "Muted background",
      category: "UI",
    },
    {
      key: "mutedForeground",
      label: "Muted Foreground",
      description: "Muted text",
      category: "Text",
    },
  ];

  const filteredStandardColors = colorFields.filter(
    (field) =>
      field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredCustomColors = customColors.filter(
    (color) =>
      color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      color.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Brand":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "Text":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "Background":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "UI":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSelectedColorValue = () => {
    if (selectedColorType === "standard" && selectedColor) {
      return colors[selectedColor as keyof IColors];
    } else if (selectedColorType === "custom" && selectedColor) {
      return (
        customColors.find((c) => c.id === selectedColor)?.value || "#000000"
      );
    }
    return "#000000";
  };

  const getSelectedColorLabel = () => {
    if (selectedColorType === "standard" && selectedColor) {
      return colorFields.find((f) => f.key === selectedColor)?.label || "";
    } else if (selectedColorType === "custom" && selectedColor) {
      return customColors.find((c) => c.id === selectedColor)?.name || "";
    }
    return "";
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div className="border-b bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold font-mono">
                Color Palette
              </h1>
              <p className="text-sm text-muted-foreground">
                {filteredStandardColors.length} standard +{" "}
                {filteredCustomColors.length} custom colors
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isSaveDisabled}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaveDisabled}>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Input
              placeholder="Search colors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-7xl"
            />
            <div className="flex items-center gap-2 ml-auto">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Color
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Color</DialogTitle>
                    <DialogDescription>
                      Create a new custom color for your palette
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="color-name">Color Name</Label>
                      <Input
                        id="color-name"
                        placeholder="e.g., Brand Blue, Success Green"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color-value">Color Value</Label>
                      <div className="flex items-center gap-3">
                        <ColorPicker
                          value={newColorValue}
                          onChange={setNewColorValue}
                        />
                        <code className="text-sm bg-muted px-3 py-2 rounded font-mono">
                          {newColorValue}
                        </code>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color-description">
                        Description (Optional)
                      </Label>
                      <Input
                        id="color-description"
                        placeholder="Brief description of usage"
                        value={newColorDescription}
                        onChange={(e) => setNewColorDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddCustomColor}>Add Color</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-11rem)]">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">Standard Colors</h2>

                <div className="grid grid-cols-[40px_2fr_1fr_1fr_120px_80px] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b">
                  <div></div>
                  <div>NAME</div>
                  <div>CATEGORY</div>
                  <div>VALUE</div>
                  <div>PREVIEW</div>
                </div>

                <div className="mt-2 space-y-1">
                  {filteredStandardColors.map((field) => (
                    <div
                      key={field.key}
                      onClick={() => {
                        setSelectedColor(field.key);
                        setSelectedColorType("standard");
                      }}
                      className={`grid grid-cols-[40px_2fr_1fr_1fr_120px_80px] gap-4 items-center px-4 py-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                        selectedColor === field.key &&
                        selectedColorType === "standard"
                          ? "bg-muted"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div
                          className="w-8 h-8 rounded-md border-2 border-border shadow-sm"
                          style={{ backgroundColor: colors[field.key] }}
                        />
                      </div>

                      <div>
                        <div className="font-medium">{field.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {field.description}
                        </div>
                      </div>

                      <div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getCategoryBadgeColor(
                            field.category,
                          )}`}
                        >
                          {field.category}
                        </span>
                      </div>

                      <div>
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {colors[field.key]}
                        </code>
                      </div>

                      <div>
                        <div
                          className="px-3 py-1.5 rounded text-sm font-medium text-center"
                          style={{
                            backgroundColor: colors[field.key],
                            color: field.key.includes("Foreground")
                              ? colors.background
                              : colors.foreground,
                          }}
                        >
                          Sample
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {customColors.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Custom Colors</h2>
                  <div className="grid grid-cols-[40px_2fr_1fr_1fr_120px_80px] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b">
                    <div></div>
                    <div>NAME</div>
                    <div>TYPE</div>
                    <div>VALUE</div>
                    <div>PREVIEW</div>
                    <div>ACTIONS</div>
                  </div>

                  <div className="mt-2 space-y-1">
                    {filteredCustomColors.map((color) => (
                      <div
                        key={color.id}
                        onClick={() => {
                          setSelectedColor(color.id);
                          setSelectedColorType("custom");
                        }}
                        className={`grid grid-cols-[40px_2fr_1fr_1fr_120px_80px] gap-4 items-center px-4 py-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                          selectedColor === color.id &&
                          selectedColorType === "custom"
                            ? "bg-muted"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <div
                            className="w-8 h-8 rounded-md border-2 border-border shadow-sm"
                            style={{ backgroundColor: color.value }}
                          />
                        </div>

                        <div>
                          <div className="font-medium">{color.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {color.description}
                          </div>
                        </div>

                        <div>
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
                            Custom
                          </span>
                        </div>

                        <div>
                          <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                            {color.value}
                          </code>
                        </div>

                        <div>
                          <div
                            className="px-3 py-1.5 rounded text-sm font-medium text-center"
                            style={{
                              backgroundColor: color.value,
                              color: colors.foreground,
                            }}
                          >
                            Sample
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomColor(color.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {selectedColor && (
          <div className="w-80 border-l bg-card">
            <ScrollArea className="h-[calc(100vh-11rem)]">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Color Details</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedColor(null)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getSelectedColorLabel()}
                  </p>
                </div>

                <div className="p-4 border-b">
                  <div
                    className="w-full h-32 rounded-lg border-2 border-border shadow-sm"
                    style={{ backgroundColor: getSelectedColorValue() }}
                  />
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Color Value
                    </div>
                    <code className="block text-lg font-mono bg-muted px-3 py-2 rounded">
                      {getSelectedColorValue()}
                    </code>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Choose Color
                      </Label>
                      <ColorPicker
                        value={getSelectedColorValue()}
                        onChange={(value) => {
                          if (selectedColorType === "standard") {
                            handleColorChange(
                              selectedColor as keyof IColors,
                              value,
                            );
                          } else {
                            handleCustomColorChange(selectedColor, value);
                          }
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Preview
                      </Label>
                      <div className="space-y-2">
                        <div
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: getSelectedColorValue() }}
                        >
                          <div
                            className="text-sm font-medium"
                            style={{
                              color: colors.foreground,
                            }}
                          >
                            Background Example
                          </div>
                        </div>

                        <button
                          className="w-full px-4 py-2 rounded-lg font-medium transition-colors"
                          style={{
                            backgroundColor: getSelectedColorValue(),
                            color: colors.foreground,
                          }}
                        >
                          Button Example
                        </button>

                        <div className="p-3 border rounded-lg">
                          <div
                            className="text-sm"
                            style={{ color: getSelectedColorValue() }}
                          >
                            Text Example
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Type
                      </Label>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                          selectedColorType === "custom"
                            ? "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
                            : getCategoryBadgeColor(
                                colorFields.find((f) => f.key === selectedColor)
                                  ?.category || "",
                              )
                        }`}
                      >
                        {selectedColorType === "custom"
                          ? "Custom"
                          : colorFields.find((f) => f.key === selectedColor)
                              ?.category}
                      </span>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Description
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedColorType === "standard"
                          ? colorFields.find((f) => f.key === selectedColor)
                              ?.description
                          : customColors.find((c) => c.id === selectedColor)
                              ?.description}
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
