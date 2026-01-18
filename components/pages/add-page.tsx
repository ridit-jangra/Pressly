import { IPage } from "@/lib/types";
import { LayoutIcon } from "lucide-react";
import { Button } from "../shadcn/button";
import { Field, FieldGroup, FieldLabel } from "../shadcn/field";
import { Input } from "../shadcn/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Storage } from "@/lib/storage";
import { toast } from "sonner";

export function AddPage() {
  const [title, setTitle] = useState<string>("");
  const router = useRouter();

  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const handleCreatePage = async () => {
    if (!title) {
      toast("Enter a page name to continue.");
      return;
    }

    const now = new Date();

    const newPage: IPage = {
      id: Date.now().toString(),
      title: title,
      head: {
        metadata: {
          description: "New page.",
          keywords: ["page"],
        },
        title: "New Page",
      },
      url: `/${title.replace(" ", "-").toLowerCase()}`,
      body: {
        components: [],
      },
      footer: {
        components: [],
      },
      createdAt: formatDate(now),
      updatedAt: formatDate(now),
    };

    try {
      const existingPages = (await Storage.getItem("pages", "pages")) as
        | IPage[]
        | null;

      const updatedPages = existingPages
        ? [...existingPages, newPage]
        : [newPage];

      await Storage.setItem("pages", "pages", updatedPages);

      toast("Page created successfully!");
      router.push(`edit-page?id=${newPage.id}`);
    } catch (err) {
      toast(`Error creating page: ${err}`);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-[60%] h-[70%] border-2 flex items-center justify-center rounded-4xl px-4">
        <div className="w-[60%] h-full">
          <FieldGroup className="px-4 gap-6 py-10">
            <div className="flex flex-col gap-1 font-mono">
              <h1 className="text-xl font-bold">Create New Page</h1>
              <p className="text-md">Add new page to your website.</p>
            </div>

            <Field>
              <FieldLabel htmlFor="name">Page Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="e.g: About us, Services, Contact"
                className="bg-background"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                required
              />
            </Field>
          </FieldGroup>
        </div>

        <div className="flex flex-col items-center justify-center h-full w-[40%] py-10 px-5 gap-3">
          <span className="text-blue-600 dark:text-blue-300 bg-blue-300 dark:bg-blue-600 h-full w-full flex items-center justify-center rounded-4xl">
            <LayoutIcon style={{ width: "128px", height: "auto" }} />
          </span>
          <Button
            className={"w-full bg-blue-600 dark:bg-blue-400 text-[16px]"}
            onClick={handleCreatePage}
          >
            Create New Page
          </Button>
        </div>
      </div>
    </div>
  );
}
