// FILE: page.tsx (or wherever you're using it)
import { SignInViews } from '@/app/modules/auth/ui/views/sign-in-views';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async () => {
  const session = await auth.api.getSession({
      headers: await headers(), 
  }); 
  
    if(!!session) {
      redirect('/'); 
    }
  return <SignInViews />;
};

export default page;
