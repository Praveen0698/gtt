"use client";
import React from "react";
import Image from "next/image";
import Logo from "../../public/logo.png";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleBtnClick = () => {
    router.push("/dashboard");
  };

  const handleLogout = () => {
    // Remove accessToken and refreshToken from cookies
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    // Redirect to the home page
    router.push("/");
  };

  return (
    <div className="home-nav-bar-container">
      <div className="logo-dash-container">
        <Image src={Logo} alt="Logo" className="logo-home-image" />
        <button className="home-nav-dashboard" onClick={handleBtnClick}>
          Dashboard
        </button>
      </div>
      <button className="home-nav-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
