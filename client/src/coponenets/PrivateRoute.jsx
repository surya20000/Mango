import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div>
      {console.log("privateroute checking", currentUser)}
      {currentUser ? <Outlet /> : <Navigate to="/login" />}
    </div>
  );
};

export default PrivateRoute;
