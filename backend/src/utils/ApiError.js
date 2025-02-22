class ApiError extends Error {
    constructor(res, statusCode = 500, message = 'Something went wrong') {
        super(message)

        this.statusCode = statusCode
        this.message = message
        this.success = false
        if(res) {
            return res.status(statusCode).json({statusCode, message, success :this.success})
        } 
    }
}

export default ApiError