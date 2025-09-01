import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-900">
      {/* Navbar (simplified for policy pages) */}
      <nav className="w-full py-4 sm:py-6 bg-white shadow-sm">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-[100px] mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/Logo.svg" alt="Leadryve Logo" className="h-8 sm:h-10" />
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <Link to="/" className="text-sm sm:text-base text-gray-700 hover:text-leadryve-purple font-medium">Accueil</Link>
            <Link to="/privacy-policy" className="text-sm sm:text-base text-gray-700 hover:text-leadryve-purple font-medium">Politique de confidentialité</Link>
          </div>
        </div>
      </nav>

      <div className="responsive-container py-16 sm:py-24 lg:py-32 px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-center mb-10 sm:mb-12">
          Conditions Générales d'Utilisation
        </h1>

        <div className="prose prose-lg mx-auto text-gray-700 text-base sm:text-lg">
          <p className="mb-6">
            Bienvenue sur Leadryve. En accédant ou en utilisant notre service, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation. Veuillez les lire attentivement.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">1. Acceptation des Conditions</h2>
          <p className="mb-6">
            En utilisant Leadryve, vous confirmez que vous avez lu, compris et accepté les présentes conditions, ainsi que notre Politique de Confidentialité. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser notre service.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">2. Modifications des Conditions</h2>
          <p className="mb-6">
            Nous nous réservons le droit de modifier ou de remplacer ces Conditions à tout moment. Nous vous informerons de tout changement en publiant les nouvelles Conditions sur cette page. Il est de votre responsabilité de consulter régulièrement ces Conditions pour prendre connaissance des modifications.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">3. Accès au Service</h2>
          <p className="mb-6">
            Leadryve est un service de génération de leads B2B. Vous devez avoir au moins 18 ans pour utiliser notre service. Nous nous réservons le droit de refuser le service à quiconque pour quelque raison que ce soit et à tout moment.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">4. Comptes Utilisateur</h2>
          <p className="mb-6">
            Lorsque vous créez un compte chez nous, vous devez nous fournir des informations exactes, complètes et à jour. Le non-respect de cette obligation constitue une violation des Conditions, ce qui peut entraîner la résiliation immédiate de votre compte sur notre Service. Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités qui se produisent sous votre compte.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">5. Contenu Utilisateur</h2>
          <p className="mb-6">
            Vous êtes seul responsable du contenu que vous publiez sur Leadryve. Vous déclarez et garantissez que vous possédez ou avez les licences nécessaires pour utiliser et autoriser Leadryve à utiliser tout votre Contenu Utilisateur.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">6. Résiliation</h2>
          <p className="mb-6">
            Nous pouvons résilier ou suspendre votre compte immédiatement, sans préavis ni responsabilité, pour quelque raison que ce soit, y compris, sans limitation, si vous violez les Conditions.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">7. Limitation de Responsabilité</h2>
          <p className="mb-6">
            En aucun cas Leadryve, ni ses directeurs, employés, partenaires, agents, fournisseurs ou affiliés, ne seront responsables de tout dommage indirect, accessoire, spécial, consécutif ou punitif, y compris, sans limitation, la perte de profits, de données, d'utilisation, de clientèle ou d'autres pertes intangibles, résultant de (i) votre accès ou votre utilisation ou votre incapacité à accéder ou à utiliser le Service ; (ii) tout comportement ou contenu de tiers sur le Service ; (iii) tout contenu obtenu du Service ; et (iv) l'accès, l'utilisation ou l'altération non autorisés de vos transmissions ou de votre contenu, qu'ils soient basés sur une garantie, un contrat, un délit (y compris la négligence) ou toute autre théorie juridique, que nous ayons été informés ou non de la possibilité de tels dommages, et même si un recours énoncé ici s'avère avoir échoué à son objectif essentiel.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">8. Droit Applicable</h2>
          <p className="mb-6">
            Les présentes Conditions seront régies et interprétées conformément aux lois du Cameroun, sans égard à ses dispositions en matière de conflit de lois.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">9. Contactez-nous</h2>
          <p>
            Si vous avez des questions concernant ces Conditions, veuillez nous contacter à l'adresse suivante : support@leadryve.com.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 sm:py-8">
        <div className="responsive-container text-center text-gray-400 px-4">
          <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} Leadryve. Tous droits réservés.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 text-sm sm:text-base">
            <Link to="/privacy-policy" className="hover:text-white">Politique de confidentialité</Link>
            <Link to="/terms-of-service" className="hover:text-white">Conditions d'utilisation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
