import { currentProfile } from "@/lib/current-profile"
import  db  from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req:Request,
    {params} : {params : Promise<{channelId: string}>}
){

    try {
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);

        const serverId = searchParams.get("serverId")

        if(!profile ){
            return new NextResponse("Unauthorized", {status : 401})
        }

        if(!serverId){
            return new NextResponse("Server Id missing", {status : 400})
        }

        const server = await db.server.update({
            where: {
                id : serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.MODERATOR,MemberRole.ADMIN],
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete:{
                        id: (await params).channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", {status : 500})
    }
}

export async function PATCH(
    req:Request,
    {params} : {params : Promise<{channelId: string}>}
){

    try {
        const profile = await currentProfile();
        const {name,type} = await req.json();
        const {searchParams} = new URL(req.url);

        const serverId = searchParams.get("serverId")

        if(!profile ){
            return new NextResponse("Unauthorized", {status : 401})
        }

        if(!serverId){
            return new NextResponse("Server Id missing", {status : 400})
        }

        if(name === "general"){
            return new NextResponse("Name cannot be 'general'", {status : 400})
        }

        const server = await db.server.update({
            where: {
                id : serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.MODERATOR,MemberRole.ADMIN],
                        }
                    }
                }
            },
            data: {
                channels:{
                    update:{
                        where: {
                            id: (await params).channelId,
                            NOT: {
                                name: 'general'
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", {status : 500})
    }
}