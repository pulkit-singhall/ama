class TokenResponse{
    status: number
    success: boolean
    message: string
    email: string
    access: string
    refresh: string
    constructor(
        status : number,
        success: boolean,
        message: string,
        email: string,
        access: string,
        refresh: string,
    ) {
        this.status = status
        this.success = success
        this.message = message
        this.email = email
        this.access = access
        this.refresh = refresh
    }
}

export default TokenResponse