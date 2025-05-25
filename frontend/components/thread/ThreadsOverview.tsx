import ThreadService from "@/services/ThreadService";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

const ThreadsOverview: React.FC = () => {
    const router = useRouter();

    const fetchThreads = async() => {
        return await ThreadService.getAllThreads();
    }

    const {data, isLoading, error} = useSWR("threads", fetchThreads);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">All Questions</h1>
        
        <div className="space-y-4 justify-between">
            <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                    onClick={() => router.push("/threads/create")}
            >
                Create Thread
            </button>
            {isLoading && <p>is Loading</p>}
            {error && <p>{error}</p>}
            {data && data.map((thread, index) => (
            <div
                key={index}
                className="p-4 border border-gray-300 bg-white rounded-md hover:shadow-sm transition-shadow"
            >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="md:mr-4">
                    <a
                    href={`/threads/${thread.id}`}
                    className="text-blue-700 text-lg font-medium hover:text-blue-500"
                    >
                    {thread.title}
                    </a>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {thread.content}
                    </p>
                </div>
                <div className="text-sm text-gray-500 mt-2 md:mt-0 md:ml-4 whitespace-nowrap">
                    asked by <span className="text-gray-800">{thread.createdBy?.username}</span>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default ThreadsOverview;