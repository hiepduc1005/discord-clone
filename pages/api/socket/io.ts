import { Server as NetServer } from 'http';
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from 'next';


const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    return res.status(200).json("test api")
};

export default ioHandler;
