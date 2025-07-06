import { FaThumbsUp } from "react-icons/fa";
import moment from "moment";
import { useState } from "react";
import { Button, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";

export default function Comment({ comment, onDelete, onEdit }) {
  // { comments = [] } ==>> to ensure that comments is always an array, even if it's empty

  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const handleSave = async () => {
    try {
      const res = await fetch(
        `/api/comment/updateComment/${currentUser._id}/${comment._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editedContent }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        return;
      }
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl break-words">
      <div className="flex gap-4">
        {/* left side (for image) */}
        <div className="flex shrink-0">
          <img
            src={comment?.userId?.profilePicture}
            alt="https://svgsilh.com/svg_v2/659651.svg"
            className="w-8 h-8 rounded-full object-cover bg-gray-100"
          />
        </div>
        {/* right side for details of comment */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-700 font-bold">
              @{comment?.userId?.username}
            </span>
            <span className="text-gray-500 text-xs font-medium italic">
              {moment(comment?.createdAt).fromNow()}
            </span>
          </div>
          {isEditing ? (
            <div className="flex flex-col gap-2 bg-gray-50 p-2 rounded-md shadow-md">
              <Textarea
                placeholder="Update your comment..."
                className="text-sm"
                rows={3}
                cols={80}
                maxLength={1000}
                id="content"
                defaultValue={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex gap-2 items-center justify-end">
                <Button
                  onClick={() => setIsEditing(false)}
                  color="alternative"
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="cursor-pointer"
                  color="green"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-700 mb-2">{comment?.content}</p>
              <hr className="max-w-32" />
              <div className="flex items-center text-xs gap-2 text-gray-500">
                <FaThumbsUp className="hover:text-blue-500 cursor-pointer" />
                {(comment.userId._id === currentUser._id ||
                  currentUser.role === "admin") && (
                  <>
                    <span
                      onClick={() => {
                        setIsEditing(true);
                        setEditedContent(comment.content);
                      }}
                      className="hover:underline cursor-pointer hover:text-green-500"
                    >
                      Edit
                    </span>
                    <span
                      className="hover:underline cursor-pointer hover:text-red-500"
                      onClick={() => onDelete(comment._id)}
                    >
                      Delete
                    </span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
