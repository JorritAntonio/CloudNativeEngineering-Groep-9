import {Comment} from "@/types/types"

const getCommentsByThreadId = async (threadId: number): Promise<Comment[] | undefined> => {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/threads/${threadId}/comments`,
            {
                method: "GET",
                headers:{
                    "Content-Type": "application/json",
                }
            }
        );
        return await res.json();
    } catch (error) {
        console.error("Error fetching comments by ThreadId: ", error);
    }
}

export default { getCommentsByThreadId }