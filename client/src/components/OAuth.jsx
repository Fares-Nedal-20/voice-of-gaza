import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { app } from "./../firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  signInSuccess,
  signInStart,
  signInFailure,
  signUpSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const disptch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      disptch(signInStart);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const resultFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultFromGoogle.user);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          profilePicture: resultFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        disptch(signInFailure(data.message));
        return;
      }
      if (res.ok) {
        disptch(signUpSuccess(data));
        navigate("/");
      }
    } catch (error) {
      disptch(signInFailure(error.message));
    }
  };
  return (
    <Button
      onClick={handleGoogleClick}
      className="cursor-pointer flex items-center gap-2 bg-gradient-to-br from-pink-500 to-orange-400 text-white hover:bg-gradient-to-bl focus:ring-pink-200 dark:focus:ring-pink-800"
    >
      <AiFillGoogleCircle className="w-5 h-5" />
      <span>Continue with google</span>
    </Button>
  );
}
