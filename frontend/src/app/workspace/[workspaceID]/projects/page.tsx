"use client";
import { use } from "react";


export default function ProjectsPage({params}: {params: Promise<{ workspaceID: string }>}) {
    const { workspaceID } = use(params);
    return (
        <div>
            <h1>Projects {workspaceID}</h1>
        </div>
    );
}