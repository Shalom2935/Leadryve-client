import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PasswordResetSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Mot de passe réinitialisé avec succès</CardTitle>
          <CardDescription>
            Votre mot de passe a été mis à jour. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Link to="/auth?mode=login">
            <Button className="w-full">Se connecter</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
