import { useState }      from "react";
import { useRouter }     from "next/router";
import ThreadService from "@/services/ThreadService";

const CreateThreadForm: React.FC = () => {
  const router = useRouter();
  const [title, setTitle]     = useState("");
  const [content, setContent] = useState("");
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        const token = JSON.parse(localStorage.getItem("loggedInUser") as string).token;
        if (!token) throw new Error("Not authenticated");

        const username = JSON.parse(localStorage.getItem("loggedInUser") as string).username;
        if (!username) throw new Error("Username missing");

        const created = await ThreadService.createThread({title, content, username});

        
        
        router.push(`/threads/${created.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="max-w-4xl mx-auto mt-28 p-6 bg-white shadow-lg rounded shadow-gray-400">
        <h1 className="text-2xl font-semibold mb-4">Ask a public question</h1>
        <div className="flex justify-end mb-2">
            <span className="text-xs text-gray-500">
                Required fields <span className="text-red-600">*</span>
            </span>
        </div>
        {error && <p className="mb-4 text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-medium">Title<span className="text-red-600">*</span></label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    className="w-full border px-3 py-2 mt-4 rounded"
                />
            </div>

            <div>
            <label className="block font-medium">Content<span className="text-red-600">*</span></label>
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                rows={6}
                className="w-full border px-3 py-2 mt-4 rounded"
            />
            </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Posting…" : "Post your question"}
        </button>
      </form>
    </div>
    </>
  );
}

export default CreateThreadForm;