import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { GiArmorUpgrade } from "react-icons/gi";
import { GiArmorDowngrade } from "react-icons/gi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashRoleRequest() {
  const { currentUser } = useSelector((state) => state.user);
  const [roleRequests, setRoleRequests] = useState([]);
  const [showModalApprove, setShowModalApprove] = useState(false);
  const [showModalReject, setShowModalReject] = useState(false);
  const [requestRoleIdToBeApprove, setRequestRoleIdToBeApprove] = useState("");
  const [requestRoleIdToBeReject, setRequestRoleIdToBeReject] = useState("");
  // const [approveRoleRequestSuccess, setApproveRoleRequestSuccess] =
  //   useState("");
  // const [approveRoleRequestError, setApproveRoleRequestError] = useState("");
  // const [rejectRoleRequestSuccess, setRejectRoleRequestSuccess] = useState("");
  // const [rejectRoleRequestError, setRejectRoleRequestError] = useState("");

  const fetchRoleRequests = async () => {
    try {
      const res = await fetch(`/api/roleRequest/role-requests`);
      const data = await res.json();
      if (!res.ok) {
        return;
      }
      if (res.ok) {
        setRoleRequests(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser.role === "admin") {
      fetchRoleRequests();
    }
  }, []);

  const handleApproveRoleRequest = async (requestRoleId) => {
    setShowModalApprove(false);
    try {
      const res = await fetch(
        `/api/roleRequest/role-request-approve/${requestRoleId}`,
        { method: "PATCH" }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      if (res.ok) {
        if (currentUser.role === "admin") {
          fetchRoleRequests();
        }
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRejectRoleRequest = async (requestRoleId) => {
    setShowModalReject(false);
    try {
      const res = await fetch(
        `/api/roleRequest/role-request-reject/${requestRoleId}`,
        { method: "PATCH" }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      if (res.ok) {
        if (currentUser.role === "admin") {
          fetchRoleRequests();
        }
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="px-3 py-4">
      {/* Table Section */}
      <div className="table-auto md:mx-auto overflow-x-auto scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
        {currentUser?.role === "admin" &&
        roleRequests &&
        roleRequests.length > 0 ? (
          <>
            <Table
              hoverable
              className="shadow-md bg-white border border-gray-200"
            >
              <TableHead>
                <TableRow>
                  <TableHeadCell>#</TableHeadCell>
                  <TableHeadCell>Username</TableHeadCell>
                  <TableHeadCell>Profile Picture</TableHeadCell>
                  <TableHeadCell>Current Role</TableHeadCell>
                  <TableHeadCell>Requested Role</TableHeadCell>
                  <TableHeadCell className="min-w-80">Message</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Upgrade</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roleRequests &&
                  roleRequests?.length > 0 &&
                  roleRequests.map((roleRequest, index) => (
                    <TableRow
                      key={roleRequest._id}
                      className="divide-y-1 divide-gray-200"
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium truncate">
                        {roleRequest.userId.username}
                      </TableCell>
                      <TableCell className="">
                        <img
                          className="w-10 h-10 rounded-full object-cover"
                          src={roleRequest.userId.profilePicture}
                          alt="user profile"
                        />
                      </TableCell>
                      <TableCell
                        className={
                          roleRequest.currentRole === "reader"
                            ? "text-yellow-400"
                            : roleRequest.currentRole === "writer"
                            ? "text-orange-400"
                            : roleRequest.currentRole === "admin"
                            ? "text-green-400"
                            : null
                        }
                      >
                        {roleRequest.currentRole}
                      </TableCell>
                      <TableCell
                        className={
                          roleRequest.requestedRole === "reader"
                            ? "text-yellow-400"
                            : roleRequest.requestedRole === "writer"
                            ? "text-orange-400"
                            : roleRequest.requestedRole === "admin"
                            ? "text-green-400"
                            : null
                        }
                      >
                        {roleRequest.requestedRole}
                      </TableCell>
                      <TableCell className="w-80 text-wrap">
                        {roleRequest.message}
                      </TableCell>
                      <TableCell className="text-yellow-400">
                        {roleRequest.status}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center gap-2">
                          <span
                            onClick={() => {
                              setShowModalApprove(true);
                              setRequestRoleIdToBeApprove(roleRequest._id);
                            }}
                            className="hover:underline cursor-pointer text-green-500"
                          >
                            Approve
                          </span>
                          <span
                            onClick={() => {
                              setShowModalReject(true);
                              setRequestRoleIdToBeReject(roleRequest._id);
                            }}
                            className="hover:underline cursor-pointer text-red-500"
                          >
                            reject
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <p className="text-center my-7 font-semibold text-xl text-gray-700">
            There is no role requests here!
          </p>
        )}
      </div>
      {showModalApprove && (
        <Modal
          show={showModalApprove}
          size="md"
          onClose={() => setShowModalApprove(false)}
          popup
        >
          <ModalHeader />
          <ModalBody className="text-center flex flex-col gap-4">
            <GiArmorUpgrade className="w-full text-5xl text-gray-500" />
            <h2 className="text-gray-700">
              Are you sure you want to upgrade this user role from reader to
              writer?
            </h2>
            <div className="flex items-center gap-4 justify-center">
              <Button
                className="cursor-pointer"
                color={"green"}
                onClick={() =>
                  handleApproveRoleRequest(requestRoleIdToBeApprove)
                }
              >
                Yes, I'm sure
              </Button>
              <Button
                onClick={() => setShowModalApprove(false)}
                className="cursor-pointer"
                color={"alternative"}
              >
                No, Cancel
              </Button>
            </div>
          </ModalBody>
        </Modal>
      )}
      {showModalReject && (
        <Modal
          show={showModalReject}
          size="md"
          onClose={() => setShowModalReject(false)}
          popup
        >
          <ModalHeader />
          <ModalBody className="text-center flex flex-col gap-4">
            <GiArmorDowngrade className="w-full text-5xl text-gray-500" />
            <h2 className="text-gray-700">
              Are you sure you want to reject this role upgrade request?
            </h2>
            <div className="flex items-center gap-4 justify-center">
              <Button
                className="cursor-pointer"
                color={"red"}
                onClick={() => handleRejectRoleRequest(requestRoleIdToBeReject)}
              >
                Yes, I'm sure
              </Button>
              <Button
                onClick={() => setShowModalReject(false)}
                className="cursor-pointer"
                color={"alternative"}
              >
                No, Cancel
              </Button>
            </div>
          </ModalBody>
        </Modal>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
