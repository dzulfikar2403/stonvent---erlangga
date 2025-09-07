"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ToggleDarkMode from "./ToggleDarkMode";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { items } from "@/constant/data";
import Link from "next/link";
import { Session } from "next-auth";

export function Navbar({session}:{session:Session|null}) {
  const inputRef = useRef<null | HTMLButtonElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const user = session?.user;

  const handleModal = (e: any) => {
    setModalOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleSearch = (e: any) => {
      if (e.ctrlKey && e.key === "k") {
        if (inputRef.current) {
          e.preventDefault();
          inputRef.current.click();
        }
      }
    };

    document.addEventListener("keydown", handleSearch);

    return () => {
      document.removeEventListener("keydown", handleSearch);
    };
  }, []);
  return (
    <>
      <header className="flex py-2 shrink-0 items-center gap-2 border-b ease-linear transition-all ">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Stonvent.</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button ref={inputRef} onClick={handleModal} variant={"outline"}>
              <Search size={22} />
              <p>Ctrl K</p>
            </Button>
            <ToggleDarkMode />
          </div>
        </div>
      </header>
      {modalOpen && (
        <div
          className="absolute inset-0 z-20 bg-black/70"
          onClick={() => setModalOpen(false)}
        >
          <div className="flex min-h-screen justify-center items-center ">
            <Command
              className="rounded-lg border shadow-md w-2/6"
              onClick={(e) => e.stopPropagation()}
            >
              <CommandInput placeholder="Type Page..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Dashboard Route">
                  <div className="space-y-2">

                  {items.map((item, i) => (
                    <CommandItem key={i}>
                      <Link href={item.url} className="flex gap-2 items-center">
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </CommandItem>
                  ))}
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
