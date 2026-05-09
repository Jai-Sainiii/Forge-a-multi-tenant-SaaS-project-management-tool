/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { use } from "react";

import { useAuth } from "@/authContext/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";


interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  subColor: string;
}
function StatCard({ label, value, sub, subColor }: StatCardProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E6E0",
        borderRadius: 10,
        padding: "16px 20px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 500, color: "#9A9890", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 600, color: "#1A1918", lineHeight: 1.1, marginBottom: 4 }}>
        {value}
      </p>
      <p style={{ fontSize: 12, color: subColor, fontWeight: 500 }}>{sub}</p>
    </div>
  );
}


interface ActivityRowProps {
  initials: string;
  avatarColor: string;
  action: string;
  time: string;
}
function ActivityRow({ initials, avatarColor, action, time }: ActivityRowProps) {
  return (
    <div
      className="flex items-center gap-3 py-3 hover:bg-[#F4F3F0] transition-colors rounded-lg px-2 -mx-2 cursor-default"
      style={{ borderBottom: "1px solid #F0EEE9" }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: avatarColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <span style={{ fontSize: 13, color: "#4A4845", flex: 1 }}>{action}</span>
      <span style={{ fontSize: 11, color: "#9A9890", whiteSpace: "nowrap" }}>{time}</span>
    </div>
  );
}


interface TaskRowProps {
  title: string;
  priority: string;
  due: string;
  done?: boolean;
}
const PRIORITY_STYLE: Record<string, { bg: string; color: string }> = {
  High:   { bg: "#FEF2F2", color: "#DC2626" },
  Medium: { bg: "#FFFBEB", color: "#D97706" },
  Low:    { bg: "#F0FDF4", color: "#16A34A" },
};
function TaskRow({ title, priority, due, done }: TaskRowProps) {
  const ps = PRIORITY_STYLE[priority] || PRIORITY_STYLE["Low"];
  return (
    <div
      className="flex items-center gap-3 py-3 hover:bg-[#F4F3F0] transition-colors rounded-lg px-2 -mx-2 cursor-default"
      style={{ borderBottom: "1px solid #F0EEE9" }}
    >
      
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: done ? "none" : "1.5px solid #D1CECC",
          background: done ? "#6C5CE7" : "transparent",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {done && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span
        style={{
          flex: 1,
          fontSize: 13,
          color: done ? "#9A9890" : "#1A1918",
          textDecoration: done ? "line-through" : "none",
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: 999,
          background: ps.bg,
          color: ps.color,
          marginRight: 8,
        }}
      >
        {priority}
      </span>
      <span style={{ fontSize: 11, color: "#9A9890" }}>{due}</span>
    </div>
  );
}


export default function WorkspaceDashboard({ params }: { params: Promise<{ workspaceID: string }> }) {
  const { user } = useAuth()!;
  const { workspaceID } = use(params);
  const [singleWorkspaceData, setSingleWorkspaceData] = useState<object>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  
 

  useEffect(() => {
    async function getSingleWorkspaceData() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/workspace/${workspaceID}`,
        { withCredentials: true },
      );
    //   console.log(response.data.workspaceData);
      setSingleWorkspaceData(response.data.workspaceData);
      setWorkspace(response.data.workspaceData.workspace);
      setProjects(response.data.workspaceData.projects);
      setTasks(response.data.workspaceData.tasks);
      setMembers(response.data.workspaceData.members);
    }
    getSingleWorkspaceData();
  }, [workspaceID]);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      {/* Greeting */}
      <h1
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: "#1A1918",
          marginBottom: 24,
          lineHeight: 1.3,
        }}
      >
        Good morning, {user?.name} 👋
      </h1>

      {/* Stat cards */}
      <div className="flex gap-4 mb-8" style={{ flexWrap: "wrap" }}>
        <StatCard label="Active Projects" value={projects?.length?.toString() || "0"} sub="" subColor="#16A34A" />
        <StatCard label="Open Tasks"      value={tasks?.filter((t: any) => t.status !== "done").length?.toString() || "0"} sub=""  subColor="#D97706" />
        <StatCard label="Team Members"    value={members?.length?.toString() || "0"}  sub="" subColor="#9A9890" />
        <StatCard label="Completed Tasks" value={tasks?.length > 0 ? `${Math.round((tasks.filter((t: any) => t.status === "done").length / tasks.length) * 100)}%` : "0%"} sub=""  subColor="#6C5CE7" />
      </div>

      
      <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>

        
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E6E0",
            borderRadius: 10,
            padding: "20px 20px 8px",
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1A1918",
              marginBottom: 4,
              letterSpacing: "-0.01em",
            }}
          >
            Recent Projects
          </h2>
          <p style={{ fontSize: 11, color: "#9A9890", marginBottom: 12 }}>
            Latest projects across the workspace
          </p>
          {projects && projects.length > 0 ? (
            projects.slice(0, 5).map((project: any, i: number) => {
              const colors = ["#6C5CE7", "#00B894", "#E17055", "#FDCB6E"];
              const initials = project.name.substring(0, 2).toUpperCase();
              return (
                <ActivityRow
                  key={project.id}
                  initials={initials}
                  avatarColor={colors[i % colors.length]}
                  action={`Project ${project.name} was created`}
                  time={new Date(project.createdAt).toLocaleDateString()}
                />
              );
            })
          ) : (
            <p style={{ fontSize: 13, color: "#9A9890" }}>No recent projects.</p>
          )}
        </div>

        
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E6E0",
            borderRadius: 10,
            padding: "20px 20px 8px",
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1A1918",
              marginBottom: 4,
              letterSpacing: "-0.01em",
            }}
          >
            My Tasks
          </h2>
          <p style={{ fontSize: 11, color: "#9A9890", marginBottom: 12 }}>
            Tasks assigned to you
          </p>
          {tasks && tasks.length > 0 ? (
            tasks.slice(0, 5).map((task: any) => (
              <TaskRow 
                key={task.id}
                title={task.title} 
                priority={task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : "Medium"} 
                due={new Date(task.createdAt).toLocaleDateString()} 
                done={task.status === "done" || task.status === "completed"} 
              />
            ))
          ) : (
            <p style={{ fontSize: 13, color: "#9A9890" }}>No tasks yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}