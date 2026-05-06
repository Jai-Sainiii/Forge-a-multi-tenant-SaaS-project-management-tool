"use client";
import { useAuth } from "@/authContext/AuthContext";

export default function Workspace() {
  const {user} = useAuth()!;

  return (
    <div>
      <h1>Workspace Specially for you {user?.name}</h1>
    </div>
  );
}