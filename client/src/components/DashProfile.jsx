import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";

export default function DashProfile() {
  const [file, setFile] = useState(null);
  const [fileImageURL, setFileImageURL] = useState(null);
  const [imageUploadingError, setImageUploadingError] = useState(null);
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
  const [formData, setFormData] = useState({});

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef();
  const dispatch = useDispatch();
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

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", upload_preset);
      data.append("cloud_name", cloud_name);

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
          setFormData({ ...formData, profilePicture: response.secure_url });
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

      xhr.send(data);
    } catch (error) {
      setImageUploadingError("Upload faild!");
      setFileImageURL(null);
      setImageUploadingProgress(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    if (Object.keys(formData).length === 0) {
      dispatch(updateUserFailure("No changes made"));
      return;
    }
    try {
      const res = await fetch(`/api/user/updateUser/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      if (res.ok) {
        dispatch(updateUserSuccess(data));
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-gray-700 font-medium">Email</Label>
          <TextInput
            placeholder="Email..."
            id="email"
            type="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="ml-1 text-gray-700 font-medium">Password</Label>
          <TextInput
            placeholder="***********"
            id="password"
            type="password"
            onChange={handleChange}
          />
        </div>
        <Button
          disabled={imageUploadingProgress || loading}
          type="submit"
          outline
          color={"gray"}
          className="cursor-pointer"
        >
          {!error && loading ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span>Uploading...</span>
            </div>
          ) : (
            <span>Update User</span>
          )}
        </Button>
      </form>
      <div className="text-sm text-red-600 flex items-center justify-between mt-4">
        <span className="cursor-pointer">Delete user</span>
        <span className="cursor-pointer">Sign out</span>
      </div>
      {(error || imageUploadingError) && (
        <Alert color="failure" className="mt-5">
          {error || imageUploadingError}
        </Alert>
      )}
    </div>
  );
}
