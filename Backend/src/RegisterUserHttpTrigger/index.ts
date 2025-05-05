import {
  AzureFunction,
  HttpRequest,
  HttpResponse,
  Context,
} from "@azure/functions";
import { UserService } from "../service/user.service";
import { unauthenticatedRouteWrapper } from "../helpers/function-wrapper";
const registerUser: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  await unauthenticatedRouteWrapper(async () => {
    context.log("HTTP trigger function processed a request.");
    if (!req.body || !req.body.email || !req.body.password || !req.body.username) {
      throw new Error("Please provide an email and password to register.");
    }

    const { username, email, password } = req.body;

    await UserService.getInstance().addUser(username, email, password);

    context.res = {
      status: 201,
      body: { email, username },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default registerUser;
