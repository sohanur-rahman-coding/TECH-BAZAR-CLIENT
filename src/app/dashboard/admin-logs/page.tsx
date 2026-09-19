"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { History, ShieldAlert, Trash2, Shield } from "lucide-react";
import toast from "react-hot-toast";

const SERVER_URL = "/api/backend";

interface AdminLog {
  _id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetId: string;
  createdAt: string;
}

export default function AdminLogsPage() {
  const { data: session } = authClient.useSession();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  const role = (session?.user as any)?.role as string | undefined;

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch(`${SERVER_URL}/api/admin/logs`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        setLogs(data);
      } catch (err: any) {
        toast.error("Failed to load admin logs");
      } finally {
        setLoading(false);
      }
    }
    
    if (role === "admin") {
      fetchLogs();
    } else if (role !== undefined) {
      setLoading(false);
    }
  }, [role]);

  if (!loading && role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
        <ShieldAlert className="h-16 w-16 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Access Restricted</h2>
        <p className="text-xs text-slate-500 max-w-sm mt-2">Only administrators can view platform moderation logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl shadow-sm">
          <History className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase text-slate-900 dark:text-slate-100 tracking-tight">Admin Activity Log</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Monitor moderation actions taken by platform administrators</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center space-y-4">
            <Shield className="h-12 w-12 text-slate-300 dark:text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">No Logs Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">No administrative actions have been recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Administrator</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action Taken</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition">
                    <td className="py-4 px-6 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{log.adminName}</span>
                        <span className="text-[10px] text-slate-500">ID: {log.adminId}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                        <Trash2 className="h-3 w-3" />
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <code className="text-[10px] bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        {log.targetId}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
