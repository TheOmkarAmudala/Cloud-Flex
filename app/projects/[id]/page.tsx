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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
            return;
        }

        api
            .get(`/projects/${id}`)
            .then((res) => setProject(res.data))
            .catch(() => {
                alert("Project not found");
                router.replace("/dashboard");
            })
            .finally(() => setLoading(false));
    }, [id]);

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
                    <div>
                        <h1 className="text-3xl font-semibold text-white">
                            {project.name}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Project details & members
                        </p>
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
