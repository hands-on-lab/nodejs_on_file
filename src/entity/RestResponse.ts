export class RestResponse<T> {

    private statusCode: number;
    private errorMessage: string;
    private result: T;

    private constructor(statusCode: number,  errorMessage?: string, result?: T) {
        this.statusCode = statusCode;
        this.errorMessage = errorMessage;
        this.result = result;
    }

    public static ok<T>(result: T): RestResponse<T> {
        return new RestResponse(200, undefined, result); 
    }

    public static created<T>(result: T): RestResponse<T> {
        return new RestResponse(201, undefined, result); 
    }

    public static notFound(errorMessage: string): RestResponse<void> {
        return new RestResponse(404, errorMessage, undefined); 
    }

    public static badRequest(errorMessage: string): RestResponse<void> {
        return new RestResponse(400, errorMessage, undefined); 
    }

    public static conflict(errorMessage: string): RestResponse<void> {
        return new RestResponse(409, errorMessage, undefined); 
    }

    public static internalServerError(errorMessage: string): RestResponse<void> {
        return new RestResponse(500, errorMessage, undefined); 
    }

    public static notImplemented(errorMessage: string): RestResponse<void> {
        return new RestResponse(501, errorMessage, undefined); 
    }

    public static of<T>(statusCode: number, result: T): RestResponse<T> {
        return new RestResponse(statusCode, undefined, result); 
    }

    public static error(statusCode: number, errorMessage: string): RestResponse<void> {
        return new RestResponse(statusCode, errorMessage, undefined); 
    }
}