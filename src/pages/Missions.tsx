import React, { useEffect, useState } from 'react';
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
  MoreHorizontal,
  LayoutList,
  LayoutGrid
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
import { useIsMobile } from '@/hooks/use-mobile';
import { dashboardMissionsSchema } from '@/lib/schemas';

// MissionCard component for mobile and tablet views
const MissionCard: React.FC<{ 
  mission: any;
  renderStatusBadge: (status: string) => React.ReactNode;
}> = ({ mission, renderStatusBadge }) => {
  return (
    <Card key={mission.id} className="mission-card">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start mb-2">
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
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span className="text-leadryve-purple font-medium">{mission.progress}%</span>
          </div>
          <Progress value={mission.progress} className="h-2" />
        </div>
        
        <div className="flex justify-between text-sm">
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
        
        <div className="flex justify-end mt-2">
          <Button variant="ghost" asChild className="text-leadryve-purple hover:text-leadryve-purple hover:bg-leadryve-light-purple p-0 h-8">
            <Link to={`/missions/${mission.id}`}>
              View details <ChevronRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

const Missions = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isMobile = useIsMobile();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  // Determine if we're on tablet or mobile (under 1024px)
  const isSmallScreen = window.innerWidth < 1024;
  
  // Use grid view by default on small screens
  React.useEffect(() => {
    if (isSmallScreen) {
      setViewMode('grid');
    }
  }, [isSmallScreen]);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/missions?limit=${limit}&skip=${skip}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Erreur lors de la récupération des missions');
        const data = await res.json();
        const parsed = dashboardMissionsSchema.safeParse(data.items);
        if (!parsed.success) {
          console.error('Zod validation failed for missions:', parsed.error, data.items);
          throw new Error('Format de données inattendu');
        }
        setMissions(parsed.data);
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, [skip]);

  const renderStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
    } else if (status === 'completed') {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>;
    } else {
      return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200">Draft</Badge>;
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
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
          <div className="flex gap-2">
            {!isSmallScreen && (
              <Button variant="outline" onClick={toggleViewMode}>
                {viewMode === 'list' ? (
                  <>
                    <LayoutGrid className="h-4 w-4 mr-1" /> 
                    Grid View
                  </>
                ) : (
                  <>
                    <LayoutList className="h-4 w-4 mr-1" /> 
                    List View
                  </>
                )}
              </Button>
            )}
            <Button asChild>
              <Link to="/missions/create">
                <Plus className="h-4 w-4 mr-1" /> New Mission
              </Link>
            </Button>
          </div>
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

        {/* Grid View (default for tablet and mobile) */}
        {(viewMode === 'grid' || isSmallScreen) && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-3 text-center py-8 text-muted-foreground">Chargement des missions...</div>
            ) : error ? (
              <div className="col-span-3 text-center py-8 text-red-500">{error}</div>
            ) : missions.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-muted-foreground">Aucune mission pour le moment.</div>
            ) : (
              missions.map((mission) => (
                <MissionCard 
                  key={mission.id}
                  mission={mission}
                  renderStatusBadge={renderStatusBadge}
                />
              ))
            )}
          </div>
        )}

        {/* List View (only for desktop when selected) */}
        {viewMode === 'list' && !isSmallScreen && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-3 text-center py-8 text-muted-foreground">Chargement des missions...</div>
            ) : error ? (
              <div className="col-span-3 text-center py-8 text-red-500">{error}</div>
            ) : missions.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-muted-foreground">Aucune mission pour le moment.</div>
            ) : (
              missions.map((mission) => (
                <Card key={mission.id} className="mission-card">
                  <div className="flex justify-between items-start mb-3 p-4">
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
                  <div className="mb-4 px-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="text-leadryve-purple font-medium">{mission.progress}%</span>
                    </div>
                    <Progress value={mission.progress} className="h-2" />
                  </div>
                  <div className="flex justify-between mb-4 text-sm px-4">
                    <div className="flex items-center gap-1">
                      <Target size={14} className="text-slate-500" />
                      <span className="text-slate-600">Started {mission.startDate}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm px-4">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{mission.lead_count}/{mission.target} leads</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock size={14} />
                      <span>{mission.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 px-4 pb-4">
                    <Button variant="ghost" asChild className="text-leadryve-purple hover:text-leadryve-purple hover:bg-leadryve-light-purple p-0 h-8">
                      <Link to={`/missions/${mission.id}`}>
                        View details <ChevronRight size={16} />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Missions;
