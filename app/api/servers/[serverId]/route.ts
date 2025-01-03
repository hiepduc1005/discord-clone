import { currentProfile } from "@/lib/current-profile"
import  db  from "@/lib/db";
import { NextResponse } from "next/server"

export async function PATCH(
    req:Request,
    {params} : {params : Promise<{serverId: string}>}
){
    try {
        const profile = await currentProfile();
        const serverParamId = await (await params).serverId;
        const {name, imageUrl} = await req.json();

        if(!profile){
            return new NextResponse("Unauthorized" , {status: 401})
        }

        const server = await db.server.update({
            where: {
                id: serverParamId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("SERVER ID PATCH", error)
        return new NextResponse("Internal Error" , {status: 500})
    }
}

export async function DELETE(
    req:Request,
    {params} : {params : Promise<{serverId: string}>}
){
    try {
        const profile = await currentProfile();
        const serverParamId = await (await params).serverId;

        if(!profile){
            return new NextResponse("Unauthorized" , {status: 401})
        }

        const server = await db.server.delete({
            where: {
                id: serverParamId,
                profileId: profile.id,
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("SERVER ID DELETE", error)
        return new NextResponse("Internal Error" , {status: 500})
    }
}