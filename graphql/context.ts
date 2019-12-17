import jwt from "jsonwebtoken";

const authHeaderRegex = /^Bearer (.+)/;

export function decode(token: string) {
  const decoded = jwt.decode(token);
  if (!decoded) {
    return null;
  }
  const data = JSON.parse(decoded.sub);
  const auth = {
    id: data["id"],
    token: token
  };
  return auth;
}

export default function(arg: { ctx: { request } }) {
  const authHeader: string = arg.ctx.request.headers.authorization || "";
  if (!authHeaderRegex.test(authHeader)) {
    return null;
  }
  const token = authHeader.replace(authHeaderRegex, "$1");
  // const _token = Cache.get(token)
  // return _token ? { auth: decode(_token) } : null
  return { auth: decode(token) };
}

export const authorized = ctx => (fn: (auth) => any) => {
  if (!ctx.auth) {
    throw new Error("you must be logged in");
  }
  return fn(ctx.auth);
};

export const withLogout = ctx => (fn: (auto) => any) => {
  if (!ctx.auth) {
    throw new Error("you must be logged in");
  }

  return fn(ctx.auth);
};
