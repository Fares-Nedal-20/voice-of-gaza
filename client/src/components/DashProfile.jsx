import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  Modal,
  ModalHeader,
  ModalBody,
} from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  signout,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const [file, setFile] = useState(null);
  const [fileImageURL, setFileImageURL] = useState(null);
  const [imageUploadingError, setImageUploadingError] = useState(null);
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

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

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/deleteUser/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        return;
      }
      if (res.ok) {
        dispatch(deleteUserSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (!res.ok) {
        return;
      }
      if (res.ok) {
        dispatch(signout());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // className="min-h-screen w-full bg-cover"
  // style={{
  //   backgroundImage: "url('/bg-signup.png')",
  //   backgroundColor: "rgba(255, 255, 255, 0.8)", // light overlay
  //   backgroundBlendMode: "lighten", // blend white with image
  // }}

  return (
    <div
      className="min-h-screen w-full bg-cover"
      style={{
        backgroundImage: "url('/bg-signup.png')",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // light overlay
        backgroundBlendMode: "lighten", // blend white with image
      }}
    >
      <div className="w-full max-w-lg mx-auto p-3">
        <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
        <form
          className="flex flex-col gap-4 shadow-md rounded-xl px-4 py-8 bg-white z-30"
          onSubmit={handleSubmit}
        >
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
          <div className="text-sm text-red-600 flex items-center justify-between mt-4">
            <span className="cursor-pointer" onClick={() => setShowModal(true)}>
              Delete account
            </span>
            <span className="cursor-pointer" onClick={handleSignOut}>
              Sign out
            </span>
          </div>
        </form>
        {(error || imageUploadingError) && (
          <Alert color="failure" className="mt-5">
            {error || imageUploadingError}
          </Alert>
        )}
        <Modal
          show={showModal}
          popup
          size="md"
          onClose={() => setShowModal(false)}
        >
          <ModalHeader />
          <ModalBody className="flex flex-col items-center gap-4">
            <HiOutlineExclamationCircle className="w-16 h-16 text-gray-400" />
            <p className="font-medium text-gray-500">
              Are you sure you want to delete your account?
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                color="red"
                className="cursor-pointer"
                onClick={handleDeleteUser}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="alternative"
                className="cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                No, Cancel
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}
