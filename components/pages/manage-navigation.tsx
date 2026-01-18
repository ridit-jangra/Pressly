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
import { ScrollArea } from "../shadcn/scroll-area";
import { Button } from "../shadcn/button";
import { FieldGroup } from "../shadcn/field";
import { Label } from "../shadcn/label";
import { Input } from "../shadcn/input";
import { toast } from "sonner";

export function ManageNavigation() {
  const [navigation, setNavigation] = useState<INavigation>();
  const [pages, setPages] = useState<IPage[]>();
  const [navigationName, setNavigationName] = useState<string>();
  const [isSaveDisable, setIsSaveDisable] = useState<boolean>(true);
  const [newItemTitle, setNewItemTitle] = useState<string>("");
  const [newItemUrl, setNewItemUrl] = useState<string>("");

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

  const handleAddItem = async (e: any) => {
    e.preventDefault();

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
                        <div
                          key={i}
                          className="w-full bg-background rounded-lg py-1 px-3 text-lg"
                        >
                          {v.title}
                        </div>
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
                  <form
                    className="flex flex-col gap-3"
                    onSubmit={handleAddItem}
                  >
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
                                <SelectItem value={v.url}>{v.title}</SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <Button
                        type="submit"
                        className="mt-5"
                        onClick={handleAddItem}
                      >
                        Add Item
                      </Button>
                    </FieldGroup>
                  </form>
                </ScrollArea>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
}
