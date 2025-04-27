import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
  const [file, setFile] = useState(null);
  const [fileImageURL, setFileImageURL] = useState(null);
  const [imageUploadingError, setImageUploadingError] = useState(null);
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);

  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFileImageURL(URL.createObjectURL(file)); // temporary image url
    }
  };

  useEffect(() => {
    if (!file) return;
    uploadImage(file);
  }, [file]);

  const uploadImage = async (file) => {
    try {
      setImageUploadingError(null);
      setImageUploadingProgress(null);

      const file_size_MB = 2;
      const file_size_byte = file_size_MB * 1024 * 1024;

      if (file.size > file_size_byte) {
        setImageUploadingError(
          `Image size exceeds ${file_size_MB}MB, upload image with smaller size`
        );
        return;
      }

      const upload_preset = "Voice_of_gaza";
      const cloud_name = "dcdoxdyeu";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", upload_preset);
      formData.append("cloud_name", cloud_name);

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        true
      );

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = ((e.loaded / e.total) * 100).toFixed(0);
          setImageUploadingProgress(progress);
          console.log("Upload image url", progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFileImageURL(response.secure_url);
          console.log("Uploaded image url", response.secure_url);
          setImageUploadingProgress(null);
        } else {
          setImageUploadingError("Upload failed!");
          setFileImageURL(null);
          setImageUploadingProgress(null);
          return;
        }
      };

      xhr.onerror = () => {
        setImageUploadingError("Upload failed!");
        setFileImageURL(null);
        setImageUploadingProgress(null);
        return;
      };

      xhr.send(formData);
    } catch (error) {
      setImageUploadingError("Upload faild!");
      setFileImageURL(null);
      setImageUploadingProgress(null);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="relative w-32 h-32 self-center rounded-full cursor-pointer overflow-hidden shadow-md">
          {imageUploadingProgress && imageUploadingProgress > 0 && (
            <CircularProgressbar
              value={imageUploadingProgress}
              text={`${imageUploadingProgress}%`}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,155,199, ${(
                    imageUploadingProgress / 100
                  ).toFixed(0)})`,
                },
              }}
            />
          )}
          <img
            src={fileImageURL || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageUploadingProgress &&
              imageUploadingProgress < 100 &&
              "opacity-80"
            }`}
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
        <Button
          disabled={imageUploadingProgress}
          type="submit"
          outline
          color={"gray"}
          className="cursor-pointer"
        >
          Update User
        </Button>
      </form>
      {imageUploadingError && (
        <Alert
          color="failure"
          className="mt-5"
          onDismiss={() => setImageUploadingError(false)}
        >
          {imageUploadingError}
        </Alert>
      )}
    </div>
  );
}
