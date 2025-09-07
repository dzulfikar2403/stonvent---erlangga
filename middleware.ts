// export { auth as middleware } from "@/auth"
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export const middleware = async(req:NextRequest) => {
    const session = await auth();
    const home = '/';
    const authPage = ['/sign-in']
    const currentPath = req.nextUrl.pathname;
    const email = session?.user?.email;
    
    if(currentPath === home){
        return NextResponse.redirect(new URL('/sign-in',req.url))
    }
    
    if(authPage.includes(currentPath) && email){
        return NextResponse.redirect(new URL('/dashboard/home',req.url))
    }

    if(!authPage.includes(currentPath) && !email){
        return NextResponse.redirect(new URL('/sign-in',req.url))
    }
    
    return NextResponse.next()
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'
    ] 
}