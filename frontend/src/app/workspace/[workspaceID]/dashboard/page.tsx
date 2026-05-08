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
  priority: "High" | "Medium" | "Low";
  due: string;
  done?: boolean;
}
const PRIORITY_STYLE: Record<string, { bg: string; color: string }> = {
  High:   { bg: "#FEF2F2", color: "#DC2626" },
  Medium: { bg: "#FFFBEB", color: "#D97706" },
  Low:    { bg: "#F0FDF4", color: "#16A34A" },
};
function TaskRow({ title, priority, due, done }: TaskRowProps) {
  const ps = PRIORITY_STYLE[priority];
  return (
    <div
      className="flex items-center gap-3 py-3 hover:bg-[#F4F3F0] transition-colors rounded-lg px-2 -mx-2 cursor-default"
      style={{ borderBottom: "1px solid #F0EEE9" }}
    >
      {/* Checkbox */}
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


export default async function WorkspaceDashboard({ params }: { params: Promise<{ workspaceID: string }> }) {
  const { user } = useAuth()!;
  const { workspaceID } = use(params);
  const [singleWorkspaceData,setSingleWorkspaceData] = useState<any>([]);
 

  useEffect(() => {
    async function getSingleWorkspaceData() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/workspace/${workspaceID}`,
        { withCredentials: true },
      );
      console.log(response);
      setSingleWorkspaceData(response.data.workspaceData);
    }
    getSingleWorkspaceData();
  }, []);

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
        Good morning, {singleWorkspaceData?.workspace.title} 👋
      </h1>

      {/* Stat cards */}
      <div className="flex gap-4 mb-8" style={{ flexWrap: "wrap" }}>
        <StatCard label="Active Projects" value="12" sub="+2 this week" subColor="#16A34A" />
        <StatCard label="Open Tasks"      value="34" sub="8 due today"  subColor="#D97706" />
        <StatCard label="Team Members"    value="9"  sub="2 online now" subColor="#9A9890" />
        <StatCard label="Completed"       value="87%" sub="this month"  subColor="#6C5CE7" />
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
            Recent Activity
          </h2>
          <p style={{ fontSize: 11, color: "#9A9890", marginBottom: 12 }}>
            Latest updates across the workspace
          </p>
          <ActivityRow
            initials="JS" avatarColor="#6C5CE7"
            action="Jai Saini created a new task in Website Redesign"
            time="2 min ago"
          />
          <ActivityRow
            initials="AR" avatarColor="#00B894"
            action="Arya R. moved 'API Auth' to In Review"
            time="14 min ago"
          />
          <ActivityRow
            initials="MK" avatarColor="#E17055"
            action="Mia K. commented on Mobile App v2 sprint"
            time="1 hr ago"
          />
          <ActivityRow
            initials="TL" avatarColor="#FDCB6E" 
            action="Team added 2 new members to Shipyard"
            time="3 hrs ago"
          />
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
          <TaskRow title="Finalize homepage redesign wireframes" priority="High"   due="Today" />
          <TaskRow title="Review pull request for auth module"    priority="High"   due="Today" />
          <TaskRow title="Write API integration docs"             priority="Medium" due="May 9" />
          <TaskRow title="Update onboarding copy"                 priority="Low"    due="May 12" />
          <TaskRow title="Set up CI/CD pipeline"                  priority="Medium" due="May 8" done />
        </div>
      </div>
    </div>
  );
}