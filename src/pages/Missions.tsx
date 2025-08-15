import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { 
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

// --- Fonctions et Composants Utilitaires ---

const renderStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Terminé</Badge>;
    case 'active':
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">En cours</Badge>;
    case 'draft':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Brouillon</Badge>;
    default:
      return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200">{status}</Badge>;
  }
};

const MissionCardContent: React.FC<{ mission: any }> = ({ mission }) => (
  <>
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="font-semibold text-lg">{mission.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{mission.description}</p>
      </div>
      <div className="flex items-center">
        {renderStatusBadge(mission.status)}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-1">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/missions/${mission.id}`}>Voir les détails</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuItem>Dupliquer</DropdownMenuItem>
            {mission.status === 'active' && <DropdownMenuItem>Mettre en pause</DropdownMenuItem>}
            {mission.status === 'draft' && <DropdownMenuItem>Activer</DropdownMenuItem>}
            <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>Progression</span>
        <span className="text-leadryve-purple font-medium">{mission.progress}%</span>
      </div>
      <Progress value={mission.progress} className="h-2" />
    </div>
    
    <div className="flex justify-between text-sm text-slate-600 mt-2">
      <div className="flex items-center gap-1">
        <Target size={14} />
        <span>Démarrée il y a {mission.startDate}</span>
      </div>
      <div className="flex items-center gap-1">
        <Users size={14} />
        <span>{mission.leads}/{mission.target} leads</span>
      </div>
    </div>
    
    <div className="flex justify-end mt-4">
      <Button variant="ghost" asChild className="text-leadryve-purple hover:text-leadryve-purple hover:bg-leadryve-light-purple p-0 h-8">
        <Link to={`/missions/${mission.id}`}>
          Voir les détails <ChevronRight size={16} />
        </Link>
      </Button>
    </div>
  </>
);

const MissionCard: React.FC<{ mission: any }> = ({ mission }) => (
  <Card className="mission-card">
    <div className="p-4 space-y-4">
      <MissionCardContent mission={mission} />
    </div>
  </Card>
);

const MissionListItem: React.FC<{ mission: any }> = ({ mission }) => (
  <Card className="mission-card w-full">
    <div className="p-4">
      <MissionCardContent mission={mission} />
    </div>
  </Card>
);

// --- Composant Principal ---

const Missions = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  const isSmallScreen = useIsMobile();
  
  useEffect(() => {
    if (isSmallScreen) setViewMode('grid');
  }, [isSmallScreen]);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/missions/?limit=${limit}&skip=${skip}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Erreur lors de la récupération des missions');
        const data = await res.json();
        const parsed = dashboardMissionsSchema.safeParse(data.items);
        if (!parsed.success) {
          console.error('Erreur de validation Zod pour les missions:', parsed.error, data.items);
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

  const renderMissions = () => {
    if (loading) {
      return <div className="col-span-full text-center py-8 text-muted-foreground">Chargement des missions...</div>;
    }
    if (error) {
      return <div className="col-span-full text-center py-8 text-red-500">{error}</div>;
    }
    if (missions.length === 0) {
      return <div className="col-span-full text-center py-8 text-muted-foreground">Aucune mission pour le moment.</div>;
    }

    return missions.map((mission) => {
      if (viewMode === 'list' && !isSmallScreen) {
        return <MissionListItem key={mission.id} mission={mission} />;
      }
      return <MissionCard key={mission.id} mission={mission} />;
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Missions</h1>
            <p className="text-muted-foreground">
              Gérez vos campagnes de prospection
            </p>
          </div>
          <div className="flex gap-2">
            {!isSmallScreen && (
              <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'list' ? (
                  <><LayoutGrid className="h-4 w-4 mr-1" /> Vue Grille</>
                ) : (
                  <><LayoutList className="h-4 w-4 mr-1" /> Vue Liste</>
                )}
              </Button>
            )}
            <Button asChild>
              <Link to="/missions/create">
                <Plus className="h-4 w-4 mr-1" /> Nouvelle Mission
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="relative sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Rechercher des missions..."
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-1" /> Filtrer
            </Button>
          </div>
        </div>

        <div className={`grid gap-4 ${viewMode === 'list' && !isSmallScreen ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {renderMissions()}
        </div>
      </div>
    </AppLayout>
  );
};

export default Missions;
