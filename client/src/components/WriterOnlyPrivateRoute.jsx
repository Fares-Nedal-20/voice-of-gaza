import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function WriterOnlyPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  //   currentUser && currentUser?.role === "writer" ? : ==> that same of
  return currentUser?.role === "writer" ? (
    <Outlet />
  ) : (
    <Navigate to={"/sign-in"} />
  );
}
