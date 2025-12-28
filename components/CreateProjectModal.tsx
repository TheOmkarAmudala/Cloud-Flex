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
        if (!name.trim()) return;
        onCreate(name);
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
            }}
        >
            <div
                style={{
                    background: "rgba(128, 128, 128)",
                    padding: 20,
                    width: 350,
                    borderRadius: 8,
                }}
            >
                <h3>Create Project</h3>

                <input
                    type="text"
                    placeholder="Project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        width: "100%",
                        padding: 8,
                        marginTop: 10,
                        marginBottom: 15,
                    }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button onClick={onClose}>Cancel</button>

                    <button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
