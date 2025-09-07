import { loginGithub, loginGoogle } from '@/api/authApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const page = () => {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <Button type='submit' variant='outline' className='w-full' onClick={loginGoogle}>
          Continue with Google
        </Button>
        <Button type='submit' className='w-full' onClick={loginGithub}>
          Continue with Github
        </Button>
      </CardContent>
      <CardFooter className='flex-col gap-2'>
        <div className='mx-auto w-1/2 h-0.5 bg-white' />
        <div className='mt-4 text-center text-sm'>
          Don&apos;t have an account?{' '}
          <a href='#' className='underline underline-offset-4'>
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}

export default page
