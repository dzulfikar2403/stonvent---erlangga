import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { edgeSql } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET
      }),Github({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET
      })
    ],
    session: {
      strategy: 'jwt'
    },
    callbacks:{
      signIn: async({user,account})=>{
        if(account?.type === 'oauth'){
          const {email,name,image} = user;

          const checkAccExist = await edgeSql`select email from users where email ilike ${email as string}`;
          if(checkAccExist.length === 0){
            await edgeSql`
                      insert into users(nama_user,email,image_url)
                      values(${name as string},${email as string},${image as string})
                      returning *
                      `

          }
          return true
        }else{
          return true
        }
      } 
    }
})