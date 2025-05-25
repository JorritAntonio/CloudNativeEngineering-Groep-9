import {
  AzureFunction,
  HttpRequest,
  HttpResponse,
  Context,
} from "@azure/functions";
import { ThreadService } from "../service/thread.service";
import { unauthenticatedRouteWrapper } from "../helpers/function-wrapper";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  await unauthenticatedRouteWrapper(async () => {
    const body = req.body as Thread;
    if (!body?.title || !body?.content || !body.username) {
      throw new Error("Missing title, content or username");
    }

    const thread = await ThreadService.getInstance().createThread(body.username, body.title, body.content);

    context.res = {
      status: 201,
      body: thread,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
