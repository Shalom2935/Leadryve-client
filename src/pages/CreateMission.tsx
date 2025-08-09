import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Target,
  Globe,
  Users,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const SECTEURS = [
  "Agroalimentaire",
  "BTP / Construction",
  "Commerce / Distribution",
  "Énergie / Mines",
  "Finance / Assurance",
  "Santé / Pharmacie",
  "Technologie / Informatique",
  "Transport / Logistique",
  "Tourisme / Hôtellerie",
  "Éducation / Formation",
  "Autre"
];

const CreateMission = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    target_location: '',
    target_sector: '',
    secteur_autre: '',
    lead_count: 100,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 2;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, target_sector: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const secteur = formData.target_sector === 'Autre' ? formData.secteur_autre : formData.target_sector;
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/missions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          target_location: formData.target_location,
          target_sector: secteur,
          lead_count: Number(formData.lead_count),
          notes: formData.notes,
        }),
      });
      if (!res.ok) throw new Error('Erreur lors de la création de la mission');
      const data = await res.json();
      if (!data.id) throw new Error('Réponse invalide du serveur');
      toast.success('Mission créée avec succès !');
      navigate(`/missions/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2].map((num) => (
        <div key={num} className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-white ${step === num ? 'bg-leadryve-purple' : 'bg-slate-300'}`}>{num}</div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <CardHeader>
            <CardTitle className="text-center">Informations de base</CardTitle>
            <CardDescription className="text-center">Définissez les éléments principaux de votre mission de prospection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la mission</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex : Prospection SaaS Douala"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_location">Zone géographique ciblée</Label>
              <Input
                id="target_location"
                name="target_location"
                placeholder="Ville, région ou pays"
                value={formData.target_location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_sector">Secteur d'activité</Label>
              <Select
                value={formData.target_sector}
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un secteur" />
                </SelectTrigger>
                <SelectContent>
                  {SECTEURS.map((secteur) => (
                    <SelectItem key={secteur} value={secteur}>{secteur}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.target_sector === 'Autre' && (
                <Input
                  name="secteur_autre"
                  placeholder="Précisez le secteur..."
                  value={formData.secteur_autre}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead_count">Objectif de leads</Label>
              <Input
                id="lead_count"
                name="lead_count"
                type="number"
                min={1}
                placeholder="100"
                value={formData.lead_count}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-slate-500">Recommandé : 100-200 leads pour de meilleurs résultats</p>
            </div>
          </CardContent>
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          <CardHeader>
            <CardTitle className="text-center">Notes et lancement</CardTitle>
            <CardDescription className="text-center">Ajoutez des précisions ou instructions pour cette mission.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes complémentaires (optionnel)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Décrivez avec plus de détails l'objectif de votre campagne, apportez des précisions sur les leads recherchés..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Créer une mission</h1>
          <p className="text-muted-foreground">Paramétrez votre nouvelle campagne de prospection.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <Card className="border-slate-200 shadow-sm">
            {renderStepIndicator()}
            {renderStepContent()}
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} disabled={loading}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> Précédent
                </Button>
              ) : (
                <Button type="button" variant="outline" asChild>
                  <Link to="/missions">Annuler</Link>
                </Button>
              )}
              {step < totalSteps ? (
                <Button type="button" onClick={nextStep} disabled={loading}>
                  Suivant <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="bg-leadryve-purple hover:bg-leadryve-purple/90" disabled={loading}>
                  <CheckCircle className="mr-1 h-4 w-4" />
                  {loading ? 'Création...' : 'Lancer la mission'}
                </Button>
              )}
            </CardFooter>
            {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
          </Card>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateMission;
