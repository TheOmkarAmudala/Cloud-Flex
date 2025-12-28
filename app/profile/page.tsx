"use client";

import {
    useEffect,
    useState
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

type Project = {
    id: string;
    name: string;
    role: string;
};

type Profile = {
    id: string;
    email: string;
    globalRole: string;
    clientId: string;
    projects: Project[];
};

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
            return;
        }

        api
            .get("/auth/me")
            .then((res) => setProfile(res.data))
            .catch(() => {
                localStorage.removeItem("token");
                router.replace("/login");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-6">Loading profile...</p>;
    if (!profile) return null;

    return (
        <div className="min-h-screen bg-black text-gray-200 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-semibold text-white mb-6">
                    My Profile
                </h1>

                {/* USER INFO */}
                <div className="mb-8 rounded-lg border border-gray-800 bg-gray-950 p-6">
                    <p className="mb-2">
                        <span className="text-gray-400">Email:</span>{" "}
                        {profile.email}
                    </p>
                    <p className="mb-2">
                        <span className="text-gray-400">Global Role:</span>{" "}
                        {profile.globalRole}
                    </p>
                    <p>
                        <span className="text-gray-400">Client ID:</span>{" "}
                        {profile.clientId}
                    </p>
                </div>

                {/* PROJECTS */}
                <h2 className="text-xl font-semibold mb-4">
                    Assigned Projects
                </h2>

                {profile.projects.length === 0 && (
                    <p className="text-gray-500">
                        You are not assigned to any projects.
                    </p>
                )}

                <ul className="space-y-3">
                    {profile.projects.map((project) => (
                        <li
                            key={project.id}
                            className="flex items-center justify-between rounded-md border border-gray-800 bg-gray-950 px-4 py-3"
                        >
                            <div>
                                <p className="text-white font-medium">
                                    {project.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Role: {project.role}
                                </p>
                            </div>

                            <Link
                                href={`/projects/${project.id}`}
                                className="text-sm text-white hover:underline"
                            >
                                View →
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* BACK */}
                <div className="mt-8">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-sm text-gray-400 hover:text-white"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
