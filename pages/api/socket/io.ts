import { Server as NetServer } from 'http';
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from 'next';

// export const config = {
//     api: {
//         bodyParser: false, // Disable body parsing for Socket.io requests
//     },
// };
const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    try {
    //   console.log('Socket.io handler is called'); // Log when the handler is hit

    //     // Kiểm tra xem server có socket.io chưa
    //     if (!res.socket.server.io) {
    //         const path = '/api/socket/io';
    //         console.log(path)
    //         const httpServer: NetServer = res.socket.server as any;
            
    //         // Khởi tạo Socket.io server
    //         const io = new ServerIO(httpServer, {
    //             path: path,
    //             addTrailingSlash: false,
                
    //             transports: ['polling', 'websocket']
    //         });
            
    //         console.log(io)
    //         res.socket.server.io = io; // Gán socket.io vào server

    //         io.on('error', (err) => {
    //             console.log('Socket.IO error:', err.message, err.stack);
    //           });
    //     }

        res.end(); // Kết thúc yêu cầu

    } catch (error) {
        // In lỗi vào console nếu có lỗi xảy ra
        console.log('Error initializing socket.io:', error);
        res.status(500).send({'Internal Server Error':error });
    }
};

export default ioHandler;
