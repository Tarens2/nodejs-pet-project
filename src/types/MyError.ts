class MyError extends Error {
    public httpCode: number;
    public verboseCode: string;

    constructor(httpCode, verboseCode, message) {
        super(message);
        this.httpCode = httpCode;
        this.verboseCode = verboseCode;
    }
}

export default MyError;