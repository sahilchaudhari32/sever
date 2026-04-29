function auth(req, res, next) {

    //step 1: extract
    const token = req.headers.authorization;

    //step 2: verify
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    //step 3: validate
    if(token !== "valid_token") {
        return res.status(401).json({ message: "Invalid token." });
    }

    //step 4: authorize
    console.log("User authenticated successfully.");

    next();
}

module.exports = auth;

//auth middleware will be used to check if the user is authenticated or not. It will be used in the routes where we want to protect the routes.