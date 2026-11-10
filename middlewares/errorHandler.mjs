import { sendResponse } from "../responses/index.mjs";

export const errorHandler = () => ({
    onError: async (handler) => {
        const { error } = handler;
        let statusCode = error.statusCode || 500;

        if(statusCode === 415 || statusCode === 422) statusCode = 400;
        
        if (statusCode === 500) console.log(error);
        const meessage = statusCode === 500 ? "Internal server error" : error.message;
        
        handler.response = sendResponse(statusCode, { error : message });
    }
});
