import ChatHeader from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-message';
import { MediaRoom } from '@/components/ui/media-room';
import { currentProfile } from '@/lib/current-profile';
import db  from '@/lib/db';
import { RedirectToSignIn } from '@clerk/nextjs';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'

interface ChangIdPageProps{
  params: Promise<{ 
    serverId: string;
    channelId: string;
  }>
}

const ChangIdPage = async ({
  params
}: ChangIdPageProps) => {
  const profile = await currentProfile();

  if(!profile){
    return RedirectToSignIn({})
  }

  const channel = await db.channel.findUnique({
    where: {
      id: (await params).channelId
    }
  })

  const member = await db.member.findFirst({
    where: {
      serverId: (await params).serverId,
      profileId: profile.id
    }
  })

  if(!channel || !member){
    redirect("/")
  }

  return (
    <div
      className='bg-white dark:bg-[#313338] flex flex-col h-full'
    >
      <ChatHeader 
        name={channel.name}
        serverId={channel.serverId}
        type='channel'
      />
      {channel.type === ChannelType.TEXT && (
        <>       
          <ChatMessages 
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl='/api/messages'
            socketUrl='/api/socket/messages'
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput 
            name = {channel.name}
            type='channel'
            apiUrl='/api/socket/messages'
            query={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom 
          chatId={channel.id}
          video={false}
          audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom 
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )}
    </div>
  )
}

export default ChangIdPage