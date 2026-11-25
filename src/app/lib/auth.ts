
import { SignJWT, jwtVerify } from "jose";

const getSecretKey = () => {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is missing from environment variables");
  }

  return new TextEncoder().encode(secret);
};

export async function createSession(username: string) {
  return await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (typeof payload.username !== "string") {
      return null;
    }

    return { username: payload.username };
  } catch {
    return null;
  }
}
