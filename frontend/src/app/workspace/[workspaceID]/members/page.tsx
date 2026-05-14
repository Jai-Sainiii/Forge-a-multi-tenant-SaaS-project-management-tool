"use client";
import { use, useState, useEffect, useCallback } from "react";
import { Search, MoreHorizontal, AlertCircle, Users, Mail, Shield, UserPlus, Circle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

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

export default function MembersPage({params}: {params: Promise<{ workspaceID: string }>}) {
    const { workspaceID } = use(params);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
    const fetchMembers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/members/${workspaceID}`, {
                withCredentials: true,
            });
            if (res.data.success) {
                setMembers(res.data.members);
            } else {
                setError(res.data.message || "Failed to load members.");
            }
        } catch (err) {
            setError("Failed to load members. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [workspaceID]);

    const [teams, setTeams] = useState<any[]>([]);
    const [teamsLoading, setTeamsLoading] = useState(true);
    const [teamsError, setTeamsError] = useState<string | null>(null);

    const fetchTeams = useCallback(async () => {
        setTeamsLoading(true);
        setTeamsError(null);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/team/workspace/${workspaceID}`, {
                withCredentials: true,
            });
            if (res.data.success) {
                setTeams(res.data.teams);
            } else {
                setTeamsError(res.data.error || "Failed to load teams.");
            }
        } catch (err) {
            setTeamsError("Failed to load teams. Please try again.");
        } finally {
            setTeamsLoading(false);
        }
    }, [workspaceID]);

    useEffect(() => {
        fetchMembers();
        fetchTeams();
    }, [fetchMembers, fetchTeams]);

    const filteredMembers = members.filter(member => 
        member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        member.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const adminCount = members.filter(m => m.role.toLowerCase() === 'admin').length;
    const memberCount = members.filter(m => m.role.toLowerCase() === 'member').length;
    const viewerCount = members.filter(m => m.role.toLowerCase() === 'viewer').length;

    return (
        <main className="max-w-7xl mx-auto px-6 py-6 space-y-8">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 text-red-700 dark:text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                    <button onClick={fetchMembers} className="ml-auto px-3 py-1 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
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
                <button className="flex items-center gap-2 bg-[#3C3489] hover:bg-[#251b72] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
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
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#3C3489] focus:border-[#3C3489] sm:text-sm transition-colors"
                    />
                </div>
                {!loading && !error && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-md inline-block"></div>
                                        </td>
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
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-light/10 flex items-center justify-center text-primary font-medium text-sm border border-primary-light/20">
                                                    {member.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {member.user.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Mail className="w-3.5 h-3.5 mr-1.5" />
                                                {member.user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {member.role.toLowerCase() === 'admin' ? (
                                                    <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 mr-1.5" />
                                                ) : null}
                                                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                                    {member.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                member.isActive 
                                                ? 'bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20' 
                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                                            }`}>
                                                <Circle className={`w-1.5 h-1.5 fill-current ${member.isActive ? 'text-[#0D9488]' : 'text-gray-400'}`} />
                                                {member.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
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
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Overview of all teams across your projects.
                        </p>
                    </div>
                </div>

                {teamsError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 flex items-center gap-3 text-red-700 dark:text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5" />
                        {teamsError}
                        <button onClick={fetchTeams} className="ml-auto px-3 py-1 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                            Retry
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamsLoading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg p-5 animate-pulse">
                                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        ))
                    ) : teams.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg">
                            <Users className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-base font-medium text-gray-900 dark:text-white">No teams found</p>
                            <p className="text-sm mt-1">There are no teams created in your projects yet.</p>
                        </div>
                    ) : (
                        teams.map((team) => (
                            <div key={team.id} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all hover:border-primary-light/50">
                                <div 
                                    className="p-5 cursor-pointer flex justify-between items-center"
                                    onClick={() => setExpandedTeamId(expandedTeamId === team.id ? null : team.id)}
                                >
                                    <div>
                                        <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                            {team.teamName}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {team.project?.name || "Unknown Project"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                            {team.teamMembers?.length || 0}
                                        </span>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedTeamId === team.id ? 'rotate-180' : ''}`} />
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
                                                            <div key={i} className="flex items-center justify-between p-3 hover:bg-white dark:hover:bg-[#1e293b] rounded-md transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-light/10 flex items-center justify-center text-primary font-medium text-sm border border-primary-light/20">
                                                                        {member.user?.name?.charAt(0).toUpperCase() || "?"}
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{member.user?.name || "Unknown User"}</div>
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{member.user?.email}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right flex flex-col items-end">
                                                                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{member.role}</span>
                                                                    <span className="text-xs text-gray-700 dark:text-gray-300 capitalize mt-0.5">{member.position}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-center text-gray-500 dark:text-gray-400 py-6">
                                                        No members in this team.
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
