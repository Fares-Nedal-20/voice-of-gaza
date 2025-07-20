import { ArrowRightIcon, Button } from "flowbite-react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function TrendingPostByComments() {
  const [trendingPostByComments, setTrendingPostByComments] = useState({});

  console.log(trendingPostByComments);

  useEffect(() => {
    const fetchTrendingPostByComments = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?sortBy=comments&limit=1`);
        const data = await res.json();
        if (!res.ok) {
          return;
        }
        setTrendingPostByComments(data.posts[0]);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchTrendingPostByComments();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center border border-teal-500 p-3 rounded-tl-3xl rounded-br-3xl">
      <div className="flex-1 text-gray-700 flex flex-col gap-4 text-center">
        <h2 className="text-2xl font-semibold">
          Want to show the trending post by comments?
        </h2>
        <p className="text-sm text-gray-500">
          Click the button below to view the most discussed post in the
          community and join the conversation.
        </p>
        <Link to={`/post/${trendingPostByComments.slug}`}>
          <Button className="w-full flex items-center gap-1 cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800 rounded-tl-none rounded-br-none">
            Click here <ArrowRightIcon className="mt-1" />
          </Button>
        </Link>
      </div>
      <div className="flex-1 w-full">
        <img
          className="h-[250px] w-full object-cover rounded-xl"
          src={trendingPostByComments.image}
          alt="post image"
        />
      </div>
    </div>
  );
}
