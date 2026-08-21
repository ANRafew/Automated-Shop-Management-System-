import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(sessionStorage.getItem("user")); // session storage

  //logout and session clear logic
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const dashboard = () => {
    if (storedUser?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/staff");
    }
  };

  return (
    <header className="flex justify-between items-center md:px-8 py-3 bg-gray-800 shadow-md">
      {/* logo */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src="/LR.png"
            alt="App Logo"
            className="h-12 w-auto cursor-pointer"
          />
        </Link>
      </div>

      {/* Right side buttons */}
      <div className="flex gap-4">
        {!storedUser ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-blue-600 transition"
            >
              Log in
            </Link>
          </>
        ) : (
          <>
            <h1 className="py-2 text-xl md:text-2xl font-semibold uppercase">
              {storedUser.role}
            </h1>
            <button
              onClick={dashboard}
              className="px-4 py-2 bg-purple-600 text-white font-semibold rounded hover:bg-red-700 transition"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
