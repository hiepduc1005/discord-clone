import { InitialModal } from '@/components/modals/initital-modal';
import  db  from '@/lib/db';
import { inititalProfile } from '@/lib/inital-profile'
import { RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

const SetupPage = async () => {
    const profile = await inititalProfile();
    if (!profile) {
        return RedirectToSignIn({});
    }

    const server = await db.server.findFirst({
        where:{
          members:{
            some: {
                profileId: profile?.id
            }
          }
        }
    })

    if(server){
        return redirect(`/servers/${server.id}`);
    }
  return (
    <InitialModal/>
  )
}

export default SetupPage