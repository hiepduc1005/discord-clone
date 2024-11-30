interface UserIdPageProps{
    params:{
        user: string;
    }
}

const Page = ({params}: UserIdPageProps) => {
    return(
        <div className="">
            User id : {params.user};
        </div>
    )
}

export default Page;