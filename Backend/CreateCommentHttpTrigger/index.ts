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
    const body = req.body as Comments;
    if (!body?.content || !body.username) {
      throw new Error("Missing content or username");
    }

    const thread = await ThreadService.getInstance().createCommentOnThread(body.username, body.content, req.params.threadId);

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
