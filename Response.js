class ApiResponse {
    status;
    // statusCode;
    message = "Something went wrong";
    result = {};

    // setStatusCode(statuscode){
    //     this.statusCode = statuscode;
    // }

    setStatus(status){
        this.status = status;
    }

    setMessage(message){
        this.message = message;
    }

    setResult(body){
        this.result = body;
    }
}

class FunctionResponse{
    error = false;
    message = "Something went wrong";
    result;

    setError(isError){
        this.error = isError;
    }

    setMessage(message){
        this.message = message;
    }

    setResult(body){
        this.result = body;
    }
}

module.exports = {
    ApiResponse,
    FunctionResponse
}