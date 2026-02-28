import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LogoutButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const { logout } = useAuth0();
  return (
    <button
      {...props}
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className={`button logout ${props.className || ""}`}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
