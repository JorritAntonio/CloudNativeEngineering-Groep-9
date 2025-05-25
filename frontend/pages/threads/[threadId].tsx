import React from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ThreadService from '@/services/ThreadService';
import SingleThreadOverview from '@/components/thread/SingleThreadOverview';
import Header from '@/components/Header';

const ThreadPage: React.FC = () => {
  const router = useRouter();
  const { threadId } = router.query;

  const fetch = async () => {
      return await ThreadService.getThreadById(threadId as string);
  };

  const { data: thread, error, isLoading } = useSWR(
    () => (threadId ? `thread-${threadId}` : null),
    fetch
  );


  return(
    <>
        <Header/>
        {isLoading &&  <p className="text-center mt-10">Loading...</p>}
        {error &&  <p className="text-center mt-10 text-red-600">{error.message}</p>}
        {thread && <SingleThreadOverview thread={thread} />}
    </>
  ) 
};



export default ThreadPage;