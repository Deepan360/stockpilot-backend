const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);
    console.log("JWT Secret:", process.env.JWT_SECRET);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No Token Provided"
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded User:", decoded);

    req.user = decoded;

    next();

  } catch (error) {

    console.log("JWT Error:", error);

    return res.status(401).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = auth;