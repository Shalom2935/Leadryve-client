import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const missions = [
    { 
      id: 1, 
      name: 'Tech SaaS in California', 
      status: 'active', 
      progress: 65, 
      leads: 87, 
      target: 150,
      lastUpdated: '2 hours ago'
    },
    { 
      id: 2, 
      name: 'UK Startups', 
      status: 'completed', 
      progress: 100, 
      leads: 120, 
      target: 120,
      lastUpdated: '3 days ago'
    },
    { 
      id: 3, 
      name: 'Healthcare Providers NYC', 
      status: 'draft', 
      progress: 0, 
      leads: 0, 
      target: 200,
      lastUpdated: '1 week ago'
    },
  ];

  const stats = [
    { 
      title: 'Total Leads', 
      value: '2,347', 
      change: '+12%', 
      trend: 'up',
      icon: Users 
    },
    { 
      title: 'Emails Sent', 
      value: '1,245', 
      change: '+8%', 
      trend: 'up',
      icon: Mail 
    },
    { 
      title: 'Open Rate', 
      value: '32%', 
      change: '-3%', 
      trend: 'down',
      icon: BarChart3 
    },
    { 
      title: 'Response Rate', 
      value: '12%', 
      change: '+2%', 
      trend: 'up',
      icon: BarChart3 
    },
  ];

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
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to DeepInsight.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="stats-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change} from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Missions</h2>
            <Button asChild>
              <Link to="/missions/create">
                + New Mission
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {missions.map((mission) => (
              <Link to={`/missions/${mission.id}`} key={mission.id} className="mission-card">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{mission.name}</h3>
                  {renderStatusBadge(mission.status)}
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="text-deepinsight-purple font-medium">{mission.progress}%</span>
                  </div>
                  <Progress value={mission.progress} className="h-2" />
                </div>
                
                <div className="flex justify-between mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{mission.leads}/{mission.target} leads</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock size={14} />
                    <span>{mission.lastUpdated}</span>
                  </div>
                </div>
                
                <div className="flex justify-end text-deepinsight-purple hover:underline text-sm">
                  View details <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
