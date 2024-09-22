"use client";
import React, { useState, useEffect } from "react";
import SideImg from "../../public/loginbus.png";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/api/auth/validate", {
          withCredentials: true,
        });

        const accessToken = getCookie("accessToken");
        if (response.data.isLoggedIn && accessToken) {
          router.push("/dashboard");
        }
      } catch (error) {}
    };

    checkLoginStatus();
  }, [router]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });

      const { accessToken } = response.data;

      document.cookie = `accessToken=${accessToken}; path=/;`;
      router.push("/dashboard");
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="loader-container">
          <div className="loader-container">
            <i>GTT</i>
          </div>
        </div>
      ) : null}
      <div className="login-container">
        <h1 className="company-name">GTT</h1>
        <div className="login-content">
          <h1 style={{ color: "white" }}>Login</h1>
          <div className="text-field">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button
              type="submit"
              onClick={handleLogin}
              style={{ cursor: "pointer" }}
            >
              Login
            </button>
          </div>
        </div>
        <div className="login-image">
          <Image src={SideImg} alt="Side Visual" className="login-image" />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
