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
import { OctagonAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { useRouter } from "next/navigation"; // ✅ Correct for App Router

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { FaGithub, FaGoogle } from 'react-icons/fa';


const formSchema = z.object({
  name: z.string().min(1, {message: 'Name is required'}),
  email: z.string().email(), 
  password: z.string().min(1, { message: 'Password is required' }),
  confrimPassword: z.string().min(1, { message: 'Password is required' }),
})
.refine((data) => data.password === data.confrimPassword, {
  message: "passwords don't match",
  path: ['confrimPassword'],
})

export const SignUpViews = () => {
    const router = useRouter(); 
    const [err, setErr] = useState<string | null>(null)
    const [pending, setPending] = useState(false)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '', 
      password: '',
      confrimPassword: '', 
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setErr(null); 
    setPending(true);
    authClient.signUp.email(
        {
            name: data.name,
            email:data.email,
            password: data.password, 
            callbackURL:'/'  
        }, 
        {
            onSuccess: () => {
                setPending(false);
                router.push('/');
            },
            onError: ({error}) => {
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
            onError: ({error}) => {
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
                    Let&apos;s get started
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Create your account     
                  </p>    
                </div>

                <div className="grid gap-3">
                  <FormField 
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input 
                            type='name'
                            placeholder="John Doe"
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
                          <Input 
                            type='password'
                            placeholder="**********"
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
                    name='confrimPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>confrim Password</FormLabel>
                        <FormControl>
                          <Input 
                            type='password'
                            placeholder="**********"
                            {...field}
                          />
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
                <Button type='submit' className='w-full' disabled={pending}>
                    Sign Up
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
                        className="w-full"
                    >
                        <FaGoogle></FaGoogle>
                    </Button>
                    <Button
                        variant="outline"
                        disabled={pending}
                        onClick={() => {
                          onSocial('github')
                        }}
                        type="button"
                        className="w-full"
                    >
                      <FaGithub></FaGithub>

                    </Button>
                </div>
                <div className="text-center text-sm">
                    Don&apos;t have an account ? {' '} 
                    <Link href='/sign-in' className="underline underline-offset-4"> 
                        Sign in
                    </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial from-green-500 to-green-800 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.png" alt="Image" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white"> 
              FinAI
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *[a]:underline *:[a]:underline-offset-4">
                By click continue, you agree to our <a href='#'>Terms of service</a> and <a href='#'>private policy</a> 
      </div>
    </div>
  );
};
