export const sendResponse = (statusCode, body) => {
    return {
        statusCode,
        headers : { 'Content-Type': 'application/json' },
        body : body === undefined ? '' : JSON.stringify(body)
    }
}