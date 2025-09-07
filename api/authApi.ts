'use server'
import { signIn, signOut } from "@/auth";

export const loginGoogle = async () => {
    await signIn("google",{redirectTo: '/dashboard/home'});
}

export const loginGithub = async () => {
    await signIn("github",{redirectTo: '/dashboard/home'});
}

export const logout = async () => {
    await signOut();
}