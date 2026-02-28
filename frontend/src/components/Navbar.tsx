import { useAuth0 } from "@auth0/auth0-react";
import { IoLogoWechat } from "react-icons/io5";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";

const Navbar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav className="bg-black text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <IoLogoWechat className="text-3xl md:text-4xl text-white" />
        <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight">ChatRoom</h1>
      </div>

      <div className="flex items-center space-x-2">
        {!isAuthenticated ? (
          <div className="hidden sm:flex items-center space-x-2">
            <LoginButton />
            <SignupButton />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <LogoutButton className="px-2 py-1 text-xs" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;