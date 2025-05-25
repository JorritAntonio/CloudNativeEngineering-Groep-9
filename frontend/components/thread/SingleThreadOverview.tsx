import React from 'react';
import useSWR from 'swr';
import ThreadService from '@/services/ThreadService';
import { Thread } from '@/types/types';

type Props = {
  thread: Thread | undefined;
};

const SingleThreadOverview: React.FC<Props> = ({ thread }: Props) => {
  if (!thread) return (
    <div className="max-w-3xl mx-auto mt-12 p-6 text-center text-red-500">
      Thread not found!
    </div>
  );

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
    </div>
  );
};

export default SingleThreadOverview;