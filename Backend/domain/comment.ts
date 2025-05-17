import { User } from "./user";
import { Thread } from "./thread";

export class Comment{
    private id: number 
    private content: string;
    private creationDate: Date;
    private user: User;
    private thread: Thread;

    constructor(comment: {
        id: number;
        content: string;
        creationDate: Date;
        user: User;
        thread: Thread;
    }) {
        this.validate(comment);
        this.id = comment.id;
        this.content = comment.content;
        this.creationDate = comment.creationDate;
        this.user = comment.user;
        this.thread = comment.thread;
    }

    validate( comment: {
        id: number;
        content: string;
        creationDate: Date;
        user: User;
        thread: Thread;
    }) {
        if (!comment.content?.trim()) {
            throw new Error("Content is required");
        }
        if (!comment.creationDate) {
            throw new Error("Creation date is required");
        }
        if (comment.creationDate.getTime() > Date.now()) {
            throw new Error("Invalid date");
        }
        if (!comment.user) {
            throw new Error("User is required");
        }
        if (comment.user.getId() === undefined) {
            throw new Error("Invalid user");
        }
        if (!comment.thread) {
            throw new Error("Thread is required");
        }
        if (comment.thread.getId() === undefined) {
            throw new Error("Invalid thread");
        }
    }

    getId(): number {
        return this.id;
    }


    getContent(): string {
        return this.content;
    }

    getCreationDate(): Date {
        return this.creationDate;
    }

    getUser(): User {
        return this.user;
    }

    getThread(): Thread {
        return this.thread;
    }

    setId(id: number): void {
        this.id = id;
    }

    setContent(content: string): void {
        this.content = content;
    }

    setCreationDate(creationDate: Date): void {
        if (creationDate.getTime() > Date.now()) {
            throw new Error("Invalid date");
        }
        this.creationDate = creationDate;
    }

    setUser(user: User): void {
        if (user.getId() === undefined) {
            throw new Error("Invalid user");
        }
        this.user = user;
    }

    setThread(thread: Thread): void {
        if (thread.getId() === undefined) {
            throw new Error("Invalid thread");
        }
        this.thread = thread;
    }
}