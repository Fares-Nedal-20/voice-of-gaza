import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Label, TextInput } from "flowbite-react";

export default function DashProfile() {
  const [file, setFile] = useState(null);
  const [fileImageURL, setFileImageURL] = useState(null);
  console.log(file, fileImageURL);
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFileImageURL(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="self-center border-5 rounded-full border-gray-300 cursor-pointer">
          <img
            src={fileImageURL || currentUser.profilePicture}
            alt="user"
            className="rounded-full w-28 h-28 object-cover"
            onClick={() => fileRef.current.click()}
          />
        </div>
        <input
          hidden
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImageChange}
        />
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-gray-700 font-medium">Username</Label>
          <TextInput
            placeholder="Username..."
            id="username"
            type="text"
            value={currentUser.username}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-gray-700 font-medium">Email</Label>
          <TextInput
            placeholder="Email..."
            id="email"
            type="email"
            value={currentUser.email}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-gray-700 font-medium">Password</Label>
          <TextInput placeholder="***********" id="password" type="password" />
        </div>
        <Button type="submit" outline color={"gray"} className="cursor-pointer">
          Update User
        </Button>
      </form>
    </div>
  );
}
