import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { MailCheck } from 'lucide-react';

const CheckEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-leadryve-purple/10 to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="flex-grow flex flex-col justify-center items-center w-full">
        <img src="/Logo.svg" alt="Leadryve Logo" className="md:h-25 h-14  mb-8" />
        <Card className="w-full max-w-md shadow-xl animate-fade-in text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Vérifiez votre boîte mail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <MailCheck size={64} className="text-leadryve-purple" />
            </div>
            <p className="text-muted-foreground">
              Nous avons envoyé un lien de réinitialisation de mot de passe à l'adresse{' '}
              <span className="font-semibold text-leadryve-purple">{email || 'votre adresse email'}</span>.
            </p>
            <p className="text-muted-foreground">
              Veuillez vérifier votre dossier de spams si vous ne le trouvez pas dans votre boîte de réception.
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Retour à la connexion
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="w-full text-center text-muted-foreground text-xs max-w-md py-4">
        Si vous n'avez pas reçu l'email, veuillez réessayer ou contacter le support.
      </div>
    </div>
  );
};

export default CheckEmail;
