'use server'
import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";

export const loginGoogle = async () => {
    await signIn("google");

    redirect('/dashboard/home')
}

export const loginGithub = async () => {
    await signIn("github");
    
    redirect('/dashboard/home')
}

export const logout = async () => {
    await signOut();
}