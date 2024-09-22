import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, name: user.fullName },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  ); // Shorter expiration
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
