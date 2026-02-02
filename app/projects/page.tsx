"use client";

import { useEffect, useState } from "react";
import { request } from "@/lib/http";
import { getProfileMaster } from "@/lib/profileMasterService";

interface Project {
    id: number;
    title: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const fetchProjects = async () => {
        try {
            const response = await getProfileMaster();
            if (response && response.data && response.data.data && response.data.data.projects) {
                setProjects(response.data.data.projects);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Projects</h1>
            {projects.map(p => (
                <p key={p.id}>{p.title}</p>
            ))}
        </div>
    );
}
