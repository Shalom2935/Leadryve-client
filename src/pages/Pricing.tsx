import React from 'react';
import usePageTitle from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";

const Pricing = () => {
  usePageTitle("Tarifs");

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
            <Link to="/terms-of-service" className="text-sm sm:text-base text-gray-700 hover:text-leadryve-purple font-medium">Conditions d'utilisation</Link>
          </div>
        </div>
      </nav>

      <div className="responsive-container py-16 sm:py-24 lg:py-32 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-center mb-10">
          Nos Tarifs
        </h1>

        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg border border-leadryve-purple">
          <h2 className="text-2xl font-semibold mb-4 text-leadryve-purple">Plan Unique</h2>
          <p className="text-4xl font-bold text-gray-900 mb-4">3000 FCFA</p>
          <p className="text-lg text-gray-700 mb-8">/ mois pour 50 leads</p>
          <ul className="text-gray-700 text-left mb-8 space-y-2 text-base">
            <li>✓ 50 leads par mois</li>
            <li>✓ Rapports de pertinence détaillés</li>
            <li>✓ Accès complet aux fonctionnalités</li>
            <li>✓ Support client</li>
          </ul>
          <p className="text-sm text-gray-500">
            Ce plan est indicatif et sera mis à jour avec de nouvelles offres prochainement.
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

export default Pricing;
