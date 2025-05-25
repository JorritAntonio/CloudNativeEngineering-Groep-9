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

    const threadId = req.params.threadId;

    const thread = await ThreadService.getInstance().getThreadById(threadId);

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
