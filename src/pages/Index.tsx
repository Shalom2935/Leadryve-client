import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { dashboardSummarySchema } from '@/lib/schemas';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const Dashboard = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setStatsError(null);
      try {
        const res = await fetch(`${API_BASE}/dashboard/summary`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Erreur lors de la récupération des statistiques');
        const data = await res.json();
        // Validation Zod
        const parsed = dashboardSummarySchema.safeParse(data);
        if (!parsed.success) throw new Error('Format de données inattendu');
        setStats(parsed.data);
      } catch (err: any) {
        setStatsError(err.message || 'Erreur inconnue');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    {
      title: 'Total Leads',
      value: stats.total_leads,
      icon: Users,
    },
    {
      title: 'Emails Sent',
      value: stats.sent_mails,
      icon: Mail,
    },
  ] : [];

  const renderStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
    } else if (status === 'completed') {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>;
    } else {
      return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200">Draft</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to Leadryve.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loadingStats ? (
            <div className="col-span-4 text-center py-8 text-muted-foreground">Chargement des statistiques...</div>
          ) : statsError ? (
            <div className="col-span-4 text-center py-8 text-red-500">{statsError}</div>
          ) : (
            statCards.map((stat, index) => (
              <Card key={index} className="stats-card bg-gradient-to-br from-leadryve-purple/10 to-blue-50 border-0 shadow-lg">
                <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2">
                  <div className="rounded-full bg-leadryve-purple/20 p-3 mb-2">
                    <stat.icon className="h-7 w-7 text-leadryve-purple" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-leadryve-purple">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                  {/* Plus d'insight de change percent */}
                  {stat.title === 'Total Leads' && (
                    <div className="text-xs text-slate-500">Nombre total de leads générés</div>
                  )}
                  {stat.title === 'Emails Sent' && (
                    <div className="text-xs text-slate-500">Nombre total d'emails envoyés</div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Missions récentes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Vos missions récentes</h2>
            <Button asChild>
              <Link to="/missions/create">
                + Nouvelle mission
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loadingStats ? (
              <div className="col-span-3 text-center py-8 text-muted-foreground">Chargement des missions...</div>
            ) : statsError ? (
              <div className="col-span-3 text-center py-8 text-red-500">{statsError}</div>
            ) : !stats?.recent_missions || (Array.isArray(stats.recent_missions) && stats.recent_missions.length === 0) ? (
              <div className="col-span-3 text-center py-8 text-muted-foreground">Aucune mission pour le moment.</div>
            ) : (
              (Array.isArray(stats.recent_missions) ? stats.recent_missions : [stats.recent_missions]).map((mission: any) => (
                <Link to={`/missions/${mission.id}`} key={mission.id} className="mission-card">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{mission.name}</h3>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-500">{mission.started_ago} jours</span>
                      <span className="mt-1">{renderStatusBadge(mission.status)}</span>
                    </div>
                  </div>
                  <div className="mb-2 text-sm text-slate-600">
                    <span className="font-medium">Leads :</span> {mission.leads_found}/{mission.leads_requested}
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="text-leadryve-purple font-medium">{mission.progress}%</span>
                    </div>
                    <Progress value={mission.progress} className="h-2" />
                  </div>
                  <div className="flex justify-end text-leadryve-purple hover:underline text-sm">
                    Voir le détail
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
