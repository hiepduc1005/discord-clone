"use client";

import { ElementRef, Fragment, useRef } from "react";
import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import { useChatQuery } from "@/hooks/use-chat-query";

import { ChatWelcome } from "./chat-welcome";
import { ChatItem } from "./chat-item";
import {format} from "date-fns"
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<HTMLDivElement | null>(null) as React.RefObject<HTMLDivElement>;
    const bottomRef = useRef<HTMLDivElement | null>(null) as React.RefObject<HTMLDivElement>;
    
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    })

    useChatSocket({queryKey, addKey, updateKey})

    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0
    })

    if (status === "pending") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
                <p className="text-zinc-500 text-xs dark:text-zinc-400">
                    Loading messages...
                </p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center">
                <ServerCrash className="w-7 h-7 text-zinc-500 my-4" />
                <p className="text-zinc-500 text-xs dark:text-zinc-400">
                    Something went wrong!
                </p>
            </div>
        )
    }
    return (
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage && <ChatWelcome
                type={type}
                name={name}
            />}

            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2  className="h-6 w-6 text-zinc-500 animate-spin my-4"/> )
                        : (
                            <button
                                onClick={() => fetchNextPage()}
                                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
                            >
                                Load previous messages
                            </button>
                        )
                    }
                </div>
            )}

            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, index) => (
                    <Fragment key={index}>
                        {group?.items?.map((message: MessageWithMemberWithProfile) => (
                           <ChatItem 
                                key={message.id}
                                id = {message.id}
                                currentMember={member}
                                fileName={message.fileName}
                                content = {message.content}
                                fileUrl = {message.fileUrl}
                                deleted = {message.deleted}
                                timestamp={format(new Date(message.createdAt) , DATE_FORMAT)}
                                isUpdated = {message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                                member={message.member}
                           />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef}/>
        </div>
    )
}