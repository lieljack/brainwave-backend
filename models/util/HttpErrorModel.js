class HttpError extends Error {
  constructor(message, code) {
    super(message) // Adds a "message" property
    this.code = code // Adds a "code" property
  }
}

module.exports = HttpError
