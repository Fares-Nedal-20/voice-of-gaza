import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div
      className="min-h-screen w-full bg-cover"
      style={{
        backgroundImage: "url('/bg-signup.png')",
        backgroundColor: "rgba(255, 255, 255, 0.93)", // light overlay
        backgroundBlendMode: "lighten", // blend white with image
      }}
    >
      <div className="w-full max-w-4xl mx-auto p-3">
        <h1 className="text-4xl font-semibold text-center my-7 text-gray-700">
          Sign Up
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-8 mt-14">
          {/* left side */}
          <div className="flex flex-col gap-4 flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-tr from-slate-700 via-slate-500 to-slate-200 text-white p-3 rounded-lg">
              Voice of Gaza
            </h1>
            <p className="font-medium text-sm text-gray-700">
              To get our message and our suffering to you, create a new account
              on Voice of Gaza.
            </p>
          </div>
          {/* right side */}
          <div className="flex-1">
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label className="ml-1 text-gray-700 font-medium">
                  Username
                </Label>
                <TextInput
                  type="text"
                  placeholder="Username..."
                  id="username"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="ml-1 text-gray-700 font-medium">Email</Label>
                <TextInput
                  type="email"
                  placeholder="company@gmail.com"
                  id="email"
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
                />
              </div>
              <Button className="uppercase bg-gradient-to-br from-slate-400 to-slate-700 text-white hover:bg-gradient-to-bl focus:ring-gray-100 dark:focus:ring-green-800">
                Sign Up
              </Button>
            </form>
            <div className="text-red-600 mt-5 flex justify-between items-center text-sm">
              <span className="cursor-pointer">
                Have an account?{" "}
                <Link to={"/sign-in"} className="text-blue-600 ml-1">
                  Sign in
                </Link>
              </span>
              <span className="cursor-pointer">Sign out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
