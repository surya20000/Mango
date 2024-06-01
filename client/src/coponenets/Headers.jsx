import { SiAnimalplanet } from "react-icons/si";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Headers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userAvatar, setUserAvatar] = useState(null);
  useEffect(() => {
    setUserAvatar(
      currentUser?.data?.user?.avatar || currentUser?.data?.avatar || ""
    );
  }, [currentUser]);

  return (
    <div>
      <header className="p-4 dark:bg-gray-800 text-white flex justify-around">
        <Link to="/">
          <div className="flex items-center hover:underline">
            <SiAnimalplanet size={30} />
          </div>
        </Link>
        <Link to="/chat-section">
          <div>
            <span className="hover:underline">Start Chatting</span>
          </div>
        </Link>
        <Link to="/login">
          {" "}
          <li className="hidden sm:inline hover:underline">Sign Up</li>{" "}
        </Link>
        <Link to="/profile">
          {currentUser ? (
            <img
              src={userAvatar}
              alt="profile"
              className="rounded-full h-8 w-8.3 object-cover"
            />
          ) : (
            <li className="sm:inline hover:underline">Sign In</li>
          )}
        </Link>
      </header>
    </div>
  );
};

export default Headers;
