"use client";

import { Storage } from "@/lib/storage";
import { INavigation, INavigationItem, IPage } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../shadcn/resizable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../shadcn/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import { ScrollArea } from "../shadcn/scroll-area";
import { Button } from "../shadcn/button";
import { FieldGroup } from "../shadcn/field";
import { Label } from "../shadcn/label";
import { Input } from "../shadcn/input";
import { toast } from "sonner";
import {
  MoreVertical,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";

export function ManageNavigation() {
  const [navigation, setNavigation] = useState<INavigation>();
  const [pages, setPages] = useState<IPage[]>();
  const [navigationName, setNavigationName] = useState<string>();
  const [isSaveDisable, setIsSaveDisable] = useState<boolean>(true);
  const [newItemTitle, setNewItemTitle] = useState<string>("");
  const [newItemUrl, setNewItemUrl] = useState<string>("");
  const [editingItem, setEditingItem] = useState<INavigationItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editUrl, setEditUrl] = useState<string>("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fetchNavigation = async () => {
    const v = (await Storage.getItem(
      "navigation",
      "navigation",
    )) as INavigation;

    if (v) {
      setNavigation(v);
      setNavigationName(v.name);
    } else {
      setNavigation({ items: [], name: "Init Menu" });
      setNavigationName("Init Menu");
    }
  };

  const handleSave = () => {
    const newNavigation: INavigation = {
      ...navigation!,
      name: navigationName!,
    };

    try {
      Storage.setItem("navigation", "navigation", newNavigation);
      toast("Menu saved successfully.");
      setIsSaveDisable(true);
    } catch (err) {
      toast(`Error occured: ${err}`);
    }
  };

  useEffect(() => {
    fetchNavigation();
  }, []);

  useEffect(() => {
    setIsSaveDisable(false);
  }, [navigation, navigationName]);

  const fetchPages = async () => {
    const v = (await Storage.getItem("pages", "pages")) as IPage[] | null;
    if (v && Array.isArray(v)) {
      setPages(v);
    } else {
      setPages([]);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleAddItem = async () => {
    if (!newItemTitle) {
      toast("Enter a title to continue.");
      return;
    }
    if (!newItemUrl) {
      toast("Select a url to continue.");
      return;
    }

    const newItems: INavigationItem[] = [
      ...navigation?.items!,
      { id: Date.now().toString(), title: newItemTitle, url: newItemUrl },
    ];

    const newNavigation: INavigation = {
      name: navigationName!,
      items: newItems,
    };

    try {
      await Storage.setItem("navigation", "navigation", newNavigation);
      setNavigation(newNavigation);
      toast("Item added successfully.");
      setIsSaveDisable(true);
      setNewItemTitle("");
      setNewItemUrl("");
    } catch (err) {
      toast(`Error occured: ${err}`);
    }
  };

  const handleEditItem = (item: INavigationItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditUrl(item.url);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle || !editUrl || !editingItem) return;

    const updatedItems = navigation?.items.map((item) =>
      item.id === editingItem.id
        ? { ...item, title: editTitle, url: editUrl }
        : item,
    );

    const newNavigation: INavigation = {
      name: navigationName!,
      items: updatedItems!,
    };

    try {
      await Storage.setItem("navigation", "navigation", newNavigation);
      setNavigation(newNavigation);
      toast("Item updated successfully.");
      setIsEditDialogOpen(false);
      setEditingItem(null);
      setEditTitle("");
      setEditUrl("");
    } catch (err) {
      toast(`Error occurred: ${err}`);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const updatedItems = navigation?.items.filter((item) => item.id !== itemId);

    const newNavigation: INavigation = {
      name: navigationName!,
      items: updatedItems!,
    };

    try {
      await Storage.setItem("navigation", "navigation", newNavigation);
      setNavigation(newNavigation);
      toast("Item deleted successfully.");
    } catch (err) {
      toast(`Error occurred: ${err}`);
    }
  };

  const handleMoveItem = async (index: number, direction: "up" | "down") => {
    if (!navigation?.items) return;

    const items = [...navigation.items];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= items.length) return;

    [items[index], items[newIndex]] = [items[newIndex], items[index]];

    const newNavigation: INavigation = {
      name: navigationName!,
      items: items,
    };

    try {
      await Storage.setItem("navigation", "navigation", newNavigation);
      setNavigation(newNavigation);
      toast(`Item moved ${direction}.`);
    } catch (err) {
      toast(`Error occurred: ${err}`);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    if (!navigation?.items) return;

    const items = [...navigation.items];
    const draggedItem = items[draggedIndex];

    items.splice(draggedIndex, 1);
    items.splice(dropIndex, 0, draggedItem);

    const newNavigation: INavigation = {
      name: navigationName!,
      items: items,
    };

    try {
      await Storage.setItem("navigation", "navigation", newNavigation);
      setNavigation(newNavigation);
      toast("Item reordered successfully.");
    } catch (err) {
      toast(`Error occurred: ${err}`);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-medium font-mono">Manage Navigation</p>
      </div>
      {navigation && (
        <div className="flex items-center gap-4 h-full rounded-4xl bg-muted py-2 border">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} maxSize={40} minSize={20}>
              <div className="h-full">
                <div className="border-b w-full px-3 py-2">
                  <p className="text-xl font-mono">Items</p>
                </div>
                <ScrollArea className={"h-full"}>
                  <div className="flex flex-col px-4 mt-5 gap-3">
                    {navigation.items.length > 0 ? (
                      navigation.items.map((v, i) => (
                        <ContextMenu key={i}>
                          <ContextMenuTrigger>
                            <div
                              draggable
                              onDragStart={() => handleDragStart(i)}
                              onDragOver={(e) => handleDragOver(e, i)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, i)}
                              onDragEnd={handleDragEnd}
                              className={`flex items-center justify-between w-full bg-background rounded-lg py-1 px-3 text-lg font-mono cursor-move transition-all ${
                                draggedIndex === i ? "opacity-50" : ""
                              } ${
                                dragOverIndex === i && draggedIndex !== i
                                  ? "border-2 border-primary"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                                <div className="flex flex-col">
                                  <span>{v.title}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {v.url}
                                  </span>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-5 w-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className={"w-full"}
                                >
                                  <DropdownMenuItem
                                    onClick={() => handleEditItem(v)}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleMoveItem(i, "up")}
                                    disabled={i === 0}
                                  >
                                    <ArrowUp className="mr-2 h-4 w-4" />
                                    Move Up
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleMoveItem(i, "down")}
                                    disabled={i === navigation.items.length - 1}
                                  >
                                    <ArrowDown className="mr-2 h-4 w-4" />
                                    Move Down
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteItem(v.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </ContextMenuTrigger>
                          <ContextMenuContent>
                            <ContextMenuItem onClick={() => handleEditItem(v)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem
                              onClick={() => handleMoveItem(i, "up")}
                              disabled={i === 0}
                            >
                              <ArrowUp className="mr-2 h-4 w-4" />
                              Move Up
                            </ContextMenuItem>
                            <ContextMenuItem
                              onClick={() => handleMoveItem(i, "down")}
                              disabled={i === navigation.items.length - 1}
                            >
                              <ArrowDown className="mr-2 h-4 w-4" />
                              Move Down
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem
                              onClick={() => handleDeleteItem(v.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      ))
                    ) : (
                      <p className="flex w-full h-full items-center justify-center font-mono text-2xl">
                        No Menu Items
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <div className="h-full px-3">
                <div className="border-b w-full py-2 flex items-center justify-between font-mono">
                  <p className="text-xl">Manage Menu</p>
                  <input
                    type="text"
                    className="my-3 focus:outline-0 text-2xl font-mono"
                    value={navigationName}
                    onChange={(e) => setNavigationName(e.target.value)}
                  />
                  <Button
                    className={"text-lg"}
                    disabled={isSaveDisable}
                    onClick={handleSave}
                  >
                    Save Menu
                  </Button>
                </div>

                <ScrollArea
                  className={
                    "h-full flex flex-col items-center justify-between gap-2 mt-2"
                  }
                >
                  <div className="flex flex-col gap-3">
                    <p className="text-xl">Add Menu Item</p>
                    <FieldGroup className="border p-3 rounded-lg gap-1">
                      <Label className="text-lg">Label</Label>
                      <Input
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        value={newItemTitle}
                        placeholder="e.g: Home"
                      />

                      <Label className="text-lg mt-5">URL</Label>
                      <Select
                        onValueChange={(e: string | null) => setNewItemUrl(e!)}
                        value={newItemUrl}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {pages &&
                              pages.map((v, i) => (
                                <SelectItem key={i} value={v.url}>
                                  {v.title}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <Button className="mt-5" onClick={handleAddItem}>
                        Add Item
                      </Button>
                    </FieldGroup>
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Navigation Item</DialogTitle>
            <DialogDescription>
              Update the title and URL for this navigation item.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g: Home"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Select value={editUrl} onValueChange={(e) => setEditUrl(e!)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {pages &&
                      pages.map((v, i) => (
                        <SelectItem key={i} value={v.url}>
                          {v.title}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
