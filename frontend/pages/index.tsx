import Head from "next/head";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home - BadOverflow</title>
        <meta name="description" content="BadOverflow - The gloriously imperfect Q&A hub for developers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100 text-center">
        <section className="max-w-3xl py-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to BadOverflow</h1>
          <p className="text-xl text-gray-700 mb-8">
            Where questions are many, answers are questionable, and learning happens anyway.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/threads"
              className="flex-1 max-w-[180px] min-w-[100px] text-center bg-blue-60 px-4 py-2 rounded-2xl shadow-md transition bg-orange-500 text-white hover:bg-orange-600"
            >
              Explore Threads
            </a>
            <a
              href="/signup"
              className="flex-1 max-w-[180px] min-w-[100px] text-center px-4 py-2 rounded-2xl shadow-md transition bg-orange-500 text-white hover:bg-orange-600"
            >
              Sign up!
            </a>
          </div>
        </section>
        <section className="mt-16 max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">Why BadOverflow?</h2>
          <ul className="text-left text-gray-700 space-y-3 list-disc list-inside">
            <li>🔍 Ask burning questions and maybe get answers.</li>
            <li>💡 Share ideas, bugs, rants, and weird code that *shouldn't* work but does.</li>
            <li>🤝 Connect with devs who embrace imperfection.</li>
            <li>🎭 It's like StackOverflow... if StackOverflow had a sense of humor.</li>
          </ul>
        </section>
      </main>
    </>
  );
}
