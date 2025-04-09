
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Target, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Link } from 'react-router-dom';

const Missions = () => {
  const missions = [
    { 
      id: 1, 
      name: 'Tech SaaS in California', 
      status: 'active', 
      progress: 65, 
      leads: 87, 
      target: 150,
      lastUpdated: '2 hours ago',
      startDate: 'Apr 2, 2025',
      description: 'Finding technology SaaS companies in California for potential partnerships.',
    },
    { 
      id: 2, 
      name: 'UK Startups', 
      status: 'completed', 
      progress: 100, 
      leads: 120, 
      target: 120,
      lastUpdated: '3 days ago',
      startDate: 'Mar 15, 2025',
      description: 'Identifying early-stage startups in the UK tech ecosystem.',
    },
    { 
      id: 3, 
      name: 'Healthcare Providers NYC', 
      status: 'draft', 
      progress: 0, 
      leads: 0, 
      target: 200,
      lastUpdated: '1 week ago',
      startDate: 'Not started',
      description: 'Research project for healthcare providers and clinics in New York City.',
    },
    { 
      id: 4, 
      name: 'Manufacturing in Midwest', 
      status: 'active', 
      progress: 35, 
      leads: 42, 
      target: 120,
      lastUpdated: '1 day ago',
      startDate: 'Mar 28, 2025',
      description: 'Targeting manufacturing companies in the Midwest region.',
    },
    { 
      id: 5, 
      name: 'Educational Institutions Canada', 
      status: 'active', 
      progress: 78, 
      leads: 94, 
      target: 120,
      lastUpdated: '5 hours ago',
      startDate: 'Mar 10, 2025',
      description: 'Prospecting educational institutions across major Canadian cities.',
    },
    { 
      id: 6, 
      name: 'Retail Chains Southeast', 
      status: 'completed', 
      progress: 100, 
      leads: 85, 
      target: 85,
      lastUpdated: '2 weeks ago',
      startDate: 'Feb 15, 2025',
      description: 'Mapping retail chains in the Southeastern United States.',
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Missions</h1>
            <p className="text-muted-foreground">
              Manage your prospecting campaigns
            </p>
          </div>
          <Button asChild>
            <Link to="/missions/create">
              <Plus className="h-4 w-4 mr-1" /> New Mission
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="relative sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search missions..."
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-1" /> Filter
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <Card key={mission.id} className="mission-card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{mission.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{mission.description}</p>
                </div>
                <div className="flex">
                  {renderStatusBadge(mission.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/missions/${mission.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Mission</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      {mission.status === 'active' && (
                        <DropdownMenuItem>Pause Mission</DropdownMenuItem>
                      )}
                      {mission.status === 'draft' && (
                        <DropdownMenuItem>Activate Mission</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">Delete Mission</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
                  <Target size={14} className="text-slate-500" />
                  <span className="text-slate-600">Started {mission.startDate}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{mission.leads}/{mission.target} leads</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock size={14} />
                  <span>{mission.lastUpdated}</span>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="ghost" asChild className="text-deepinsight-purple hover:text-deepinsight-purple hover:bg-deepinsight-light-purple p-0 h-8">
                  <Link to={`/missions/${mission.id}`}>
                    View details <ChevronRight size={16} />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Missions;
