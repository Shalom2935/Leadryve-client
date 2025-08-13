import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Checkbox } from '@/components/ui/checkbox';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const REGIONS = [
  'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest', 'Cameroun', 'International'
];
const EMPLOYEE_RANGES = [
  '1', '2-10', '11-50', '51-250', '251-1000', '1001+',
];

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

type OpeningHours = {
  monday: { start: string; end: string };
  tuesday: { start: string; end: string };
  wednesday: { start: string; end: string };
  thursday: { start: string; end: string };
  friday: { start: string; end: string };
  saturday: { start: string; end: string };
  sunday: { start: string; end: string };
};

type SocialLinks = {
    linkedin: string;
    facebook: string;
    instagram: string;
    x: string;
};
type ProfileFormFields = {
  name: string;
  companyName: string;
  role: string;
  sector: string;
  services: string[];
  geo_coverage: string[];
  employees: string;
  openingHours: OpeningHours;
  address: string;
  email: string;
  phone: string;
  website?: string;
  social_links?: SocialLinks;
  pitch?: string;
};

const DEFAULT_OPENING_HOURS: OpeningHours = {
  monday: { start: '08:00', end: '18:00' },
  tuesday: { start: '08:00', end: '18:00' },
  wednesday: { start: '08:00', end: '18:00' },
  thursday: { start: '08:00', end: '18:00' },
  friday: { start: '08:00', end: '18:00' },
  saturday: { start: '', end: '' },
  sunday: { start: '', end: '' },
};

const steps = [
  'Identité',
  'Coordonnées',
  'Message (Pitch)'
];

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ProfileFormFields>({
    name: '',
    companyName: '',
    role: '',
    sector: '',
    services: [''],
    geo_coverage: [],
    employees: '',
    openingHours: { ...DEFAULT_OPENING_HOURS },
    address: '',
    email: '',
    phone: '',
    website: '',
    social_links: {
        linkedin: '',
        facebook: '',
        instagram: '',
        x: '',
    },
    pitch: '',
  });

  const [openingDays, setOpeningDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { refetch } = useProfile();
  const { token } = useAuth();
  const navigate = useNavigate();

  const dayTranslations: { [key: string]: string } = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpeningHoursChange = (day: keyof OpeningHours, part: 'start' | 'end', value: string) => {
    setForm(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [part]: value }
      }
    }));
  };

  const handleOpenDayToggle = (day: keyof OpeningHours) => {
    setOpeningDays(prev => {
      const isOpen = !prev[day];
      const newHours = isOpen ? { start: '08:00', end: '18:00' } : { start: '', end: '' };
      handleOpeningHoursChange(day, 'start', newHours.start);
      handleOpeningHoursChange(day, 'end', newHours.end);
      return { ...prev, [day]: isOpen };
    });
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
      const exists = prev.geo_coverage.includes(region);
      return {
        ...prev,
        geo_coverage: exists
          ? prev.geo_coverage.filter((r: string) => r !== region)
          : [...prev.geo_coverage, region],
      };
    });
  };
  const handleEmployeeRange = (range: string) => {
    setForm({ ...form, employees: range });
  };
  const validateProfile = (form: ProfileFormFields) => {
    const errors: Record<string, string> = {};
    if (!form.name) errors.name = 'Nom requis';
    if (!form.companyName) errors.companyName = 'Nom entreprise requis';
    if (!form.role) errors.role = 'Rôle requis';
    if (!form.sector) errors.sector = 'Secteur d\'activité requis';
    if (!form.geo_coverage.length) errors.regions = 'Sélectionnez au moins une zone';
    if (!form.employees) errors.employees = 'Sélectionnez une plage';
    return errors;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const errs = validateProfile(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);

    const payload = {
      name: form.name,
      company_name: form.companyName,
      role: form.role,
      sector: form.sector,
      services: form.services,
      geo_coverage: form.geo_coverage,
      employees: form.employees,
      opening_hours: form.openingHours,
      location: form.address,
      company_email: form.email,
      phone_number: form.phone,
      website: form.website,
      social_links: form.social_links,
      pitch: form.pitch,
    };

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Erreur lors de la création du profil');
      }
      await refetch();
      navigate('/');
    } catch (err: any) {
      setApiError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };
  // Step navigation
  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // Progress bar
  const progress = Math.round((step / 3) * 100);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-leadryve-purple/10 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mb-4">
        <div className="flex items-center gap-2 mb-2">
          {steps.map((label, idx) => (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step === idx + 1 ? 'bg-leadryve-purple' : 'bg-slate-300'}`}>{idx + 1}</div>
              <span className="text-xs mt-1 text-center">{label}</span>
            </div>
            ))}
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full">
          <div className="h-2 bg-leadryve-purple rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <Card className="w-full max-w-2xl shadow-xl animate-fade-in">
        <CardHeader>
          <CardTitle>Complétez votre profil</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            {step === 1 && (
              <React.Fragment>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Nom de l’entreprise</Label>
                    <Input name="companyName" value={form.companyName} onChange={handleChange} required />
                    {errors.companyName && <div className="text-red-500 text-xs mt-1">{errors.companyName}</div>}
                  </div>
                  <div>
                    <Label>Nom</Label>
                    <Input name="name" value={form.name} onChange={handleChange} required />
                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                  </div>
                </div>
                <div>
                  <Label>Rôle</Label>
                  <Input name="role" value={form.role} onChange={handleChange} required />
                  {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role}</div>}
                </div>
                <div>
                  <Label>Secteur d'activité</Label>
                  <Input name="sector" value={form.sector} onChange={handleChange} required />
                  {errors.sector && <div className="text-red-500 text-xs mt-1">{errors.sector}</div>}
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
                        className={`px-3 py-1 rounded-full border text-xs transition-all ${form.geo_coverage.includes(region) ? 'bg-leadryve-purple text-white border-leadryve-purple' : 'bg-white border-slate-300 text-slate-700'}`}
                        onClick={() => handleRegionToggle(region)}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                  {form.geo_coverage.length === 0 && <div className="text-xs text-red-500 mt-1">Sélectionnez au moins une zone</div>}
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
                  <Label>Horaires d'ouverture</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {(Object.keys(dayTranslations) as Array<keyof OpeningHours>).map((day) => (
                      <div key={day} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={day}
                            checked={openingDays[day]}
                            onCheckedChange={() => handleOpenDayToggle(day)}
                          />
                          <label htmlFor={day} className="text-sm font-medium leading-none">
                            {dayTranslations[day]}
                          </label>
                        </div>
                        {openingDays[day] && (
                          <div className="flex items-center gap-2 pl-6">
                            <Input
                              type="time"
                              name={`openingHours-${day}-start`}
                              value={form.openingHours[day].start}
                              onChange={e => handleOpeningHoursChange(day, 'start', e.target.value)}
                              className="flex-1"
                            />
                            <span className="text-xs">-</span>
                            <Input
                              type="time"
                              name={`openingHours-${day}-end`}
                              value={form.openingHours[day].end}
                              onChange={e => handleOpeningHoursChange(day, 'end', e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            )}
            {step === 2 && (
              <React.Fragment>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Email Professionnelle</Label>
                    <Input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="" />
                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input name="phone" value={form.phone} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <Label>Adresse (Localisation)</Label>
                  <Input name="address" value={form.address} onChange={handleChange} />
                </div>
                <div>
                  <Label>Site web</Label>
                  <Input name="website" value={form.website} onChange={handleChange} placeholder="https://www.votre-site.com" />
                </div>
                <div>
                  <Label>Réseaux sociaux</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-xs font-medium">LinkedIn</span>
                      <Input name="linkedin" value={form.social_links.linkedin} onChange={handleChange} className="flex-1" placeholder="Lien vers le profil LinkedIn" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-xs font-medium">Facebook</span>
                      <Input name="facebook" value={form.social_links.facebook} onChange={handleChange} className="flex-1" placeholder="Lien vers la page Facebook" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-xs font-medium">Instagram</span>
                      <Input name="instagram" value={form.social_links.instagram} onChange={handleChange} className="flex-1" placeholder="Lien vers le profil Instagram" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-xs font-medium">X</span>
                      <Input name="x" value={form.social_links.x} onChange={handleChange} className="flex-1" placeholder="Lien vers le profil X" />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
            {step === 3 && (
              <React.Fragment>
                <div>
                  <Label>Message-type ou pitch commercial existant (optionnel)</Label>
                  <Textarea name="pitch" value={form.pitch} onChange={handleChange} />
                </div>
              </React.Fragment>
            )}
          </CardContent>
          <CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-between w-full gap-2">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} className="w-full sm:w-auto">Précédent</Button>
            )}
            <div className="w-full sm:w-auto flex justify-end">
              {step < 3 ? (
                <Button type="button" onClick={nextStep} className="w-full sm:w-auto">Suivant</Button>
              ) : (
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? 'Chargement...' : 'Valider le profil'}
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
        {apiError && <div className="text-red-500 text-xs mb-2">{apiError}</div>}
      </Card>
      <p className="text-xs text-slate-500 mt-4 text-center max-w-xl">
        Ces informations serviront de base contextuelle à votre agent commercial.
      </p>
    </div>
  );
};

export default ProfileSetup;
