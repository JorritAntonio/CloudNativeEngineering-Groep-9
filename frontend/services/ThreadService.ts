import { Thread } from "@/types/types"

const createThread = async (thread: Thread) => {
    console.log(thread)
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/threads/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(thread)
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating a thread:', error);
    }
}

const getAllThreads = async(): Promise<Thread[] | undefined> => {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/threads`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating a user:', error);
    }
}

export default { createThread, getAllThreads };