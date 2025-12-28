"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import AssignUserModal from "@/components/AssignUserModal";

export default function ProjectDetails() {
    const { id } = useParams();
    const router = useRouter();

    const [project, setProject] = useState<any>(null);
    const [me, setMe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showAssign, setShowAssign] = useState(false);

    const fetchData = async () => {
        try {
            const [projectRes, meRes] = await Promise.all([
                api.get(`/projects/${id}`),
                api.get("/auth/me"),
            ]);

            setProject(projectRes.data);
            setMe(meRes.data);
        } catch {
            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
                Loading project...
            </div>
        );
    }

    const isAdminOrOwner =
        me.globalRole === "admin" ||
        project.projectUsers.some(
            (pu: any) => pu.user.id === me.id && pu.role === "owner"
        );

    const updateRole = async (userId: string, role: string) => {
        await api.put(`/projects/${id}/users/${userId}`, { role });
        fetchData();
    };

    const removeUser = async (userId: string) => {
        if (!confirm("Remove user from project?")) return;
        await api.delete(`/projects/${id}/users/${userId}`);
        fetchData();
    };

    return (
        <div className="min-h-screen bg-black text-gray-200">
            <main className="max-w-5xl mx-auto px-6 py-10">
                {/* HEADER */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold text-white">
                            {project.name}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage users and roles
                        </p>
                    </div>

                    {isAdminOrOwner && (
                        <button
                            onClick={() => setShowAssign(true)}
                            className="px-4 py-2 rounded-md bg-white text-black font-medium hover:bg-gray-200 transition"
                        >
                            + Assign User
                        </button>
                    )}
                </div>

                {/* USERS CARD */}
                <section className="rounded-xl border border-gray-800 bg-gray-950 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Assigned Users
                    </h2>

                    {project.projectUsers.length === 0 ? (
                        <p className="text-gray-500">
                            No users assigned to this project.
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-800">
                            {project.projectUsers.map((pu: any) => (
                                <li
                                    key={pu.id}
                                    className="flex justify-between items-center py-3"
                                >
                                    <div>
                                        <p className="text-gray-200">
                                            {pu.user.email}
                                        </p>
                                    </div>

                                    {isAdminOrOwner ? (
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={pu.role}
                                                onChange={(e) =>
                                                    updateRole(
                                                        pu.user.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-md bg-black border border-gray-800 px-2 py-1 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                                            >
                                                <option value="owner">
                                                    Owner
                                                </option>
                                                <option value="developer">
                                                    Developer
                                                </option>
                                                <option value="viewer">
                                                    Viewer
                                                </option>
                                            </select>

                                            <button
                                                onClick={() =>
                                                    removeUser(pu.user.id)
                                                }
                                                className="text-sm text-red-400 hover:text-red-300 transition"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs uppercase tracking-wide px-3 py-1 rounded-full border border-gray-700 text-gray-400">
                                            {pu.role}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
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

            {showAssign && (
                <AssignUserModal
                    projectId={id as string}
                    onClose={() => setShowAssign(false)}
                    onSuccess={fetchData}
                />
            )}
        </div>
    );
}
