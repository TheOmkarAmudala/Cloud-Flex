"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";

export default function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        api.get(`/projects/${id}`).then(res => setProject(res.data));
    }, [id]);

    if (!project) return <p>Loading...</p>;

    return (
        <div>
            <h1>{project.name}</h1>

            <h3>Assigned Users</h3>
            {project.users.map((u: any) => (
                <p key={u.id}>{u.email} - {u.role}</p>
            ))}

            <button
                onClick={() =>
                    api.post(`/projects/${id}/users`, {
                        user_id: 2,
                        role: "developer"
                    })
                }
            >
                Assign User
            </button>
        </div>
    );
}
