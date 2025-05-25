import { Thread }       from "../domain/thread";
import { UserRepository }   from "../repository/user.db";
import { ThreadRepository } from "../repository/thread.db";


export class ThreadService {
  private static instance: ThreadService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new ThreadService();
    }
    return this.instance;
  }

  private async getUserRepo() {return UserRepository.getInstance();}
  private async getThreadRepo() {return ThreadRepository.getInstance();}

  async getAllThreads(): Promise<Thread[]> {
    return (await this.getThreadRepo()).getAllThreads();
  }

  async getThreadById(threadId: string): Promise<Thread> {
    return (await this.getThreadRepo()).findThreadById(threadId);
  }

  async createThread( username: string, title: string, content: string): Promise<Thread> {
    const user = await (await this.getUserRepo()).findUserByUsername(username);
    if (!user){
        throw new Error("User does not exist!");
    }

    if (!title){
        throw new Error("A thread must have a title!")
    }

    if (!content){
        throw new Error("A thread must have content!")
    }


    const newThread = new Thread({
        title,
        content,
        creationDate: new Date(),
        createdBy: user,
        comments: []
    });
    return (await this.getThreadRepo()).createThread(newThread);
  }
}