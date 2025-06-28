import { FaThumbsUp } from "react-icons/fa";
import moment from "moment";

export default function Comment({ comment }) {
  return (
    <div className="flex gap-4">
      {/* left side (for image) */}
      <div>
        <img
          src={comment?.userId.profilePicture}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover bg-gray-100"
        />
      </div>
      {/* right side for details of comment */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-700 font-bold">
            @{comment?.userId.username}
          </span>
          <span className="text-gray-500 text-xs font-medium italic">
            {moment(comment?.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-sm text-gray-800 mb-2">{comment?.content}</p>
        <hr className="max-w-32" />
        <div className="flex items-center text-xs gap-2 text-gray-500">
          <FaThumbsUp className="hover:text-blue-500 cursor-pointer" />
          <span className="hover:underline cursor-pointer hover:text-green-500">Edit</span>
          <span className="hover:underline cursor-pointer hover:text-red-500">Delete</span>
        </div>
      </div>
    </div>
  );
}
