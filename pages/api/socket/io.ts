import { Server as NetServer } from 'http';
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from 'next';

export const config = {
    api: {
        bodyParser: false, // Disable body parsing for Socket.io requests
    },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    try {
        // Kiểm tra xem server có socket.io chưa
        if (!res.socket.server.io) {
            const path = '/api/socket/io';
            const httpServer: NetServer = res.socket.server as any;

            // Khởi tạo Socket.io server
            const io = new ServerIO(httpServer, {
                path: path,
                addTrailingSlash: false,
            });

            res.socket.server.io = io; // Gán socket.io vào server
        }

        res.end(); // Kết thúc yêu cầu

    } catch (error) {
        // In lỗi vào console nếu có lỗi xảy ra
        console.error('Error initializing socket.io:', error);
        res.status(500).send('Internal Server Error');
    }
};

export default ioHandler;
