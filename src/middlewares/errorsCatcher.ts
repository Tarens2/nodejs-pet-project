import MyError from '../types/MyError';

export function errorsCatcher(err, req, res, next) {
    if (err) {
        // general error handler

        if (err instanceof MyError) {
            res.status(err.httpCode).json({
                code: err.verboseCode,
                mesage: err.message,
            });
        } else {
            res.status(500).json({
                code: 'INTERNAL_SERVER_ERROR',
                mesage: `Something went wrong: ${err.message}`,
            });
        }
    }
}