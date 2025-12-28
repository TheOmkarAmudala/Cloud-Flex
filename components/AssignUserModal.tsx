"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Props = {
    projectId: string;
    onClose: () => void;
    onSuccess: () => void;
};

export default function AssignUserModal({
                                            projectId,
                                            onClose,
                                            onSuccess,
                                        }: Props) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("developer");
    const [users, setUsers] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/users").then((res) => setUsers(res.data));
    }, []);

    const handleAssign = async () => {
        setError("");
        setLoading(true);

        const user = users.find((u) => u.email === email);

        if (!user) {
            setError("No user found with this email");
            setLoading(false);
            return;
        }

        try {
            await api.post(`/projects/${projectId}/users`, {
                userId: user.id,
                role,
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to assign user");
        } finally {
            setLoading(false);
        }
    };

    return (
        // BACKDROP
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            {/* MODAL */}
            <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
                <h2 className="text-xl font-semibold text-white mb-4">
                    Assign User
                </h2>

                {/* EMAIL INPUT */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">
                        User Email
                    </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full rounded-md bg-black border border-gray-800 px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                </div>

                {/* ROLE SELECT */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">
                        Role
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-md bg-black border border-gray-800 px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                        <option value="owner">Owner</option>
                        <option value="developer">Developer</option>
                        <option value="viewer">Viewer</option>
                    </select>
                </div>

                {/* ERROR */}
                {error && (
                    <p className="text-sm text-red-400 mb-3">
                        {error}
                    </p>
                )}

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleAssign}
                        disabled={loading || !email}
                        className="px-4 py-2 rounded-md bg-white text-black font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "Assigning..." : "Assign"}
                    </button>
                </div>
            </div>
        </div>
    );
}
