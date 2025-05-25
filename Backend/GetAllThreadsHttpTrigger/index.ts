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

    const threads = await ThreadService.getInstance().getAllThreads();

    context.res = {
      status: 201,
      body: threads,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
