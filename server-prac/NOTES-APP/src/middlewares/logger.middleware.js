function logger(req, res, next) {

    const timestamp = new Date();

    console.log(`${timestamp}`)

    next();
}

module.exports = logger;


//logger show the time when the request is made.
