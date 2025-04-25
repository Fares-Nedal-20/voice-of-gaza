import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signUpStart,
  signUpSuccess,
  signUpFailure,
} from "../redux/user/userSlice";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const { error, loading, currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signUpStart());
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signUpFailure(data.message));
        return;
      } else {
        dispatch(signUpSuccess(data));
        console.log("User created successfully!");
      }
    } catch (error) {
      dispatch(signUpFailure(error.message));
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover"
      style={{
        backgroundImage: "url('/bg-signup.png')",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // light overlay
        backgroundBlendMode: "lighten", // blend white with image
      }}
    >
      <div className="w-full max-w-4xl mx-auto p-3">
        <h1 className="text-4xl font-semibold text-center my-7 text-gray-700">
          Sign Up
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-8 mt-14 shadow-md rounded-xl px-4 py-8 bg-white z-30">
          {/* left side */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between bg-gradient-to-tr from-slate-700 via-slate-400 to-slate-50 text-white p-3 rounded-lg">
              <h1 className="text-4xl font-bold ">Voice of Gaza</h1>
              <img
                className="w-10 h-12 object-cover"
                src="/logo-_1_.svg"
                alt="image"
              />
            </div>
            <p className="font-medium text-sm text-gray-700">
              To get our message and our suffering to you, create a new account
              on Voice of Gaza.
            </p>
          </div>
          {/* right side */}
          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <Label className="ml-1 text-gray-700 font-medium">
                  Username
                </Label>
                <TextInput
                  type="text"
                  placeholder="Username..."
                  id="username"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="ml-1 text-gray-700 font-medium">Email</Label>
                <TextInput
                  type="email"
                  placeholder="company@gmail.com"
                  id="email"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="ml-1 text-gray-700 font-medium">
                  Password
                </Label>
                <TextInput
                  type="password"
                  placeholder="***********"
                  id="password"
                  onChange={handleChange}
                />
              </div>
              <Button
                type="submit"
                className="uppercase bg-gradient-to-br from-slate-400 to-slate-700 text-white hover:bg-gradient-to-bl focus:ring-gray-100 dark:focus:ring-green-800 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
            <div className="text-red-600 mt-5 flex justify-between items-center text-sm">
              <span>
                Have an account?{" "}
                <Link to={"/sign-in"} className="text-blue-600 ml-1">
                  Sign in
                </Link>
              </span>
              <span className="cursor-pointer">Sign out</span>
            </div>
            {error && (
              <Alert className="mt-5" color="failure">
                {error}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
