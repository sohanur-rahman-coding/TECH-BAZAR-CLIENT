import { auth } from "@/lib/auth"; 
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = async (req) => {
  try {
    const res = await handler.GET(req);
    if (res.status >= 500) {
      return new Response(JSON.stringify(null), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "better-auth.session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
        },
      });
    }
    return res;
  } catch (error) {
    return new Response(JSON.stringify(null), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": "better-auth.session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
      },
    });
  }
};

export const POST = async (req) => {
  try {
    const res = await handler.POST(req);
    if (res.status >= 500) {
      return new Response(
        JSON.stringify({ error: "Authentication server error. Please try again." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return res;
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error?.message || "Authentication failed" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};