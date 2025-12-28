"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import CreateProjectModal from "@/components/CreateProjectModal";

type Project = {
    id: string;
    name: string;
};

export default function Dashboard() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const fetchProjects = async () => {
        try {
            const res = await api.get("/projects");
            setProjects(res.data);
        } catch {
            localStorage.removeItem("token");
            router.replace("/login");
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
        fetchProjects();
    }, []);

    const handleCreateProject = async (name: string) => {
        try {
            setCreating(true);
            await api.post("/projects", { name });
            setShowModal(false);
            await fetchProjects();
        } catch (err: any) {
            if (err.response?.status === 409) {
                alert(err.response.data.message);
            } else {
                alert("Failed to create project");
            }
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-gray-200">
            {/* HEADER */}
            <header className="border-b border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-white">
                        Dashboard
                    </h1>
                    <LogoutButton />
                </div>
            </header>

            {/* MAIN */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-300">
                        Your Projects
                    </h2>

                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 rounded-md bg-white text-black font-medium hover:bg-gray-200 transition"
                    >
                        + Create Project
                    </button>
                </div>

                {/* PROJECT LIST */}
                {projects.length === 0 ? (
                    <div className="border border-gray-800 rounded-lg p-10 text-center text-gray-500">
                        No projects found. Create your first project 🚀
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <li key={project.id}>
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="block border border-gray-800 rounded-lg p-5 hover:border-gray-600 hover:bg-gray-900 transition"
                                >
                                    <h3 className="text-lg font-semibold text-white">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Open project →
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            {showModal && (
                <CreateProjectModal
                    onClose={() => setShowModal(false)}
                    onCreate={handleCreateProject}
                    loading={creating}
                />
            )}
        </div>
    );
}
