"use client";

import { useState } from "react";

import { Check } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/api/authApi";
import { User } from "next-auth";

const DropdownUserSidebar = ({ user }: { user: User }) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2.5">
        <Avatar>
          <AvatarImage src={`${user?.image}`} alt={user?.name as string} />
          <AvatarFallback className="text-xs">{user.email}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 text-start leading-none">
          <span className="max-w-[17ch] truncate text-sm leading-none font-semibold">
            {user?.name}
          </span>
          <span className="text-muted-foreground max-w-[20ch] truncate text-xs">
            {user.email}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-66">
        <DropdownMenuLabel key={user.id}>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1 text-start leading-none">
              <span className="max-w-[17ch] truncate text-sm leading-none font-semibold">
                {user.name}
              </span>
              <span className="text-muted-foreground max-w-[20ch] truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuItem>
          <button type="submit" className="" onClick={logout}>
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownUserSidebar;
