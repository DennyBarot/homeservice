import jwt from 'jsonwebtoken';

export const isAuthenticated = (async (req, res, next) => {
  const token = req.cookies.token || req.headers["authorization"]?.replace("Bearer ", "");
  console.log("Token received in authenticate middleware:", token); 
  
  if (!token) {
    console.log("No token found in request");
    return res.status(401).json({ errMessage: "Not authorized" });
  }

  let tokenData;
  try {
    tokenData = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verification successful. Token Data:", tokenData);
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).json({ errMessage: "Invalid token" });
  }
  
  req.user = tokenData;
  
  next();
});

export default isAuthenticated;
