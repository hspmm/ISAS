/* 
<summary> Custom Application Error Messages </summary>
*/

class ApplicationError extends Error {
    constructor(message, status) {
        super();
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;

        if (message.Error) {
            this.message = message.Error.Message;
            this.status = message.Status;
        } else {
            this.message = message || 'Something went wrong. Please try again.';
            this.status = status || 500;
        }
        return {
            Error: {
                Type: this.name,
                Message: this.message
            },
            Status: this.status
        };
    }
}

module.exports = {
    ApplicationError: ApplicationError
};