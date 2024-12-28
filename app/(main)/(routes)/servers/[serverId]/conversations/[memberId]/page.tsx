import ChatHeader from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-message'
import { MediaRoom } from '@/components/ui/media-room'
import { getOrCreateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import  db  from '@/lib/db'
import { RedirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

interface MemberIdPageProps{
    params: Promise<{
        memberId: string,
        serverId: string
    }>,
    searchParams: Promise<{
        video ?:boolean
    }>
}

const MemberIdPage = async ({
    params,
    searchParams
}: MemberIdPageProps) => {
    const profile = await currentProfile();

    if(!profile){
        return RedirectToSignIn({})
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: (await params).serverId,
            profileId: profile.id
        },
        include: {
            profile:true
        }
    })

    if(!currentMember){
        return redirect("/")
    }

    const conversation = await getOrCreateConversation(currentMember.id, (await params).memberId)

    if(!conversation){
        return redirect(`/servers/${(await params).serverId}`)
    }

    const {memberOne, memberTwo} = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;


    return (
        <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
            <ChatHeader 
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={(await params).serverId}
                type="conversation"
            />
            {(await searchParams).video && (
                <MediaRoom
                    chatId={conversation.id}
                    video={true}
                    audio={true}
                />
            )}
            {!(await searchParams).video && (
                <>
                    <ChatMessages 
                        member={currentMember}
                        name={currentMember.profile.name}
                        chatId={conversation.id}
                        type='conversation'
                        apiUrl='/api/direct-messages'
                        paramKey='conversationId'
                        paramValue={conversation.id}
                        socketUrl='/api/socket/direct-messages'
                        socketQuery={{
                            conversationId: conversation.id
                        }}
                    />
                    <ChatInput 
                        name={otherMember.profile.name}
                        type='conversation'
                        apiUrl='/api/socket/direct-messages'
                        query={{
                            conversationId: conversation.id
                        }}
                    />
                </>
            )}
        </div>
    )
}

export default MemberIdPage