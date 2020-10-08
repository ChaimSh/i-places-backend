class HttpError extends Error {
    constructor(message, errorCode) {
       super(message) // Add a message property
       this.code = errorCOde //add code propert
    }
}

module.exports = HttpError;