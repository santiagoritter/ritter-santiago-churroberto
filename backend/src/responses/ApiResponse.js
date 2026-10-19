class ApiResponse {
    static success(res, data, statusCode = 200) {
        return res.status(statusCode).json({ success: true, data });
    }

    static created(res, data) {
        return ApiResponse.success(res, data, 201);
    }

    static error(res, message, statusCode = 500) {
        return res.status(statusCode).json({ success: false, message });
    }
}

export default ApiResponse;
