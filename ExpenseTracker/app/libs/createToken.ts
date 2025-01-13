import * as jose from "jose";

const expirationDate = process.env.JWT_EXPIRATION as string;

export default async function createToken(userId: string) {
  const token = new jose.SignJWT({ userId })
    .setExpirationTime(expirationDate)
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  return token;
}
