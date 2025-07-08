import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const AuthProfile = () => {
  const [form, setForm] = useState({
    companyName: '',
    sector: '',
    services: '',
    area: '',
    target: '',
    positioning: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    socials: '',
    pitch: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save profile data to context or backend
    // Redirect to dashboard or next step
  };

  return (
    <AppLayout>
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Créer votre profil de prospection</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Merci de renseigner les informations sur votre activité. Ces données serviront de base contextuelle pour vos agents d’intelligence commerciale.
            </p>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label>Nom de l’entreprise / Nom du solopreneur</Label>
                <Input name="companyName" value={form.companyName} onChange={handleChange} required />
              </div>
              <div>
                <Label>Secteur d’activité</Label>
                <Input name="sector" value={form.sector} onChange={handleChange} required />
              </div>
              <div>
                <Label>Services/produits proposés</Label>
                <Input name="services" value={form.services} onChange={handleChange} required />
              </div>
              <div>
                <Label>Zone géographique couverte</Label>
                <Input name="area" value={form.area} onChange={handleChange} required />
              </div>
              <div>
                <Label>Clientèle cible</Label>
                <Input name="target" value={form.target} onChange={handleChange} required />
              </div>
              <div>
                <Label>Positionnement (haut de gamme, local, etc.)</Label>
                <Input name="positioning" value={form.positioning} onChange={handleChange} required />
              </div>
              <div>
                <Label>Adresse</Label>
                <Input name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div>
                <Label>Site web</Label>
                <Input name="website" value={form.website} onChange={handleChange} />
              </div>
              <div>
                <Label>Réseaux sociaux</Label>
                <Input name="socials" value={form.socials} onChange={handleChange} />
              </div>
              <div>
                <Label>Message-type ou pitch commercial existant (optionnel)</Label>
                <Textarea name="pitch" value={form.pitch} onChange={handleChange} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">Enregistrer et continuer</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AuthProfile;
