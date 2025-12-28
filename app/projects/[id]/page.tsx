"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

type User = {
    id: string;
    email: string;
};

type ProjectUser = {
    id: string;
    role: string;
    user: User;
};

type Project = {
    id: string;
    name: string;
    projectUsers: ProjectUser[];
};

export default function ProjectDetails() {
    const { id } = useParams();
    const router = useRouter();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    // ✏️ Edit project name
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    // 👥 Assign user
    const [assignEmail, setAssignEmail] = useState("");
    const [assignRole, setAssignRole] = useState("developer");
    const [assigning, setAssigning] = useState(false);

    const fetchProject = async () => {
        try {
            const res = await api.get(`/projects/${id}`);
            setProject(res.data);
            setName(res.data.name);
        } catch {
            alert("Project not found");
            router.replace("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
            return;
        }

        fetchProject();
    }, [id]);

    const handleUpdate = async () => {
        if (!name.trim()) return;

        try {
            setSaving(true);
            await api.put(`/projects/${id}`, { name });
            setEditing(false);
            fetchProject();
        } catch {
            alert("You are not allowed to update this project");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = confirm(
            "Are you sure you want to delete this project?"
        );
        if (!confirmDelete) return;

        try {
            setDeleting(true);
            await api.delete(`/projects/${id}`);
            router.push("/dashboard");
        } catch {
            alert("You are not allowed to delete this project");
        } finally {
            setDeleting(false);
        }
    };

    // 👥 Assign user to project
    const assignUser = async () => {
        if (!assignEmail) {
            alert("Enter user email");
            return;
        }

        try {
            setAssigning(true);

            // 1️⃣ Find user by email
            const usersRes = await api.get("/users", {
                params: { email: assignEmail },
            });

            const user = usersRes.data[0];
            if (!user) {
                alert("User not found");
                return;
            }

            // 2️⃣ Assign user
            await api.post(`/projects/${id}/users`, {
                userId: user.id,
                role: assignRole,
            });

            setAssignEmail("");
            setAssignRole("developer");
            fetchProject();
        } catch (err: any) {
            alert(err.response?.data?.message || "Assignment failed");
        } finally {
            setAssigning(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
                Loading project...
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="min-h-screen bg-black text-gray-200">
            <main className="max-w-4xl mx-auto px-6 py-10">
                {/* HEADER */}
                <div className="flex justify-between items-start mb-8">
                    <div className="w-full max-w-xl">
                        {!editing ? (
                            <>
                                <h1 className="text-3xl font-semibold text-white">
                                    {project.name}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Project details & members
                                </p>
                            </>
                        ) : (
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-md bg-black border border-gray-800 px-3 py-2 text-white"
                            />
                        )}

                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="mt-2 text-sm text-gray-400 hover:text-white"
                            >
                                Edit project name
                            </button>
                        ) : (
                            <div className="mt-3 flex gap-4">
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setName(project.name);
                                    }}
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="text-sm text-white hover:underline disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-4 py-2 rounded-md border border-red-800 text-red-400 hover:bg-red-900/20 hover:text-red-300 disabled:opacity-50 transition"
                    >
                        {deleting ? "Deleting..." : "Delete Project"}
                    </button>
                </div>

                {/* ASSIGNED USERS */}
                <section className="border border-gray-800 rounded-xl bg-gray-950 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Assigned Users
                    </h3>

                    {project.projectUsers.length === 0 ? (
                        <p className="text-gray-500">
                            No users assigned to this project
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-800">
                            {project.projectUsers.map((pu) => (
                                <li
                                    key={pu.id}
                                    className="flex justify-between items-center py-3"
                                >
                                    <span className="text-gray-300">
                                        {pu.user.email}
                                    </span>

                                    <span className="text-xs uppercase tracking-wide px-3 py-1 rounded-full border border-gray-700 text-gray-400">
                                        {pu.role}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* ASSIGN USER */}
                <section className="border border-gray-800 rounded-xl bg-gray-950 p-6 mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Assign User
                    </h3>

                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="User email"
                            value={assignEmail}
                            onChange={(e) => setAssignEmail(e.target.value)}
                            className="flex-1 rounded-md bg-black border border-gray-800 px-3 py-2 text-gray-200"
                        />

                        <select
                            value={assignRole}
                            onChange={(e) => setAssignRole(e.target.value)}
                            className="rounded-md bg-black border border-gray-800 px-3 py-2 text-gray-200"
                        >
                            <option value="viewer">Viewer</option>
                            <option value="developer">Developer</option>
                            <option value="owner">Owner</option>
                        </select>

                        <button
                            onClick={assignUser}
                            disabled={assigning}
                            className="rounded-md bg-white text-black px-4 py-2 hover:bg-gray-200 disabled:opacity-50"
                        >
                            {assigning ? "Assigning..." : "Assign"}
                        </button>
                    </div>
                </section>

                {/* FOOTER */}
                <div className="mt-8">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-gray-400 hover:text-white transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </main>
        </div>
    );
}
