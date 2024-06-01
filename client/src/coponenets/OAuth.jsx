import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import axios from "axios";
import googleButton from "../assets/googleLogo.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  const handelGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await axios.post("http://localhost:8000/api/users/signIn", {
        username: result.user.displayName,
        email: result.user.email,
        image: result.user.photoURL,
      });
      const data = res;
      sessionStorage.setItem("access_token", data.data.token);
      dispatch(signInSuccess(data));
      navigate("/profile");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-00 dark:text-gray-800">
            Start your chatting by quickly setting up your account with Google
          </p>
          <button
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-300 focus:ring-4 focus:ring-blue-300 focus:outline-none focus:ring-opacity-50 transition duration-150 rounded-lg px-4 py-2"
            onClick={handelGoogleClick}
          >
            <img
              src={googleButton}
              alt="google_logo"
              className="w-6 h-6"
              loading="lazy"
            />
            <span className="text-gray-800 dark:text-gray-100">
              Continue With Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuth;
