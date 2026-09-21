"use client";

import { useState } from "react";
import { PageHeaderLayout } from "@/components/shared/PageHeaderLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShieldAlert, Lock, History, Filter } from "lucide-react";
import { MOCK_AUDIT_LOGS } from "@/features/audit-log/data/auditLog.data";
import { AuditLogItem } from "@/features/audit-log/types/auditLog.types";

export default function AuditLogsPage() {
  const [logs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entityType.toLowerCase().includes(search.toLowerCase()) ||
      log.staffProfileId.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <PageHeaderLayout
      title="Immutable Audit Logs"
      description="Read-only, append-only chronological log of all administrative actions and system mutations (Super Admin Access)."
    >
      <div className="space-y-6">
        {/* Compliance Banner */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Compliance Notice:</strong> Audit log entries are strictly immutable and cannot be deleted or modified by any user, including Super Admin accounts.
            </span>
          </div>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 shrink-0 text-[10px]">
            Append-Only Log
          </Badge>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by staff ID, action, entity, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="text-xs bg-card border border-border rounded-md px-2 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Mutation Actions</option>
              <option value="UPDATE_CONFIG">UPDATE_CONFIG</option>
              <option value="APPROVE_VERIFICATION">APPROVE_VERIFICATION</option>
              <option value="TRIGGER_MANUAL_REFUND">TRIGGER_MANUAL_REFUND</option>
              <option value="SUSPEND_PROFILE">SUSPEND_PROFILE</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Timestamp (UTC)</TableHead>
                <TableHead className="text-xs">Staff User & Profile ID</TableHead>
                <TableHead className="text-xs">Action Type</TableHead>
                <TableHead className="text-xs">Target Entity</TableHead>
                <TableHead className="text-xs">Description / Mutation Reason</TableHead>
                <TableHead className="text-xs">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    No audit log records match search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toISOString().replace("T", " ").slice(0, 19)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold">{log.staffProfileId}</span>
                        <span className="text-[10px] text-muted-foreground">{log.staffUserId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] bg-muted/60 font-mono">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-medium">{log.entityType}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{log.entityId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-md">
                      <p className="text-foreground leading-relaxed">{log.description}</p>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {log.ip}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageHeaderLayout>
  );
}
