import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import axios from "axios";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFaliure,
  deleteUserStart,
  deleteUserSuccess,
  userSignoutFailure,
  userSignoutSuccess,
  userSignoutStart,
} from "../redux/user/userSlice.js";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState("");
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [filePercentage, setFilePercentage] = useState(0);
  const [formData, setFormData] = useState({});
  const [userAvatar, setUserAvatar] = useState(null);
  const [username, setUserName] = useState(null);
  const [useremail, setUserEmail] = useState(null);

  useEffect(() => {
    setUserAvatar(
      currentUser?.data?.user?.avatar || currentUser?.data?.avatar || ""
    );
    setUserEmail(
      currentUser?.data?.user?.email || currentUser?.data?.email || ""
    );
    setUserName(
      currentUser?.data?.user?.username || currentUser?.data?.username || ""
    );
  }, [currentUser]);

  const handleFileUpload = useCallback(
    (file) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePercentage(Math.round(progress));
        },
        (error) => {
          setfileUploadError(true);
          console.error("File upload error:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              avatar: downloadURL,
            }));
            setfileUploadError(false);
          });
        }
      );
    },
    [setFilePercentage, setfileUploadError, setFormData]
  );

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file, handleFileUpload]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      console.log(
        `${import.meta.env.VITE_APP_BACKEND_URI}api/users/updateUser/${
          currentUser.data.user._id
        }`
      );
      axios
        .put(
          `${import.meta.env.VITE_APP_BACKEND_URI}api/users/updateUser/${
            currentUser.data.user._id
          }`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
            },
          }
        )
        .then((res) => {
          console.log("backend data", res.data);
          dispatch(updateUserSuccess(res));
          setUpdateSuccess("Profile Updated Successfully");
        })
        .catch((error) => dispatch(updateUserFailure(error.message)));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleUserDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(deleteUserStart());
      await axios
        .delete(
          `http://localhost:8000/api/user/delete/${currentUser.data.user._id}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          dispatch(deleteUserSuccess(res));
          sessionStorage.clear();
        })
        .catch((err) => {
          dispatch(deleteUserFaliure(err.message));
        });
    } catch (error) {
      dispatch(deleteUserFaliure(error.message));
    }
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    try {
      dispatch(userSignoutStart());
      sessionStorage.clear();
      dispatch(userSignoutSuccess("User Deleted"));
    } catch (error) {
      dispatch(userSignoutFailure(error));
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl rounded-xl mt-10">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
        Profile
      </h1>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="relative">
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || userAvatar}
              alt="User Avatar"
              className="rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-gray-200 shadow-lg transition duration-300 transform hover:scale-105"
            />
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536M4 8v11a2 2 0 002 2h11M14 3h6a2 2 0 012 2v6M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2v5"
                />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-600 text-center">
            {fileUploadError ? (
              <span className="text-red-500">
                Error while uploading the image (must be less than 2MB)
              </span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className="text-blue-500">{`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
              <span className="text-green-500">Uploaded Successfully</span>
            ) : null}
          </p>
        </div>

        <div className="relative">
          <label
            htmlFor="username"
            className="block text-gray-700 font-medium mb-2"
          >
            Full Name:
          </label>
          <input
            type="text"
            id="username"
            defaultValue={username}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Enter your full name"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V9a4 4 0 10-8 0v2a4 4 0 00-4 4v1h16v-1a4 4 0 00-4-4z"
            />
          </svg>
        </div>

        <div className="relative">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            defaultValue={useremail}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Enter your email"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12h2a2 2 0 012 2v6H4v-6a2 2 0 012-2h2m4 0V9a4 4 0 00-4-4V3a2 2 0 114 0v2a4 4 0 00-4 4v3h8z"
            />
          </svg>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-3 uppercase font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
          // disabled={loading}
        >
          {/* {loading ? "Loading..." : "Update Profile"} */} update
        </button>
      </form>

      {updateSuccess && (
        <p className="text-green-500 text-center mt-4">{updateSuccess}</p>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={handleUserDelete}
          className="text-red-600 hover:text-red-500 font-medium focus:outline-none focus:underline transition duration-200"
        >
          Delete Account
        </button>
        <button
          onClick={handleSignOut}
          className="text-red-600 hover:text-red-500 font-medium focus:outline-none focus:underline transition duration-200"
        >
          Sign Out
        </button>
      </div>

      {/* {err && <p className="text-red-600 text-center mt-4">{err}</p>} */}
    </div>
  );
};

export default Profile;
