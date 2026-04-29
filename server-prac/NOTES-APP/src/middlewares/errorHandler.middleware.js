function errorHandler(err, req, res, next){
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message : err.message || "Internal Server Error"
    })
}

module.exports = errorHandler;

//errorHandler middleware will be used to handle the errors in the application. It will be used in the app.js file. It will catch the errors and send the response to the client./*  */