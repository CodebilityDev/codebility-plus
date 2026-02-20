"use client";

import { useEffect, useState } from "react";
import { Plus, TrendingUp, Users, Calendar, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import {
  addClientOutreach,
  getAdminOutreachStats,
  getAdminOutreachHistory,
  deleteClientOutreach,
  type AdminOutreachStats,
  type ClientOutreach,
} from "../actions";
import { getCurrentWeekStart } from "../utils";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

export default function ClientTrackerContent() {
  const [stats, setStats] = useState<AdminOutreachStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminOutreachStats | null>(null);
  const [history, setHistory] = useState<ClientOutreach[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_company: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const weekStart = getCurrentWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const fetchStats = async () => {
    setLoading(true);
    const result = await getAdminOutreachStats();
    if (result.success && result.data) {
      setStats(result.data);
    } else {
      toast.error(result.error || "Failed to load stats");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client_name.trim()) {
      toast.error("Client name is required");
      return;
    }

    setSubmitting(true);
    const result = await addClientOutreach(formData);

    if (result.success) {
      toast.success("Client outreach added!");
      setFormData({
        client_name: "",
        client_email: "",
        client_company: "",
        notes: "",
      });
      setAddDialogOpen(false);
      fetchStats(); // Refresh stats
    } else {
      toast.error(result.error || "Failed to add outreach");
    }
    setSubmitting(false);
  };

  const viewHistory = async (admin: AdminOutreachStats) => {
    setSelectedAdmin(admin);
    setLoadingHistory(true);
    setHistoryDialogOpen(true);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const result = await getAdminOutreachHistory(admin.admin_id, weekStartStr);

    if (result.success && result.data) {
      setHistory(result.data);
    } else {
      toast.error(result.error || "Failed to load history");
      setHistory([]);
    }
    setLoadingHistory(false);
  };

  const handleDelete = async (outreachId: string) => {
    if (!confirm("Are you sure you want to delete this outreach record?")) {
      return;
    }

    const result = await deleteClientOutreach(outreachId);

    if (result.success) {
      toast.success("Outreach deleted");
      setHistory(prev => prev.filter(h => h.id !== outreachId));
      fetchStats(); // Refresh stats
    } else {
      toast.error(result.error || "Failed to delete");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const totalOutreach = stats.reduce((sum, stat) => sum + stat.current_week_count, 0);
  const avgOutreach = stats.length > 0 ? (totalOutreach / stats.length).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Week Summary */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Current Week
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(weekStart.toISOString())} - {formatDate(weekEnd.toISOString())}
              </p>
            </div>
          </div>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Client Outreach</DialogTitle>
                <DialogDescription>
                  Record a new client outreach for this week
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="client_name">Client Name *</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="client_email">Client Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="client_company">Company</Label>
                  <Input
                    id="client_company"
                    value={formData.client_company}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_company: e.target.value }))}
                    placeholder="Acme Inc."
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional details about the outreach..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Adding..." : "Add Outreach"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total This Week</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalOutreach}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Average per Admin</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{avgOutreach}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Admins</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.length}</p>
          </div>
        </div>
      </div>

      {/* Admin Stats Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="font-semibold">Admin</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold text-center">This Week</TableHead>
              <TableHead className="font-semibold text-center">Total All Time</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No admin data available
                </TableCell>
              </TableRow>
            ) : (
              stats
                .sort((a, b) => b.current_week_count - a.current_week_count)
                .map((admin) => (
                  <TableRow key={admin.admin_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="font-medium">
                      {admin.first_name} {admin.last_name}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {admin.email_address}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                        admin.current_week_count > 0
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}>
                        {admin.current_week_count}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {admin.total_count}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewHistory(admin)}
                        disabled={admin.current_week_count === 0}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Outreach History - {selectedAdmin?.first_name} {selectedAdmin?.last_name}
            </DialogTitle>
            <DialogDescription>
              This week's client outreach records
            </DialogDescription>
          </DialogHeader>

          {loadingHistory ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No outreach records for this week
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {record.client_name}
                      </h4>
                      {record.client_company && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {record.client_company}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {record.client_email && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      📧 {record.client_email}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mb-2">
                    📅 {formatDate(record.outreach_date)}
                  </p>

                  {record.notes && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded p-2 mt-2">
                      {record.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
