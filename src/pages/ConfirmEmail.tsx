import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';



const ConfirmEmail = () => {
  // Récupère l'email depuis l'URL (query param)
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get('email');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-leadryve-purple/10 to-blue-100">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center border-t-8 border-leadryve-purple animate-fade-in">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4 text-leadryve-purple"><path fill="currentColor" d="M12 13.5c-.28 0-.53-.11-.71-.29l-7-7a1 1 0 0 1 1.42-1.42l6.29 6.3 6.3-6.3a1 1 0 1 1 1.41 1.42l-7 7c-.18.18-.43.29-.71.29Z"/></svg>
        <h1 className="text-2xl font-bold text-leadryve-purple mb-2">Vérifiez votre boîte mail</h1>
        <p className="text-slate-700 mb-2">Un email de confirmation a été envoyé à&nbsp;:</p>
        <p className="font-semibold text-leadryve-purple mb-4">{email}</p>
        <p className="text-slate-500 text-sm mb-4">Cliquez sur le lien reçu pour activer votre compte.<br/>Pensez à vérifier vos spams.</p>
          <Button onClick={() => navigate('/auth')} className="w-full">
            Retour à la connexion
          </Button>
        <div className="mt-6">
          <span className="inline-block bg-leadryve-purple/10 text-leadryve-purple px-4 py-2 rounded-full text-xs font-medium">Leadryve</span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
