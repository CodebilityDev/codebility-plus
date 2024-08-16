import * as jose from "jose"
import { NextRequest } from "next/server"

interface DecodedPayload {
  id?: string
}

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET),
}

export const isAuthenticated = async (req: NextRequest): Promise<boolean> => {
  const { cookies } = req
  let token = cookies.get("codebility-auth")?.value
  if (token) {
    try {
      const decoded = await jose.jwtVerify(token, jwtConfig.secret)

      if ((decoded.payload as DecodedPayload)?.id) {
        return true
      } else {
        return false
      }
    } catch (err) {
      console.error("isAuthenticated error: ", err)

      return false
    }
  } else {
    return false
  }
}
