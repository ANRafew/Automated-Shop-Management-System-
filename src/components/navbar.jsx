import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const dashboard = () =>{
    if(user.role === "admin"){
        navigate("/admin");
    } else {
        navigate("/staff");
    }
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-sky-700 shadow-md">
      {/* Logo → Homepage */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src="/LR.png" // replace with your logo path
            alt="App Logo"
            className="h-12 w-auto cursor-pointer"
          />
        </Link>
      </div>

      {/* Right side buttons */}
      <div className="flex gap-4">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-blue-600 transition"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>  
            <button
                onClick={dashboard}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-red-700 transition"
            >
                Dashboard
            </button>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
