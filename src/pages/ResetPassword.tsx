import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const ResetPassword = () => {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  // const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    // const uidParam = queryParams.get('uid');
    if (tokenParam) {
      setToken(tokenParam);
      // setUid(uidParam);
    } else {
      setApiError('Lien de réinitialisation de mot de passe invalide ou expiré.');
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = (form: { password: string; confirmPassword: string }) => {
    const errors: Record<string, string> = {};
    if (!form.password || form.password.length < 8) errors.password = 'Mot de passe (min 8 caractères)';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!token) {
      setApiError('Token manquant.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // uid: uid,
          token: token,
          new_password: form.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Erreur lors de la réinitialisation du mot de passe.');
      }

      setLoading(false);
      setApiError('Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.');
      navigate('/auth'); // Redirect to login page after successful reset
    } catch (err: any) {
      setApiError(err.message || 'Erreur inconnue lors de la réinitialisation du mot de passe.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-leadryve-purple/10 to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="flex-grow flex flex-col justify-center items-center w-full">
        <img src="/Logo.svg" alt="Leadryve Logo" className="md:h-25 h-14  mb-8" />
        <Card className="w-full max-w-md shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Réinitialiser votre mot de passe</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label>Nouveau mot de passe</Label>
                <div className="relative">
                  <Input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} required autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              </div>
              <div>
                <Label>Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Chargement...' : 'Réinitialiser'}
              </Button>
            </CardFooter>
          </form>
          {apiError && <div className="text-red-500 text-xs p-4 text-center">{apiError}</div>}
        </Card>
      </div>
      <div className="w-full text-center text-muted-foreground text-xs max-w-md py-4">
        Veuillez entrer votre nouveau mot de passe.
      </div>
    </div>
  );
};

export default ResetPassword;
