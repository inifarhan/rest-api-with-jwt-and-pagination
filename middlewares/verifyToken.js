import jwt from "jsonwebtoken"

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(" ")[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403)

      req.email = decoded.email
      next()
    })
  } else {
    res.sendStatus(401)
  }
}