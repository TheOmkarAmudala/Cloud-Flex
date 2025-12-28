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


    if (loading) return <p>Loading dashboard...</p>;

    return (
        <div style={{ padding: 20 }}>
            <header style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>Dashboard</h1>
                <LogoutButton />
            </header>

            <hr />

            <section>
                <h2>Your Projects</h2>

                <button onClick={() => setShowModal(true)}>
                    + Create Project
                </button>

                {projects.length === 0 && <p>No projects found</p>}

                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>
                            <Link href={`/projects/${project.id}`}>
                                {project.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

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
