export type AuthenticationResponse = {
    token: string;
    username: string;
}

export type User = {
    username?: string;
    email?: string;
    password?: string;
}

export type Thread = {
    id?: number;
    title?: string;
    content?: string;
    username?: string;
    createdBy?: User;
    comments?: Comment[];
}

export type Comment = {
    id?: number;
    content: string;
    creationDate: Date;
    user: User;
    thread: Thread;
}

export type CommentInput = {
    username: string,
    content: string
}