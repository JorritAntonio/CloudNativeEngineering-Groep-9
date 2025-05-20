import { Comment } from "./comment";
import { User } from "./user";

export class Thread{
    private id?: number | undefined;
    private title: string;
    private content: string;
    private creationDate: Date;
    private createdBy: User;
    private comments: Comment[];
    
    constructor(thread: {
        id?: number;
        title: string;
        content: string;
        creationDate: Date;
        createdBy: User;
        comments: Comment[];
    }) {
        this.validate(thread);
        this.id = thread.id;
        this.title = thread.title;
        this.content = thread.content;
        this.creationDate = thread.creationDate;
        this.createdBy = thread.createdBy;
        this.comments = thread.comments;
    }
    validate(thread: {
        id?: number;
        title: string;
        content: string;
        creationDate: Date;
        createdBy: User;
        comments: Comment[];
    }) {
        if (!thread.title?.trim()) {
            throw new Error("Title is required");
        }
        if (!thread.content?.trim()) {
            throw new Error("Content is required");
        }
        if (!thread.creationDate) {
            throw new Error("Creation date is required");
        }
        if (thread.creationDate.getTime() > Date.now()) {
            throw new Error("Invalid date");
        }
        if (!thread.createdBy) {
            throw new Error("User is required");
        }
        if (thread.createdBy.getId() === undefined) {
            throw new Error("Invalid user");
        }
    }
    getId(): number | undefined {
        return this.id;
    }
    getTitle(): string {
        return this.title;
    }
    getContent(): string {
    return this.content;
    }
    getCreationDate(): Date {
        return this.creationDate;
    }
    getCreatedBy(): User {
        return this.createdBy;
    }
    getComments(): Comment[] {
        return this.comments;
    }
}