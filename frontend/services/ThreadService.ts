import { Thread } from "@/types/types"

const createThread = async (thread: Thread) => {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/thread`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({thread})
        });
        return await res.json();
    } catch (error) {
        console.error('Error creating a user:', error);
    }
} 

 

export default { createThread };