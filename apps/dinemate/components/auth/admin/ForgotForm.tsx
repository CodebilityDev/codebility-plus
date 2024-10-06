"use client";
import React, { useState } from "react";
import Link from "next/link";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Username:", username);
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      <div className="mb-6">
        <Link
          href={"/admin/login"}
          className="text-sm text-gray-00 hover:underline float-right mt-1"
        >
          Go back to Login?
        </Link>
      </div>
      <button
        type="submit"
        className="w-full mt-6 py-2 px-4 bg-[#FF670E] text-white font-semibold rounded-md shadow hover:text-black"
      >
        Submit
      </button>
    </form>
  );
};

export default LoginForm;
