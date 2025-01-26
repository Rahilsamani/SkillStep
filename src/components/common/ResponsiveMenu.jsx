import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const ResponsiveMenu = ({ open, token, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleClose}
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute bg-gradient-to-b from-richblack-800 to-richblack-900 shadow-lg min-h-[60vh] left-0 top-[10%] w-full flex flex-col px-6 py-8 text-lg font-semibold uppercase rounded-b-2xl z-50"
          >
            <div className="w-full text-right">
              <button
                onClick={handleClose}
                className="text-white font-bold text-2xl"
              >
                &times;
              </button>
            </div>
            <ul className="flex flex-col gap-6 text-richblack-25 text-center w-full">
              <li className="hover:text-blue-50 transition-colors">
                <Link to="/" onClick={handleClose}>
                  <p>Home</p>
                </Link>
              </li>
              <li className="hover:text-blue-50 transition-colors">
                <Link to="/about" onClick={handleClose}>
                  <p>About Us</p>
                </Link>
              </li>
              <li className="hover:text-blue-50 transition-colors">
                <Link to="/contact" onClick={handleClose}>
                  <p>Contact Us</p>
                </Link>
              </li>
              {token === null && (
                <>
                  <li className="hover:text-blue-50 transition-colors">
                    <Link to="/login" onClick={handleClose}>
                      <p>Login</p>
                    </Link>
                  </li>
                  <li className="hover:text-blue-50 transition-colors">
                    <Link to="/signup" onClick={handleClose}>
                      <p>Sign up</p>
                    </Link>
                  </li>
                </>
              )}
              {token !== null && (
                <li className="hover:text-blue-50 transition-colors">
                  <Link to="/dashboard" onClick={handleClose}>
                    <p>Dashboard</p>
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
