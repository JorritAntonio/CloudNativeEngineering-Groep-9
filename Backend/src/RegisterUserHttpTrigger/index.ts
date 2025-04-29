import {
  AzureFunction,
  HttpRequest,
  HttpResponse,
  Context,
} from "@azure/functions";
import { UserService } from "../service/user.service";
import { unauthenticatedRouteWrapper } from "../helpers/function-wrapper";

// The registerUser function is used to register a new user.
export async function registerUser(
  req: HttpRequest,
  context: Context,
): Promise<void> {
  await unauthenticatedRouteWrapper(async () => {
    context.log("HTTP trigger function processed a request.");
    // Validate the request body
    if (
      !req.body ||
      !req.body.email ||
      !req.body.password ||
      !req.body.username
    ) {
      throw new Error("Please provide an email and password to register.");
    }

    const { username, email, password } = req.body;

    // Add the new user
    await UserService.getInstance().addUser(username, email, password);

    // Return a successful response
    context.res = {
      status: 201,
      body: { email, username },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context); // Pass both req and context for the wrapper function
}
