'use client'

import { Card, CardContent } from "@/components/ui/card";
import { z } from 'zod'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { useRouter } from "next/navigation"; // ✅ Correct for App Router


import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { FaGithub, FaGoogle } from 'react-icons/fa';
import Image from 'next/image';
import { Input } from "@/components/ui/input";


const formSchema = z.object({
  email: z.string().email(), 
  password: z.string().min(1, { message: 'Password is required' }),
});


export const SignInViews = () => {
  const router = useRouter(); 
  const [err, setErr] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '', 
      password: '',
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setErr(null); 
    setPending(true);
    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push('/')
        },
        onError: ({ error }) => {
          setPending(false);
          setErr(error.message)
        },
      },
    )
  }

  const onSocial = (provider: 'github' | 'google') => {
    setErr(null); 
    setPending(true);
    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: '/'
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setPending(false);
          setErr(error.message)
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="p-6 md:p-8"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    Welcome Back
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Log in to your account
                  </p>    
                </div>

                <div className="grid gap-3">
                  <FormField 
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField 
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            <Input  
                              type={showPassword ? 'text' : 'password'}
                              placeholder="**********"
                              autoComplete="current-password"
                              aria-label="Password"
                              {...field}
                              className="pr-10 w-full"
                            />
                            <button
                              type="button"
                              tabIndex={-1}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              className="absolute right-2 text-xs text-muted-foreground focus:outline-none"
                              onClick={() => setShowPassword((v) => !v)}
                            >
                              {showPassword ? 'Hide' : 'Show'}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!err && (
                    <Alert className="bg-destructive/10 border-none">
                        <OctagonAlert className="h-4 w-4 !text-destructive">

                        </OctagonAlert>
                        <AlertTitle>
                            {err}
                        </AlertTitle>
                    </Alert>
                )}
                <Button type='submit' className='w-full flex items-center justify-center gap-2' disabled={pending} aria-busy={pending}>
                  {pending && (
                    <svg className="animate-spin h-4 w-4 mr-2 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  )}
                  Sign in
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or continue with
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        onSocial('google')
                      }}
                      disabled={pending}
                      className="w-full flex items-center justify-center"
                      aria-label="Sign in with Google"
                    >
                      <FaGoogle />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onSocial('github')
                      }}
                      disabled={pending}
                      type="button"
                      className="w-full flex items-center justify-center"
                      aria-label="Sign in with GitHub"
                    >
                      <FaGithub />
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Don&apos;t have an account ? {' '} 
                    <Link href='/sign-up' className="underline underline-offset-4"> 
                        Sign up
                    </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <Image src="/logo.png" alt="FinAI Logo" width={100} height={40} className="h-[40px] w-[100px]" priority />
            <p className="text-2xl font-semibold text-white"> 
              FinAI
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#" tabIndex={0}>Terms of service</a> and <a href="#" tabIndex={0}>privacy policy</a> 
      </div>
    </div>
  );
};
