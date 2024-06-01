import { io } from "socket.io-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { RiFolderUploadLine } from "react-icons/ri";
import { useSelector } from "react-redux";

const Chats = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [username, setUserName] = useState(null);
  const [msg, setMsg] = useState("");
  const socketRef = useRef(io(import.meta.env.VITE_APP_BACKEND_URI));
  const [userId, setUserId] = useState("");
  const [usertyping, setUsertyping] = useState("");
  const [messages, setMessages] = useState([]);
  const fileRef = useRef(null);
  const [files, setFile] = useState("");
  const [cloudImage, setCloudImage] = useState("");
  const timestamp = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const [showSendImage, setShowImage] = useState(false);
  const [activateHandelSend, setActivatehandelSend] = useState(false);
  const messagesEndRef = useRef(null);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setUserName(
      currentUser?.data?.user?.username || currentUser?.data?.username || ""
    );
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDisplayMsg = useCallback((messageObject) => {
    setMessages((prevMessages) => [...prevMessages, messageObject]);
  }, []);

  const handeluserTypingStatus = useCallback((userId) => {
    setUsertyping(userId);
  }, []);
  const handelStatusOnSend = useCallback(() => {
    setUsertyping("");
  }, []);

  useEffect(() => {
    socketRef.current.on("connect", () => {
      console.log("user connected");
    });
    socketRef.current.on("userid", (id) => {
      console.log("userId", id);
      setUserId(id);
    });
  }, []);
  useEffect(() => {
    if (userId) {
      socketRef.current.on("displayMsg", handleDisplayMsg);
    }
  }, [handleDisplayMsg, userId]);
  useEffect(() => {
    if (userId) {
      socketRef.current.on("updateUserTypingStatus", handeluserTypingStatus);
      socketRef.current.on("turnOffTypingStatus", handelStatusOnSend);
    }
  }, [handeluserTypingStatus, handelStatusOnSend, userId]);

  const handlesend = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      if (msg.length > 0) {
        const messageObject = {
          username,
          message: msg,
          timestamp,
          senderID: userId,
          imageURL: "",
        };
        console.log(messageObject, "sent at the server");
        socketRef.current.emit("messageSent", messageObject);
        socketRef.current.emit("turnTypingOff", userId);
        setUsertyping("");
        setMsg("");
        setloading(false);
      } else {
        setloading(false);
      }
    } catch (error) {
      console.log(error.message);
      setloading(false);
    }
  };

  const handleChange = (e) => {
    try {
      setMsg(e.target.value);
      socketRef.current.emit("userTyping", username);
      console.log(username, "sent");
      setActivatehandelSend(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleImageUpload = async (e) => {
    console.log("function ran");
    e.preventDefault();
    try {
      setloading(true);
      const data = new FormData();
      data.append("file", files);
      data.append("upload_preset", "vucszha6");
      data.append("Folder", "media");

      if (data) {
        await fetch(import.meta.env.VITE_APP_CLOUDINARY_URI, {
          method: "POST",
          body: data,
        })
          .then((res) => res.json())
          .then((result) => {
            console.log("cloud data", result);
            setCloudImage(result.url);
            console.log("Image link", cloudImage);
            setloading(false);
            setShowImage(true);
          });
      }
    } catch (error) {
      console.log(error.message);
      setloading(false);
    }
  };

  const handelImageSend = (e) => {
    e.preventDefault();
    try {
      if (cloudImage) {
        const messageObject = {
          username,
          message: msg,
          timestamp,
          senderID: userId,
          imageURL: cloudImage,
        };
        socketRef.current.emit("messageSent", messageObject);
        setShowImage(false);
      } else {
        console.log("no image link generated");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto p-4">
        <h2 className="text-lg mb-2">Conversation</h2>
        <span className="text-slate-700 text-xs p-4">
          {usertyping && `${usertyping} is typing...`}
        </span>
        {showSendImage ? (
          <div className="dialog sm:w-96">
            <div className="dialog-content">
              <img
                src={cloudImage}
                alt="media_image"
                className="w-33 h-33 object-cover rounded-lg shadow-lg mx-auto"
              />
              <button
                onClick={handelImageSend}
                className="p-2 text-xl uppercase text-blue-600"
              >
                Send
              </button>
              <button
                onClick={() => setShowImage(!showSendImage)}
                className="p-2 text-xl uppercase text-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
        <div className="flex flex-col gap-2 overflow-y-auto">
          {messages
            .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
            .map((data, index) => (
              <div
                key={index}
                className={
                  data.senderID === userId
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    data.senderID === userId
                      ? "p-2 rounded-md bg-blue-200 text-blue-700"
                      : "p-2 rounded-md bg-green-200 text-green-700"
                  }
                >
                  <div className="flex justify-between">
                    <div className="text-xs text-blue-400">
                      {data.username === username ? "You" : data.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.timestamp}
                    </div>
                  </div>
                  {data.message && (
                    <div className="text-sm text-gray-700">{data.message}</div>
                  )}
                  {data.imageURL && (
                    <img
                      src={data.imageURL}
                      alt=""
                      loading="lazy"
                      className="h-auto w-full object-cover rounded-lg mx-auto sm:h-32 sm:w-32"
                    />
                  )}
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form
        onSubmit={activateHandelSend ? handlesend : handleImageUpload}
        className="flex items-center justify-between p-4 bg-white shadow-md"
        style={{ position: "sticky", bottom: 0, left: 0, right: 0 }}
      >
        <input
          type="text"
          onChange={handleChange}
          value={msg}
          placeholder="Enter text message"
          className="w-full p-2 border-2 border-gray-300 rounded-md flex-grow mr-4"
        />
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <RiFolderUploadLine
          onClick={() => {
            fileRef.current.click();
            setActivatehandelSend(false);
          }}
          size={42}
          className="text-gray-800 cursor-pointer mr-4"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Chats;
