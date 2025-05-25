import useSWR from "swr";
import React from 'react';
import CommentService from "@/services/CommentService";

type Props = {
    threadId: number | undefined;
}

const SingleThreadCommentsOverview: React.FC<Props> =  ({threadId}) => {

    const fetch = async () => {
        if (threadId === undefined) return [];
        return await CommentService.getCommentsByThreadId(threadId);
    };

  const { data: comments, error, isLoading } = useSWR(
    () => (threadId ? `thread-${threadId}` : null),
    fetch
  );
}

export default SingleThreadCommentsOverview;