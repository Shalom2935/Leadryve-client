import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Nouveau type pour le signup simple
const SignupForm = {
  email: '',
  password: '',
  confirmPassword: '',
};

const Auth = () => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [signupForm, setSignupForm] = useState({ ...SignupForm });
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validateSignup = (form: typeof SignupForm) => {
    const errors: Record<string, string> = {};
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = 'Email valide requis';
    if (!form.password || form.password.length < 8) errors.password = 'Mot de passe (min 8 caractères)';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    return errors;
  };
  const validateLogin = (form: { email: string; password: string }) => {
    const errors: Record<string, string> = {};
    if (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = 'Email valide requis';
    if (!form.password) errors.password = 'Mot de passe requis';
    return errors;
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const errs = validateSignup(signupForm);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupForm),
      });
      if (!res.ok) throw new Error('Erreur lors de l’inscription');
      setLoading(false);
      const data = await res.json();
      const email = data?.email || signupForm.email;
      navigate(`/auth/confirm-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setApiError(err.message || 'Erreur inconnue');
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const errs = validateLogin(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Email ou mot de passe incorrect');
      const data = await res.json();
      if (data && data.access_token) login(data.access_token);
      navigate('/');
    } catch (err: any) {
      setApiError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-leadryve-purple/10 to-slate-100">
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
            <CardTitle>{mode === 'register' ? 'Créer votre compte' : 'Connexion à votre compte'}</CardTitle>
          </CardHeader>
          {mode === 'register' ? (
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input name="email" type="email" value={signupForm.email} onChange={handleSignupChange} required />
                  {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                </div>
                <div>
                  <Label>Mot de passe</Label>
                  <Input name="password" type="password" value={signupForm.password} onChange={handleSignupChange} required autoComplete="new-password" />
                  {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                </div>
                <div>
                  <Label>Confirmer le mot de passe</Label>
                  <Input name="confirmPassword" type="password" value={signupForm.confirmPassword} onChange={handleSignupChange} required autoComplete="new-password" />
                  {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Chargement...' : 'Créer le compte'}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Mot de passe</Label>
                  <Input name="password" type="password" value={form.password} onChange={handleChange} required autoComplete="current-password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Chargement...' : 'Se connecter'}
                </Button>
              </CardFooter>
            </form>
          )}
          {apiError && <div className="text-red-500 text-xs mb-2">{apiError}</div>}
        </Card>
      </div>
      <div className="mt-8 text-center text-muted-foreground text-xs max-w-md">
        {mode === 'register'
          ? 'Un email de confirmation vous sera envoyé après inscription.'
          : 'Connectez-vous à votre compte pour accéder à la plateforme.'}
      </div>
    </div>
  );
};

export default Auth;
