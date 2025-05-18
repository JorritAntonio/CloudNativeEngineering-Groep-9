export type AuthenticationResponse = {
    token: string,
    username: string
}

export type User = {
    username?: string,
    email?: string,
    password?: string
}