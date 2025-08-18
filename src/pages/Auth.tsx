import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      const res = await fetch(`${API_BASE}/auth/register/`, {
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
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Email ou mot de passe incorrect');
      
      // On s'attend à recevoir { access_token: string, profile_exists: boolean }
      const data = await res.json();
      
      if (data && data.access_token) {
        console.log("Auth.tsx - Login successful, calling login from useAuth. Token:", data.access_token);
        login(data.access_token);
        // Explicitly navigate to the dashboard after successful login
        navigate('/');
      } else {
        console.error("Auth.tsx - API response invalid:", data);
        throw new Error('Réponse de l\'API invalide');
      }

    } catch (err: any) {
      setApiError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-leadryve-purple/10 to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="flex-grow flex flex-col justify-center items-center w-full">
        <img src="/Logo.svg" alt="Leadryve Logo" className="md:h-25 h-14  mb-8" />
        <Card className="w-full max-w-md shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{mode === 'register' ? 'Créer votre compte' : 'Connexion'}</CardTitle>
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
                  <div className="relative">
                    <Input name="password" type={showPassword ? 'text' : 'password'} value={signupForm.password} onChange={handleSignupChange} required autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                </div>
                <div>
                  <Label>Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={signupForm.confirmPassword} onChange={handleSignupChange} required autoComplete="new-password" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
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
                  <div className="relative">
                    <Input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} required autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Chargement...' : 'Se connecter'}
                </Button>
              </CardFooter>
            </form>
          )}
          {apiError && <div className="text-red-500 text-xs p-4 text-center">{apiError}</div>}
        </Card>
        <div className="mt-6 text-center text-sm">
          {mode === 'register' ? (
            <p>
              Vous avez déjà un compte ?{' '}
              <button onClick={() => setMode('login')} className="font-semibold text-leadryve-purple hover:underline focus:outline-none">
                Se connecter
              </button>
            </p>
          ) : (
            <p>
              Vous n'avez pas de compte ?{' '}
              <button onClick={() => setMode('register')} className="font-semibold text-leadryve-purple hover:underline focus:outline-none">
                S'inscrire
              </button>
            </p>
          )}
        </div>
      </div>
      <div className="w-full text-center text-muted-foreground text-xs max-w-md py-4">
        {mode === 'register'
          ? 'Un email de confirmation vous sera envoyé après inscription.'
          : 'Connectez-vous pour accéder à votre espace.'}
      </div>
    </div>
  );
};

export default Auth;
