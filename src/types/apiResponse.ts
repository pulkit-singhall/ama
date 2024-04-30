class ApiResponse{
    statusCode: number;
    success: boolean;
    message: string;
    data: object;  
    error: any;
    constructor(
        statusCode: number,
        success: boolean,
        message: string,
        data: object,
        error?: any
    ) {
        this.statusCode = statusCode
        this.success = success
        this.message = message
        this.data = data
        this.error = error
    }
}

export default ApiResponse