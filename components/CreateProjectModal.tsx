"use client";

import { useState } from "react";

type Props = {
    onClose: () => void;
    onCreate: (name: string) => void;
    loading: boolean;
};

export default function CreateProjectModal({
                                               onClose,
                                               onCreate,
                                               loading,
                                           }: Props) {
    const [name, setName] = useState("");

    const handleSubmit = () => {
        if (!name.trim() || loading) return;
        onCreate(name);
    };

    return (
        // BACKDROP
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            {/* MODAL */}
            <div className="w-full max-w-sm rounded-xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">
                    Create Project
                </h3>

                {/* INPUT */}
                <input
                    type="text"
                    placeholder="Project name"
                    value={name}
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md bg-black border border-gray-800 px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />

                {/* ACTIONS */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-gray-400 hover:text-white transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !name.trim()}
                        className="px-4 py-2 rounded-md bg-white text-black font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
