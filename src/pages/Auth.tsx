import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const steps = [
  'Identité',
  'Coordonnées',
  'Pitch (optionnel)'
];

const REGIONS = [
  'Adamaoua',
  'Centre',
  'Est',
  'Extrême-Nord',
  'Littoral',
  'Nord',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Ouest',
  'Cameroun',
  'International'
];

const EMPLOYEE_RANGES = [
  '1',
  '2-10',
  '11-50',
  '51-250',
  '251-1000',
  '1001+',
];

const DAYS = [
  'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'
];
const STATUS_OPTIONS = [
  { value: 'open', label: 'Ouvert' },
  { value: 'close', label: 'Fermé' },
  { value: 'open_24h', label: 'Ouvert 24h/24' },
  { value: 'on_demand', label: 'Sur rendez-vous' },
];

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

type RegisterForm = {
  name: string;
  companyName: string;
  role: string;
  services: string[];
  regions: string[];
  employees: string;
  openingHours: any;
  address: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  x: string;
  pitch: string;
  password: string;
  confirmPassword: string;
};

// Validation helpers
const validateRegister = (form: RegisterForm) => {
  const errors: Record<string, string> = {};
  if (!form.name) errors.name = 'Nom requis';
  if (!form.companyName) errors.companyName = 'Nom entreprise requis';
  if (!form.role) errors.role = 'Rôle requis';
  if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = 'Email valide requis';
  if (!form.password || form.password.length < 8) errors.password = 'Mot de passe (min 8 caractères)';
  if (form.password !== form.confirmPassword) errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  if (!form.regions.length) errors.regions = 'Sélectionnez au moins une zone';
  if (!form.employees) errors.employees = 'Sélectionnez une plage';
  return errors;
};

const validateLogin = (form: { email: string; password: string }) => {
  const errors: Record<string, string> = {};
  if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = 'Email valide requis';
  if (!form.password) errors.password = 'Mot de passe requis';
  return errors;
};

const Auth = () => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [step, setStep] = useState(0);
  const [registerStep, setRegisterStep] = useState<'infos' | 'password' | 'confirmation'>('infos');
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    companyName: '',
    role: '',
    services: [''],
    regions: [],
    employees: '',
    openingHours: {
      lundi: { status: 'open', horaires: [{ ouverture: '', fermeture: '' }] },
      mardi: { status: 'open', horaires: [{ ouverture: '', fermeture: '' }] },
      mercredi: { status: 'close', horaires: [] },
      jeudi: { status: 'close', horaires: [{ ouverture: '', fermeture: '' }] },
      vendredi: { status: 'open', horaires: [{ ouverture: '', fermeture: '' }] },
      samedi: { status: 'close', horaires: [] },
      dimanche: { status: 'close', horaires: [] },
    },
    address: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    x: '',
    pitch: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (idx: number, value: string) => {
    const updated = [...form.services];
    updated[idx] = value;
    setForm({ ...form, services: updated });
  };

  const addService = () => {
    setForm({ ...form, services: [...form.services, ''] });
  };

  const removeService = (idx: number) => {
    const updated = form.services.filter((_, i) => i !== idx);
    setForm({ ...form, services: updated });
  };

  const handleRegionToggle = (region: string) => {
    setForm((prev) => {
      const exists = prev.regions.includes(region);
      return {
        ...prev,
        regions: exists
          ? prev.regions.filter((r: string) => r !== region)
          : [...prev.regions, region],
      };
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) setStep(step + 1);
    else {
      // TODO: Save profile data to context or backend
      // Redirect to dashboard or next step
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleEmployeeRange = (range: string) => {
    setForm({ ...form, employees: range });
  };

  const handleOpeningStatus = (day: string, status: string) => {
    setForm((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { status, horaires: status === 'open' ? [{ ouverture: '', fermeture: '' }] : [] },
      },
    }));
  };

  const handleOpeningTime = (day: string, idx: number, field: 'ouverture' | 'fermeture', value: string) => {
    setForm((prev) => {
      const horaires = [...(prev.openingHours[day].horaires || [])];
      horaires[idx] = { ...horaires[idx], [field]: value };
      return {
        ...prev,
        openingHours: {
          ...prev.openingHours,
          [day]: { ...prev.openingHours[day], horaires },
        },
      };
    });
  };

  const addOpeningSlot = (day: string) => {
    setForm((prev) => {
      const horaires = [...(prev.openingHours[day].horaires || [])];
      horaires.push({ ouverture: '', fermeture: '' });
      return {
        ...prev,
        openingHours: {
          ...prev.openingHours,
          [day]: { ...prev.openingHours[day], horaires },
        },
      };
    });
  };

  const removeOpeningSlot = (day: string, idx: number) => {
    setForm((prev) => {
      const horaires = prev.openingHours[day].horaires.filter((_, i) => i !== idx);
      return {
        ...prev,
        openingHours: {
          ...prev.openingHours,
          [day]: { ...prev.openingHours[day], horaires },
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (mode === 'register') {
      const errs = validateRegister(form);
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/users/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Erreur lors de l’inscription');
        setSuccess(true);
        // Stocker le token si fourni
        const data = await res.json();
        if (data.access_token) login(data.access_token);
        // Rediriger ou afficher un message de succès
        navigate('/');
      } catch (err: any) {
        setApiError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    } else {
      const errs = validateLogin({ email: form.email, password: form.password });
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        if (!res.ok) throw new Error('Email ou mot de passe incorrect');
        setSuccess(true);
        // Stocker le token si fourni
        const data = await res.json();
        if (data && data.access_token) login(data.access_token);
        navigate('/');
      } catch (err: any) {
        setApiError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }
  };

  // Nouvelle fonction pour valider les infos sans mot de passe
  const validateRegisterInfos = (form: RegisterForm) => {
    const errors: Record<string, string> = {};
    if (!form.name) errors.name = 'Nom requis';
    if (!form.companyName) errors.companyName = 'Nom entreprise requis';
    if (!form.role) errors.role = 'Rôle requis';
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = 'Email valide requis';
    if (!form.regions.length) errors.regions = 'Sélectionnez au moins une zone';
    if (!form.employees) errors.employees = 'Sélectionnez une plage';
    return errors;
  };

  // Handler pour la première étape (infos)
  const handleRegisterInfos = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const errs = validateRegisterInfos(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setRegisterStep('password');
  };

  // Handler pour la deuxième étape (mot de passe)
  const handleRegisterPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const errs = {} as Record<string, string>;
    if (!form.password || form.password.length < 8) errs.password = 'Mot de passe (min 8 caractères)';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Les mots de passe ne correspondent pas';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Erreur lors de l’inscription');
      setSuccess(true);
      const data = await res.json();
      // Récupère l'email de la réponse serveur, fallback sur form.email
      const email = data?.email || "example@gmail.com";
      navigate(`/auth/confirm-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setApiError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-leadryve-purple/10 to-slate-100">
      {/* Boutons en haut à droite, sans barre, espacés */}
      <div className="w-full flex justify-end pr-8 mb-8 mt-12">
        <div className="flex gap-4">
          <button
            type="button"
            className={`px-6 py-2 rounded-lg shadow text-sm font-semibold border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-leadryve-purple focus:z-10
              ${mode === 'register' ? 'bg-leadryve-purple text-white border-leadryve-purple' : 'bg-white border-slate-300 text-slate-700 hover:bg-leadryve-purple/10'}`}
            onClick={() => setMode('register')}
          >
            S'enregistrer
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-lg shadow text-sm font-semibold border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-leadryve-purple focus:z-10
              ${mode === 'login' ? 'bg-leadryve-purple text-white border-leadryve-purple' : 'bg-white border-slate-300 text-slate-700 hover:bg-leadryve-purple/10'}`}
            onClick={() => setMode('login')}
          >
            Se connecter
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center w-full pt-16">
        <Card className="w-full max-w-xl shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle>{mode === 'register' ? 'Créer votre profil de prospection' : 'Connexion à votre compte'}</CardTitle>
            {mode === 'register' && registerStep === 'infos' && (
              <Progress value={((step + 1) / steps.length) * 100} className="h-2 mt-4" />
            )}
            {mode === 'register' && registerStep === 'infos' && (
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                {steps.map((s, i) => (
                  <span key={i} className={i === step ? 'font-bold text-leadryve-purple' : ''}>{s}</span>
                ))}
              </div>
            )}
          </CardHeader>
          {mode === 'register' && registerStep === 'confirmation' ? (
            <div className="p-8 text-center">
              <h2 className="text-lg font-semibold mb-4">Inscription réussie !</h2>
              <p className="mb-2">Merci pour votre inscription. Un email de confirmation vient de vous être envoyé.</p>
              <p>Veuillez cliquer sur le lien dans l’email pour activer votre compte.</p>
            </div>
          ) : (
            <form onSubmit={
              mode === 'register'
                ? registerStep === 'infos'
                  ? handleRegisterInfos
                  : handleRegisterPassword
                : handleSubmit
            }>
              <CardContent className="space-y-4">
                {mode === 'register' ? (
                  registerStep === 'infos' ? (
                    // ...infos form (étapes 0, 1, 2 SANS mot de passe)...
                    <>
                      {step === 0 && (
                        <>
                          <div>
                            <Label>Nom</Label>
                            <Input name="name" value={form.name} onChange={handleChange} />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                          </div>
                          <div>
                            <Label>Nom de l’entreprise</Label>
                            <Input name="companyName" value={form.companyName} onChange={handleChange} />
                            {errors.companyName && <div className="text-red-500 text-xs mt-1">{errors.companyName}</div>}
                          </div>
                          <div>
                            <Label>Rôle</Label>
                            <Input name="role" value={form.role} onChange={handleChange} />
                            {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role}</div>}
                          </div>
                          <div>
                            <Label>Services/produits proposés</Label>
                            {form.services.map((service, idx) => (
                              <div key={idx} className="flex gap-2 mb-2">
                                <Input
                                  name={`service-${idx}`}
                                  value={service}
                                  onChange={e => handleServiceChange(idx, e.target.value)}
                                  required
                                  placeholder={`Service/Produit #${idx + 1}`}
                                />
                                {form.services.length > 1 && (
                                  <Button type="button" variant="ghost" onClick={() => removeService(idx)}>-</Button>
                                )}
                              </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addService}>+ Ajouter</Button>
                          </div>
                          <div>
                            <Label>Zone géographique couverte</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {REGIONS.map((region) => (
                                <button
                                  type="button"
                                  key={region}
                                  className={`px-3 py-1 rounded-full border text-xs transition-all ${form.regions.includes(region) ? 'bg-leadryve-purple text-white border-leadryve-purple' : 'bg-white border-slate-300 text-slate-700'}`}
                                  onClick={() => handleRegionToggle(region)}
                                >
                                  {region}
                                </button>
                              ))}
                            </div>
                            {form.regions.length === 0 && <div className="text-xs text-red-500 mt-1">Sélectionnez au moins une zone</div>}
                          </div>
                          <div>
                            <Label>Nombre d'employés</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {EMPLOYEE_RANGES.map((range) => (
                                <button
                                  type="button"
                                  key={range}
                                  className={`px-3 py-1 rounded-full border text-xs transition-all ${form.employees === range ? 'bg-leadryve-purple text-white border-leadryve-purple' : 'bg-white border-slate-300 text-slate-700'}`}
                                  onClick={() => handleEmployeeRange(range)}
                                >
                                  {range}
                                </button>
                              ))}
                            </div>
                            {form.employees === '' && <div className="text-xs text-red-500 mt-1">Sélectionnez une plage</div>}
                          </div>
                          <div>
                            <Label>Heures d'ouverture</Label>
                            <div className="border rounded bg-slate-50 p-2">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x">
                                {DAYS.map((day) => (
                                  <div key={day} className="flex flex-col px-3 py-2">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="capitalize w-20 text-xs font-medium">{day}</span>
                                      <select
                                        value={form.openingHours[day].status}
                                        onChange={e => handleOpeningStatus(day, e.target.value)}
                                        className="border border-leadryve-purple/40 rounded px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-leadryve-purple focus:border-leadryve-purple transition-colors duration-150 shadow-sm hover:border-leadryve-purple/80"
                                        style={{ minWidth: 120, color: form.openingHours[day].status === 'close' ? '#64748b' : '#6C63FF', fontWeight: 500 }}
                                      >
                                        {STATUS_OPTIONS.map(opt => (
                                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                    {form.openingHours[day].status === 'open' && (
                                      <div className="space-y-1 ml-0">
                                        {form.openingHours[day].horaires.map((h, idx) => (
                                          <div key={idx} className="flex items-center gap-2 mb-1 relative group">
                                            <input
                                              type="time"
                                              step="60"
                                              min="00:00"
                                              max="23:59"
                                              value={h.ouverture}
                                              onChange={e => handleOpeningTime(day, idx, 'ouverture', e.target.value)}
                                              className="w-20 text-xs border border-slate-300 rounded focus:border-leadryve-purple focus:ring-leadryve-purple bg-white px-2 py-1 shadow-sm"
                                              required
                                            />
                                            <span className="text-xs">à</span>
                                            <input
                                              type="time"
                                              step="60"
                                              min="00:00"
                                              max="23:59"
                                              value={h.fermeture}
                                              onChange={e => handleOpeningTime(day, idx, 'fermeture', e.target.value)}
                                              className="w-20 text-xs border border-slate-300 rounded focus:border-leadryve-purple focus:ring-leadryve-purple bg-white px-2 py-1 shadow-sm"
                                              required
                                            />
                                            {form.openingHours[day].horaires.length > 1 && (
                                              <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => removeOpeningSlot(day, idx)}>-</Button>
                                            )}
                                            {idx === 0 && (
                                              <Button type="button" variant="ghost" size="icon" className="h-6 w-6 ml-2 text-leadryve-purple border-leadryve-purple hover:bg-leadryve-purple/10" onClick={() => addOpeningSlot(day)}>+</Button>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {step === 1 && (
                        <>
                          <div>
                            <Label>Adresse (Localisation)</Label>
                            <Input name="address" value={form.address} onChange={handleChange} />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input name="email" type="email" value={form.email} onChange={handleChange} />
                            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                          </div>
                          <div>
                            <Label>Téléphone</Label>
                            <Input name="phone" value={form.phone} onChange={handleChange} />
                          </div>
                          <div>
                            <Label>Site web</Label>
                            <Input name="website" value={form.website} onChange={handleChange} />
                          </div>
                          <div>
                            <Label>Réseaux sociaux</Label>
                            <div className="text-xs text-muted-foreground mb-2">Veuillez insérer les liens vers vos comptes professionnels pour chaque réseau :</div>
                            <div className="grid grid-cols-1 gap-3 mt-2">
                              <div className="flex items-center gap-2">
                                {/* LinkedIn icon */}
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-[#0A66C2]"><path fill="currentColor" d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                                <span className="w-20 text-xs font-medium">LinkedIn</span>
                                <Input name="linkedin" value={form.linkedin} onChange={handleChange} className="flex-1" />
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Facebook icon */}
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-[#1877F3]"><path fill="currentColor" d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                                <span className="w-20 text-xs font-medium">Facebook</span>
                                <Input name="facebook" value={form.facebook} onChange={handleChange} className="flex-1" />
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Instagram icon */}
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-[#E4405F]"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.013 15.668 2 6.077 2 12c0 5.923.013 6.332.072 7.613.059 1.282.292 2.394 1.272 3.374.98.98 2.092 1.213 3.374 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.059 2.394-.292 3.374-1.272.98-.98 1.213-2.092 1.272-3.374.059-1.281.072-1.69.072-7.613 0-5.923-.013-6.332-.072-7.613-.059-1.282-.292-2.394-1.272-3.374-.98-.98-2.092-1.213-3.374-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
                                <span className="w-20 text-xs font-medium">Instagram</span>
                                <Input name="instagram" value={form.instagram} onChange={handleChange} className="flex-1" />
                              </div>
                              <div className="flex items-center gap-2">
                                {/* X (Twitter) icon */}
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-black"><path fill="currentColor" d="M17.53 2.477h3.7l-8.13 9.29 9.56 9.756h-7.49l-5.89-6.44-6.74 6.44H1.47l8.7-9.9L.29 2.477h7.67l5.36 5.86 6.21-5.86zm-1.3 16.8h2.05L7.1 4.61H4.92l11.31 14.667z"/></svg>
                                <span className="w-20 text-xs font-medium">X</span>
                                <Input name="x" value={form.x} onChange={handleChange} className="flex-1" />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {step === 2 && (
                        <div>
                          <Label>Message-type ou pitch commercial existant (optionnel)</Label>
                          <Textarea name="pitch" value={form.pitch} onChange={handleChange} />
                        </div>
                      )}
                    </>
                  ) : (
                    // Formulaire mot de passe
                    <>
                      <div>
                        <Label>Mot de passe</Label>
                        <Input name="password" type="password" value={form.password} onChange={handleChange} required autoComplete="new-password" />
                        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                      </div>
                      <div>
                        <Label>Confirmer le mot de passe</Label>
                        <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
                        {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
                      </div>
                    </>
                  )
                ) : (
                  // ...existing login form...
                  <>
                    <div>
                      <Label>Email</Label>
                      <Input name="email" type="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label>Mot de passe</Label>
                      <Input name="password" type="password" value={form.password} onChange={handleChange} required autoComplete="current-password" />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {mode === 'register' && registerStep === 'infos' && (
                  <Button type="button" variant="ghost" onClick={handleBack} disabled={step === 0}>
                    Retour
                  </Button>
                )}
                {mode === 'register' ? (
                  registerStep === 'infos' ? (
                    step === steps.length - 1 ? (
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Chargement...' : 'Valider les informations'}
                      </Button>
                    ) : (
                      <Button type="button" onClick={handleNext} disabled={loading}>
                        {loading ? 'Chargement...' : 'Suivant'}
                      </Button>
                    )
                  ) : (
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Chargement...' : 'Créer le compte'}
                    </Button>
                  )
                ) : (
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Chargement...' : 'Se connecter'}
                  </Button>
                )}
              </CardFooter>
            </form>
          )}
          {apiError && <div className="text-red-500 text-xs mb-2">{apiError}</div>}
        </Card>
      </div>
      <div className="mt-8 text-center text-muted-foreground text-xs max-w-md">
        {mode === 'register'
          ? registerStep === 'confirmation'
            ? ''
            : 'Ces informations serviront de base contextuelle pour vos agents d’intelligence commerciale.'
          : 'Connectez-vous à votre compte pour accéder à la plateforme.'}
      </div>
    </div>
  );
}

export default Auth;
