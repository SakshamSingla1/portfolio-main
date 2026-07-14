import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useColors } from "../../utils/theme";

const NotFound = () => {
  const location = useLocation();
  const colors = useColors();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: colors.neutral900 }}
    >
      <div className="text-center space-y-3">
        <h1
          className="text-7xl font-bold"
          style={{ color: colors.primary500 }}
        >
          404
        </h1>
        <p className="text-xl" style={{ color: colors.neutral400 }}>
          Oops! Page not found
        </p>
        <Link
          to="/"
          className="inline-block text-sm underline"
          style={{ color: colors.primary400 }}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
