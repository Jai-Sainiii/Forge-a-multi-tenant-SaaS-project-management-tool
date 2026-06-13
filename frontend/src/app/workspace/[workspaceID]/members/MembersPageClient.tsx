"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Search,
  AlertCircle,
  Users,
  Mail,
  Shield,
  UserPlus,
  UserMinus,
  Circle,
  ChevronDown,
  X,
  Copy,
  Check,
  Clock,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getWorkspaceMembers, updateMemberRole, removeMember, generateInvite } from "@/app/actions/member";
import { getWorkspaceTeams, createTeam, addTeamMember, updateTeamMember, deleteTeamMember } from "@/app/actions/team";
import { getProjects } from "@/app/actions/project";

interface UserInfo {
  name: string;
  email: string;
}

interface Member {
  id: number;
  userId: number;
  workspaceId: number;
  isActive: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  user: UserInfo;
}

interface MembersPageClientProps {
  workspaceID: string;
  initialMembers: Member[];
  initialTeams: any[];
  initialProjects: any[];
  currentUser: any;
  isAdmin: boolean;
  isOwner: boolean;
}

export default function MembersPageClient({
  workspaceID,
  initialMembers,
  initialTeams,
  initialProjects,
  currentUser,
  isAdmin,
  isOwner,
}: MembersPageClientProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedTeamForAdd, setSelectedTeamForAdd] = useState<any>(null);
  const [addMemberUserId, setAddMemberUserId] = useState<string>("");
  const [addMemberPosition, setAddMemberPosition] = useState<string>("");
  const [addMemberRole, setAddMemberRole] = useState<string>("member");
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [addMemberError, setAddMemberError] = useState<string | null>(null);

  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [selectedTeamMemberForEdit, setSelectedTeamMemberForEdit] = useState<any>(null);
  const [editMemberPosition, setEditMemberPosition] = useState<string>("");
  const [editMemberRole, setEditMemberRole] = useState<string>("member");
  const [editMemberLoading, setEditMemberLoading] = useState(false);
  const [editMemberError, setEditMemberError] = useState<string | null>(null);

  const [isEditWorkspaceMemberModalOpen, setIsEditWorkspaceMemberModalOpen] = useState(false);
  const [selectedWorkspaceMemberForEdit, setSelectedWorkspaceMemberForEdit] = useState<Member | null>(null);
  const [editWorkspaceMemberRole, setEditWorkspaceMemberRole] = useState<string>("member");
  const [editWorkspaceMemberLoading, setEditWorkspaceMemberLoading] = useState(false);
  const [editWorkspaceMemberError, setEditWorkspaceMemberError] = useState<string | null>(null);

  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [removeMemberLoading, setRemoveMemberLoading] = useState(false);
  const [removeMemberError, setRemoveMemberError] = useState<string | null>(null);

  const [isRemoveTeamMemberModalOpen, setIsRemoveTeamMemberModalOpen] = useState(false);
  const [teamMemberToRemove, setTeamMemberToRemove] = useState<any>(null);
  const [removeTeamMemberLoading, setRemoveTeamMemberLoading] = useState(false);
  const [removeTeamMemberError, setRemoveTeamMemberError] = useState<string | null>(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState("member");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [createTeamProjectId, setCreateTeamProjectId] = useState<string>("");
  const [createTeamName, setCreateTeamName] = useState<string>("");
  const [createTeamLoading, setCreateTeamLoading] = useState(false);
  const [createTeamError, setCreateTeamError] = useState<string | null>(null);

  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [teams, setTeams] = useState<any[]>(initialTeams);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWorkspaceMembers(workspaceID);
      if (res.success) {
        setMembers(res.members || []);
      } else {
        setError("Failed to load members.");
      }
    } catch {
      setError("Failed to load members. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [workspaceID]);

  const fetchTeams = useCallback(async () => {
    setTeamsLoading(true);
    setTeamsError(null);
    try {
      const res = await getWorkspaceTeams(workspaceID);
      if (res.success) {
        setTeams(res.teams || []);
      } else {
        setTeamsError("Failed to load teams.");
      }
    } catch {
      setTeamsError("Failed to load teams. Please try again.");
    } finally {
      setTeamsLoading(false);
    }
  }, [workspaceID]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTeamProjectId || !createTeamName.trim()) return;
    setCreateTeamLoading(true);
    setCreateTeamError(null);
    try {
      const res = await createTeam(createTeamProjectId, createTeamName.trim());
      if (res.success && res.team) {
        setIsCreateTeamModalOpen(false);
        setCreateTeamName("");
        setCreateTeamProjectId("");
        fetchTeams();
      } else {
        setCreateTeamError(res.message || "Failed to create team.");
      }
    } catch (err: any) {
      setCreateTeamError("Failed to create team.");
    } finally {
      setCreateTeamLoading(false);
    }
  };

  const handleAddTeamMember = async () => {
    if (!selectedTeamForAdd || !addMemberUserId) return;
    setAddMemberLoading(true);
    setAddMemberError(null);
    try {
      const res = await addTeamMember(selectedTeamForAdd.id, {
        userId: Number(addMemberUserId),
        position: addMemberPosition,
        role: addMemberRole,
      });
      if (res.success) {
        setIsAddMemberModalOpen(false);
        setAddMemberUserId("");
        setAddMemberPosition("");
        setAddMemberRole("member");
        fetchTeams();
      } else {
        setAddMemberError(res.message || "Failed to add member.");
      }
    } catch {
      setAddMemberError("Failed to add team member.");
    } finally {
      setAddMemberLoading(false);
    }
  };

  const handleEditTeamMember = async () => {
    if (!selectedTeamMemberForEdit) return;
    setEditMemberLoading(true);
    setEditMemberError(null);
    try {
      const res = await updateTeamMember(selectedTeamMemberForEdit.id, {
        position: editMemberPosition,
        role: editMemberRole,
      });
      if (res.success) {
        setIsEditMemberModalOpen(false);
        setSelectedTeamMemberForEdit(null);
        setEditMemberPosition("");
        setEditMemberRole("member");
        fetchTeams();
      } else {
        setEditMemberError(res.message || "Failed to update member.");
      }
    } catch {
      setEditMemberError("Failed to update team member.");
    } finally {
      setEditMemberLoading(false);
    }
  };

  const confirmRemoveTeamMember = async () => {
    if (!teamMemberToRemove) return;
    setRemoveTeamMemberLoading(true);
    setRemoveTeamMemberError(null);
    try {
      const res = await deleteTeamMember(teamMemberToRemove.id);
      if (res.success) {
        setIsRemoveTeamMemberModalOpen(false);
        setTeamMemberToRemove(null);
        fetchTeams();
      } else {
        setRemoveTeamMemberError(res.message || "Failed to remove member.");
      }
    } catch {
      setRemoveTeamMemberError("Failed to remove team member.");
    } finally {
      setRemoveTeamMemberLoading(false);
    }
  };

  const handleUpdateWorkspaceMemberRole = async () => {
    if (!selectedWorkspaceMemberForEdit) return;
    setEditWorkspaceMemberLoading(true);
    setEditWorkspaceMemberError(null);
    try {
      const res = await updateMemberRole(workspaceID, {
        userId: selectedWorkspaceMemberForEdit.userId,
        role: editWorkspaceMemberRole,
      });
      if (res.success) {
        setIsEditWorkspaceMemberModalOpen(false);
        setSelectedWorkspaceMemberForEdit(null);
        setEditWorkspaceMemberRole("member");
        fetchMembers();
      } else {
        setEditWorkspaceMemberError(res.message || "Failed to update member role.");
      }
    } catch {
      setEditWorkspaceMemberError("Failed to update member role.");
    } finally {
      setEditWorkspaceMemberLoading(false);
    }
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;
    setRemoveMemberLoading(true);
    setRemoveMemberError(null);
    try {
      const res = await removeMember(workspaceID, memberToRemove.userId);
      if (res.success) {
        setIsRemoveMemberModalOpen(false);
        setMemberToRemove(null);
        fetchMembers();
        fetchTeams();
      } else {
        setRemoveMemberError(res.message || "Failed to remove member");
      }
    } catch {
      setRemoveMemberError("Failed to remove member");
    } finally {
      setRemoveMemberLoading(false);
    }
  };

  const handleGenerateInvite = async () => {
    setGeneratingLink(true);
    setInviteError(null);
    setGeneratedLink(null);
    try {
      const res = await generateInvite(workspaceID, inviteRole);
      if (res.success && res.inviteUrl) {
        setGeneratedLink(res.inviteUrl);
      } else {
        setInviteError(res.message || "Failed to generate invite link.");
      }
    } catch {
      setInviteError("Failed to generate invite link.");
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedTeams = teams.reduce((acc: Record<number, { projectName: string; teams: any[] }>, team) => {
    const projectId = team.projectId;
    const projectName = team.project?.name || "Other Teams";
    if (!acc[projectId]) {
      acc[projectId] = {
        projectName,
        teams: [],
      };
    }
    acc[projectId].teams.push(team);
    return acc;
  }, {});

  const adminCount = members.filter(
    (m) => m.role?.toLowerCase() === "admin",
  ).length;
  const memberCount = members.filter(
    (m) => m.role?.toLowerCase() === "member",
  ).length;
  const viewerCount = members.filter(
    (m) => m.role?.toLowerCase() === "viewer",
  ).length;

  return (
    <main className="max-w-7xl mx-auto px-6 py-6 space-y-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 text-red-500" />
          {error}
          <button
            onClick={fetchMembers}
            className="ml-auto px-3 py-1 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant dark:border-gray-700 pb-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-light" />
            Members
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage who has access to this workspace.
          </p>
        </div>
        <button 
          onClick={() => {
            setIsInviteModalOpen(true);
            setGeneratedLink(null);
            setInviteError(null);
          }}
          className="flex items-center gap-2 bg-black dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black border border-transparent dark:border-zinc-800 px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white sm:text-sm transition-colors"
          />
        </div>
        {!loading && !error && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredMembers.length}{" "}
            {filteredMembers.length === 1 ? "member" : "members"}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1e293b] divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="ml-4 w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right"><div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-md inline-block"></div></td>
                  </tr>
                ))
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Users className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-base font-medium text-gray-900 dark:text-white">No members found</p>
                    <p className="text-sm mt-1">We couldn't find any members matching your search.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-medium text-sm border border-zinc-200 dark:border-zinc-700">
                          {member.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{member.user?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                        {member.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {member.role?.toLowerCase() === "admin" || member.role?.toLowerCase() === "owner" ? (
                          <Shield className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 mr-1.5" />
                        ) : null}
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{member.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        member.isActive
                          ? "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                      }`}>
                        <Circle className={`w-1.5 h-1.5 fill-current ${member.isActive ? "text-[#0D9488]" : "text-gray-400"}`} />
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isOwner && member.user?.email !== currentUser?.email ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWorkspaceMemberForEdit(member);
                              setEditWorkspaceMemberRole(member.role || "member");
                              setEditWorkspaceMemberError(null);
                              setIsEditWorkspaceMemberModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:text-white dark:hover:text-black border border-zinc-200 dark:border-zinc-700 hover:bg-black dark:hover:bg-white rounded-md transition-all duration-200 cursor-pointer shadow-sm"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            Change Role
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMemberToRemove(member);
                              setRemoveMemberError(null);
                              setIsRemoveMemberModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-white border border-red-200 hover:border-red-600 bg-red-50 hover:bg-red-600 rounded-md transition-all duration-200 cursor-pointer shadow-sm"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && !error && members.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Admins</span>
            <span className="text-lg font-medium text-gray-900 dark:text-white">{adminCount}</span>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Members</span>
            <span className="text-lg font-medium text-gray-900 dark:text-white">{memberCount}</span>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Viewers</span>
            <span className="text-lg font-medium text-gray-900 dark:text-white">{viewerCount}</span>
          </div>
        </div>
      )}

      <div className="pt-8 border-t border-outline-variant dark:border-gray-700 mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
          <div>
            <h2 className="text-2xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-primary-light" />
              Project Teams
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview of all teams across your projects.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => {
                setIsCreateTeamModalOpen(true);
                setCreateTeamName("");
                setCreateTeamProjectId("");
                setCreateTeamError(null);
              }}
              className="flex items-center gap-2 bg-black dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black border border-transparent dark:border-zinc-800 px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Team
            </button>
          )}
        </div>

        {teamsError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 flex items-center gap-3 text-red-700 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500" />
            {teamsError}
            <button onClick={fetchTeams} className="ml-auto px-3 py-1 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Retry</button>
          </div>
        )}

        <div className="mt-6">
          {teamsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg p-5 animate-pulse">
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : teams.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg">
              <Users className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-base font-medium text-gray-900 dark:text-white">No teams found</p>
              <p className="text-sm mt-1">There are no teams created in your projects yet.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.values(groupedTeams).map((group: any, groupIndex) => (
                <div key={groupIndex} className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white border-l-4 border-black dark:border-white pl-3 capitalize tracking-wide">
                    {group.projectName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.teams.map((team: any) => (
                      <div key={team.id} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all hover:border-zinc-400 dark:hover:border-zinc-500">
                        <div className="p-5 cursor-pointer flex justify-between items-center" onClick={() => setExpandedTeamId(expandedTeamId === team.id ? null : team.id)}>
                          <div>
                            <h4 className="text-base font-medium text-gray-900 dark:text-white">{team.teamName}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{group.projectName}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{team.teamMembers?.length || 0}</span>
                            {isAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTeamForAdd(team);
                                  setAddMemberUserId("");
                                  setAddMemberPosition("");
                                  setAddMemberRole("member");
                                  setAddMemberError(null);
                                  setIsAddMemberModalOpen(true);
                                }}
                                className="flex items-center justify-center p-1 text-zinc-900 dark:text-zinc-100 hover:text-white dark:hover:text-black hover:bg-black dark:hover:bg-white rounded-md transition-all cursor-pointer"
                                title="Add Team Member"
                              >
                                <UserPlus className="w-4 h-4" />
                              </button>
                            )}
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedTeamId === team.id ? "rotate-180" : ""}`} />
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedTeamId === team.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
                            >
                              <div className="p-2 bg-gray-50/50 dark:bg-[#0f172a]/50">
                                {team.teamMembers?.length > 0 ? (
                                  <div className="space-y-1">
                                    {team.teamMembers.map((member: any, i: number) => (
                                      <div key={i} className="group flex items-center justify-between p-3 hover:bg-white dark:hover:bg-[#1e293b] rounded-md transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                        <div className="flex items-center gap-3">
                                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-medium text-sm border border-zinc-200 dark:border-zinc-700">
                                            {member.user?.name?.charAt(0).toUpperCase() || "?"}
                                          </div>
                                          <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{member.user?.name || "Unknown User"}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{member.user?.email}</div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <div className="text-right flex flex-col items-end">
                                            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{member.role}</span>
                                            <span className="text-xs text-gray-700 dark:text-gray-300 capitalize mt-0.5">{member.position}</span>
                                          </div>
                                          {isAdmin && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedTeamMemberForEdit(member);
                                                  setEditMemberPosition(member.position || "");
                                                  setEditMemberRole(member.role || "member");
                                                  setIsEditMemberModalOpen(true);
                                                }}
                                                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                                                title="Edit Role & Position"
                                              >
                                                <Shield className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setTeamMemberToRemove({
                                                    id: member.id,
                                                    userName: member.user?.name || "Unknown User",
                                                    teamName: team.teamName
                                                  });
                                                  setRemoveTeamMemberError(null);
                                                  setIsRemoveTeamMemberModalOpen(true);
                                                }}
                                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-955/40 rounded-md transition-colors cursor-pointer"
                                                title="Remove from Team"
                                              >
                                                <X className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-sm text-center text-gray-500 dark:text-gray-400 py-6">No members in this team.</div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                Invite Member
              </h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {!generatedLink ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["member", "admin", "viewer"].map((role) => (
                        <button
                          key={role}
                          onClick={() => setInviteRole(role)}
                          className={`px-3 py-2 text-xs font-medium rounded-md border transition-all cursor-pointer capitalize ${
                            inviteRole === role
                              ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
                      {inviteRole === "admin" && "Admins can manage projects, tasks, and members."}
                      {inviteRole === "member" && "Members can create and manage their own tasks."}
                      {inviteRole === "viewer" && "Viewers have read-only access to the workspace."}
                    </p>
                  </div>

                  {inviteError && (
                    <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-100 dark:border-red-900/20">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      {inviteError}
                    </div>
                  )}

                  <button
                    onClick={handleGenerateInvite}
                    disabled={generatingLink}
                    className="w-full bg-black dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black border border-transparent dark:border-zinc-800 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {generatingLink ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        Generate Invite Link
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">Invite link generated successfully!</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Share this link</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 font-mono truncate select-all">
                        {generatedLink}
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className={`p-2.5 rounded-lg border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                          copySuccess
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        {copySuccess ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    This link is single-use and will expire in 24 hours.
                  </div>

                  <button
                    onClick={() => setGeneratedLink(null)}
                    className="w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
                  >
                    Generate another link
                  </button>
                </div>
              )}
            </div>
            
            {!generatedLink && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-center">
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Invited people will join the workspace as <strong>{inviteRole}</strong>.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {isAddMemberModalOpen && selectedTeamForAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                Add Member
              </h3>
              <button onClick={() => setIsAddMemberModalOpen(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Workspace Member</label>
                <select
                  value={addMemberUserId}
                  onChange={(e) => setAddMemberUserId(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white sm:text-sm"
                >
                  <option value="">-- Choose a Member --</option>
                  {members
                    .filter((m) => m.isActive)
                    .map((m) => (
                      <option key={m.userId} value={m.userId}>
                        {m.user?.name} ({m.user?.email})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Engineer, Product Designer"
                  value={addMemberPosition}
                  onChange={(e) => setAddMemberPosition(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                <div className="grid grid-cols-4 gap-2">
                  {["member", "admin", "viewer", "tester"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setAddMemberRole(role)}
                      className={`px-3 py-2 text-xs font-medium rounded-md border transition-all cursor-pointer capitalize ${
                        addMemberRole === role
                          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {addMemberError && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-100 dark:border-red-900/20">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  {addMemberError}
                </div>
              )}

              <button
                onClick={handleAddTeamMember}
                disabled={addMemberLoading || !addMemberUserId}
                className="w-full bg-black dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black border border-transparent dark:border-zinc-800 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {addMemberLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Member"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Member Modal */}
      {isEditMemberModalOpen && selectedTeamMemberForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                Edit Team Member Details
              </h3>
              <button onClick={() => setIsEditMemberModalOpen(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
                                                
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-semibold border border-zinc-200 dark:border-zinc-700">
                  {selectedTeamMemberForEdit.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{selectedTeamMemberForEdit.user?.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedTeamMemberForEdit.user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Designer"
                  value={editMemberPosition}
                  onChange={(e) => setEditMemberPosition(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                <div className="grid grid-cols-4 gap-2">
                  {["member", "admin", "viewer", "tester"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setEditMemberRole(role)}
                      className={`px-3 py-2 text-xs font-medium rounded-md border transition-all cursor-pointer capitalize ${
                        editMemberRole === role
                          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {editMemberError && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-100 dark:border-red-900/20">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  {editMemberError}
                </div>
              )}

              <button
                onClick={handleEditTeamMember}
                disabled={editMemberLoading}
                className="w-full bg-black dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black border border-transparent dark:border-zinc-800 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {editMemberLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {isCreateTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                Create New Team
              </h3>
              <button onClick={() => setIsCreateTeamModalOpen(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Project</label>
                <select
                  required
                  value={createTeamProjectId}
                  onChange={(e) => setCreateTeamProjectId(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white sm:text-sm"
                >
                  <option value="">-- Select a Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design System Team, QA Engineers"
                  value={createTeamName}
                  onChange={(e) => setCreateTeamName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white sm:text-sm"
                />
              </div>

              {createTeamError && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-100 dark:border-red-900/20">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  {createTeamError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateTeamModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTeamLoading || !createTeamProjectId || !createTeamName.trim()}
                  className="bg-black dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black border border-transparent dark:border-zinc-800 px-4 py-2 rounded-md font-medium text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {createTeamLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Team"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Workspace Member Role Modal */}
      {isEditWorkspaceMemberModalOpen && selectedWorkspaceMemberForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                Change Workspace Member Role
              </h3>
              <button onClick={() => setIsEditWorkspaceMemberModalOpen(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-semibold border border-zinc-200 dark:border-zinc-700">
                  {selectedWorkspaceMemberForEdit.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWorkspaceMemberForEdit.user?.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedWorkspaceMemberForEdit.user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workspace Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {["member", "admin", "viewer", "tester"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setEditWorkspaceMemberRole(role)}
                      className={`px-3 py-2 text-xs font-medium rounded-md border transition-all cursor-pointer capitalize ${
                        editWorkspaceMemberRole === role
                          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
                  {editWorkspaceMemberRole === "admin" && "Admins can manage projects, tasks, and members."}
                  {editWorkspaceMemberRole === "member" && "Members can create and manage their own tasks."}
                  {editWorkspaceMemberRole === "viewer" && "Viewers have read-only access to the workspace."}
                  {editWorkspaceMemberRole === "tester" && "Testers can participate in standard testing processes."}
                </p>
              </div>

              {editWorkspaceMemberError && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-100 dark:border-red-900/20">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  {editWorkspaceMemberError}
                </div>
              )}

              <button
                onClick={handleUpdateWorkspaceMemberRole}
                disabled={editWorkspaceMemberLoading}
                className="w-full bg-black dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black border border-transparent dark:border-zinc-800 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {editWorkspaceMemberLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Workspace Member Confirmation Modal */}
      {isRemoveMemberModalOpen && memberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="text-xl font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                <UserMinus className="w-5 h-5" />
                Remove Member
              </h3>
              <button 
                onClick={() => {
                  setIsRemoveMemberModalOpen(false);
                  setMemberToRemove(null);
                }}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to remove <strong>{memberToRemove.user?.name}</strong> (<em>{memberToRemove.user?.email}</em>) from this workspace?
              </p>

              <div className="flex items-start gap-3 text-red-650 dark:text-red-400 text-xs bg-red-50 dark:bg-red-955/20 p-3.5 rounded-lg border border-red-100 dark:border-red-900/30">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-500" />
                <span>
                  This action is permanent. This user will be automatically removed from all project teams, task assignments, and active lists within this workspace.
                </span>
              </div>

              {removeMemberError && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-100 dark:border-red-900/20">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  {removeMemberError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsRemoveMemberModalOpen(false);
                    setMemberToRemove(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveMember}
                  disabled={removeMemberLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {removeMemberLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    "Remove Member"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Team Member Confirmation Modal */}
      {isRemoveTeamMemberModalOpen && teamMemberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="text-xl font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                <UserMinus className="w-5 h-5" />
                Remove from Team
              </h3>
              <button 
                onClick={() => {
                  setIsRemoveTeamMemberModalOpen(false);
                  setTeamMemberToRemove(null);
                }}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to remove <strong>{teamMemberToRemove.userName}</strong> from the project team <strong>{teamMemberToRemove.teamName}</strong>?
              </p>

              <div className="flex items-start gap-3 text-red-650 dark:text-red-400 text-xs bg-red-50 dark:bg-red-955/20 p-3.5 rounded-lg border border-red-100 dark:border-red-900/30">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-500" />
                <span>
                  This will remove the user's role and title assignments for this project team. They will no longer be listed as a contributor to this team's activities.
                </span>
              </div>

              {removeTeamMemberError && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-100 dark:border-red-900/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {removeTeamMemberError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsRemoveTeamMemberModalOpen(false);
                    setTeamMemberToRemove(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveTeamMember}
                  disabled={removeTeamMemberLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {removeTeamMemberLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    "Remove Member"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
