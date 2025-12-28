"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        try {
            setLoading(true);
            await api.post("/auth/register", { email, password, clientId: "client_1", });
            router.push("/login");
        } catch {
            alert("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-gray-200">
            <div className="w-full max-w-sm rounded-xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">
                <h1 className="text-2xl font-semibold text-white mb-6 text-center">
                    Create your account
                </h1>

                {/* EMAIL */}
                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 rounded-md bg-black border border-gray-800 px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />

                {/* PASSWORD */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-6 rounded-md bg-black border border-gray-800 px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />

                {/* ACTION */}
                <button
                    onClick={handleRegister}
                    disabled={loading || !email || !password}
                    className="w-full rounded-md bg-white text-black font-medium py-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {loading ? "Creating account..." : "Register"}
                </button>

                {/* FOOTER */}
                <p className="text-sm text-gray-500 mt-6 text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-white hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
