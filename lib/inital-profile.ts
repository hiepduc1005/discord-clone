import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser} from "@clerk/nextjs/server";
import  db  from "./db";

export const inititalProfile = async (): Promise<{
    id: string;
    userId: string;
    name: string;
    imageUrl: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
} | null> => {
    const user = await currentUser();

    if(!user){
        return null;
    }

    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    });

    if(profile){
        return profile;
    }

    const newProfile = await db.profile.create({
        data:{
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    })

    return newProfile;
}