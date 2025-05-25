import { User } from "./user";
import { Thread } from "./thread";

export class Comment{
    private id?: number 
    private content: string;
    private creationDate: Date;
    private user: User;

    constructor(comment: {
        id?: number;
        content: string;
        creationDate: Date;
        user: User;
    }) {
        this.validate(comment);
        this.id = comment.id;
        this.content = comment.content;
        this.creationDate = comment.creationDate;
        this.user = comment.user;
    }

    validate( comment: {
        id?: number;
        content: string;
        creationDate: Date;
        user: User;
    }) {
        if (!comment.content?.trim()) {
            throw new Error("Content is required");
        }
        if (!comment.creationDate) {
            throw new Error("Creation date is required");
        }
        if (!comment.user) {
            throw new Error("User is required");
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
}