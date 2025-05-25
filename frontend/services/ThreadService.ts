import { Thread } from "@/types/types"

const host =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://cne-groep9-function-app.azurewebsites.net";

const createThread = async (thread: Thread) => {
    console.log(thread)
    try {
        const res = await fetch(host + `/api/threads/create`, {
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
        const res = await fetch(host + `/api/threads`, {
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

const getThreadById = async(threadId: string): Promise<Thread | undefined> => {
    try {
        const res = await fetch(host + `/api/threads/${threadId}`, 
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
        return await res.json();
    } catch (error) {
        console.error("Error fetching thread by id: ", error);
    }
}

export default { createThread, getAllThreads, getThreadById };