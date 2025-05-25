import React, { FormEvent, useEffect, useState } from 'react';
import { Thread, Comment } from '@/types/types';
import ThreadService from '@/services/ThreadService';

type Props = {
  thread: Thread | undefined;
};

const SingleThreadOverview: React.FC<Props> = ({ thread }: Props) => {
  const [comment, setComment] = useState<string>('')
  const [listOfComments, setListOfComments] = useState<Comment[]>([]);

  if (!thread) return (
    <div className="max-w-3xl mx-auto mt-12 p-6 text-center text-red-500">
      Thread not found!
    </div>
  );

  useEffect(() => {
    setListOfComments(thread.comments ? thread.comments.reverse() : []);
  }, [thread])

  const postComment = async(event: FormEvent) => {
    event.preventDefault();

    if (!comment || comment.trim().length < 1) {
      return;
    }

    if (!thread || !thread.id) {
      return;
    }

    const newThread = await ThreadService.addCommentToThread({
      username: JSON.parse(localStorage.getItem("loggedInUser") as string).username,
      content: comment
    }, thread.id)

    setListOfComments(comments => [newThread.comments.at(-1), ...comments])

    setComment('');
  } 

  return (
    <div className="max-w-3xl mx-auto mt-24 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{thread.title}</h2>
        <div className="flex items-center text-sm text-gray-500">
          <span>
            asked by{' '}
            <span className="text-blue-600 hover:underline">{thread.createdBy?.username}</span>
          </span>
        </div>
      </div>

      <div className="px-6 py-5 prose prose-lg">
        {thread.content}
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        <form className="flex items-center gap-2 mb-4" onSubmit={(e) => postComment(e)}>
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="bg-orange-500 px-4 py-2  transition-colors border-orange-500 text-white rounded hover:bg-orange-600"
          >
            Post
          </button>
        </form>
        {listOfComments && listOfComments.length > 0 ? (
          <ul className="space-y-4">
            {listOfComments.map((comment: any) => (
              <li key={comment.id} className="border-b pb-2">
                <div className="text-gray-800">{comment.content}</div>
                <div className="text-xs text-gray-500 mt-1">
                  by {comment.user.username}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default SingleThreadOverview;