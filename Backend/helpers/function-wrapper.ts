import { Context, HttpResponse } from "@azure/functions";
import { User } from "../domain/user";
import { UserService } from "../service/user.service";

export enum AuthenticationType {
  Authenticated,
  Unauthenticated,
  Either,
}

export const authenticatedRouteWrapper = async (
  handler: (user: User) => Promise<void>,
  context: Context,
) => {
  try {
    const b64auth =
      (context.req?.headers.authorization || "").split(" ")[1] || "";
    const [email, password] = Buffer.from(b64auth, "base64")
      .toString()
      .split(":");

    if (email && password) {
      const user = await UserService.getInstance().findUserByEmail(email);
      await user.validatePassword(password);
      await handler(user);
    } else {
      throw new Error("Not authenticated.");
    }
  } catch (error) {
    errorHandler(error, context);
  }
};

export const unauthenticatedRouteWrapper = async (
  handler: () => Promise<void>,
  context: Context,
) => {
  try {
    if (context.req?.headers.authorization) {
      throw new Error("Must be unauthenticated to perform this action.");
    }
    await handler();
  } catch (error) {
    errorHandler(error, context);
  }
};

export const openRouteWrapper = async (
  handler: () => Promise<void>,
  context: Context,
) => {
  try {
    await handler();
  } catch (error) {
    errorHandler(error, context);
  }
};

const errorHandler = (error: unknown, context: Context): HttpResponse => {
  context.log.error(error);

  const message = error instanceof Error ? error.message : "Unknown error";

  const response = new Response(JSON.stringify({ message }), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response as unknown as HttpResponse;
};
