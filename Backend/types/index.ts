type Role = "admin" | "user";
type Level = "Beginner" | "Intermediate" | "Trusted";

type User = {
    id: number,
    username: string,
    email: string,
    password: string,
    creationDate: Date,
    role: Role,
    reputation: Level,
}

type Thread = {
    title: string;
    content: string;
    username: string;
}