import {Message} from '@/models/Message.model'

interface ApiResponse {
    isAcceptingMessages?: boolean;
    message: string;
    success: boolean;
    messages?: Array<Message>
}

export default ApiResponse;