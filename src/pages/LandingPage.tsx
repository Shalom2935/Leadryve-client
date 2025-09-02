import React from 'react';
import { Button } from "@/components/ui/button"; // Assuming Button component is available
import { Link } from "react-router-dom"; // For navigation
import { Play, User, Target, Zap, Mail, Menu } from 'lucide-react'; // Import icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-900">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden pt-16 sm:pt-24 lg:pt-32 pb-10 bg-gradient-to-br from-white to-leadryve-light-purple/50 bg-cover bg-center"
        style={{ backgroundImage: `url(/hero-bg.png)`}}
      >
        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-10 w-full py-4 sm:py-6 bg-white shadow-sm">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-[100px] mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/Logo.svg" alt="Leadryve Logo" className="h-8 sm:h-10" />
            </div>
            <div className="hidden sm:flex items-center space-x-4 sm:space-x-6">
              <Link to="/pricing" className="text-sm sm:text-base text-gray-700 hover:text-leadryve-purple font-medium">Tarifs</Link>
              <a href="https://leadryve.com/privacy-policy" className="text-sm sm:text-base text-gray-700 hover:text-leadryve-purple font-medium">Politique de confidentialité</a>
              <a href="https://app.leadryve.com">
              <Button className="bg-leadryve-purple hover:bg-leadryve-purple/90 text-white font-regular py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base">
                Commencer maintenant
              </Button>
              </a>
            </div>
            {/* Mobile Menu */}
            <div className="sm:hidden flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/pricing" className="w-full text-gray-700 hover:text-leadryve-purple">Tarifs</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="https://leadryve.com/privacy-policy" className="w-full text-gray-700 hover:text-leadryve-purple">Politique de confidentialité</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://app.leadryve.com" className="w-full bg-leadryve-purple text-white text-center py-2 rounded-md">Commencer maintenant</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>

        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-[100px] mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-[var(--navbar-height)]">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left max-w-full lg:max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-[521] leading-tight lg:leading-[72px] tracking-[-1px] lg:tracking-[-1.5px] mb-4 sm:mb-6">
              Leadryve — Votre outil N°1 pour la génération de leads B2B au Cameroun.
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
              Trouvez, qualifiez et contactez vos clients idéaux en quelques clics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
              <Button asChild className="bg-leadryve-purple hover:bg-leadryve-purple/90 text-white font-regular py-3 px-6 sm:px-8 rounded-md text-sm sm:text-md">
                <a href="https://app.leadryve.com/">Commencer</a>
              </Button>
              <Button variant="outline" className="border-leadryve-purple text-leadryve-purple hover:bg-leadryve-purple/10 hover:border-[3px] font-regular py-3 px-6 sm:px-8 rounded-md text-sm sm:text-md">
                <Play className="mr-2 h-4 w-4" /> Voir la démo
              </Button>
            </div>
          </div>

          {/* Right Illustration (iPhone Mockup) */}
          <div className="flex-1 flex justify-center lg:justify-end relative">
            <img 
              src="/iphone.png" 
              alt="iPhone Mockup" 
              className="w-[80%] sm:w-[70%] h-auto max-w-xs sm:max-w-md lg:max-w-lg object-contain" 
            />
          </div>
        </div>
      </section>

      {/* Section Entreprises Enregistrées */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="responsive-container text-center px-4">
          <p className="text-3xl sm:text-4xl font-bold text-gray-600">
            +1000 Entreprises enregistrées
          </p>
        </div>
      </section>

      {/* Section "Maximisez votre potentiel commercial" */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white text-center">
        <div className="responsive-container flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-4">
          {/* Image à gauche */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <img src="/growth.png" alt="Growth illustration" className="w-full max-w-xs sm:max-w-md h-auto object-contain rounded-lg shadow-lg" />
          </div>

          {/* Contenu à droite */}
          <div className="flex-1 text-center lg:text-left max-w-full lg:max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-6 sm:mb-8">
              Maximisez votre potentiel commercial
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-full mx-auto lg:mx-0">
              Leadryve est votre partenaire stratégique pour une croissance accélérée. Transformez chaque opportunité en succès grâce à notre approche innovante de la génération de leads B2B.
            </p>
            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="flex items-start">
                <span className="text-leadryve-purple mr-3 text-xl sm:text-2xl">✓</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Ciblage Précis</h3>
                  <p className="text-sm sm:text-base text-gray-600">Identifiez et atteignez vos clients idéaux avec une précision inégalée.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-leadryve-purple mr-3 text-xl sm:text-2xl">✓</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Engagement Personnalisé</h3>
                  <p className="text-sm sm:text-base text-gray-600">Créez des connexions significatives grâce à des messages sur mesure.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-leadryve-purple mr-3 text-xl sm:text-2xl">✓</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Efficacité Redoutable</h3>
                  <p className="text-sm sm:text-base text-gray-600">Gagnez du temps et optimisez vos efforts de prospection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section "4 Etapes à réaliser!" */}
      <section className="pt-16 sm:pt-24 lg:pt-32 bg-gray-50 text-center">
        <div className="responsive-container px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-center mb-10 sm:mb-12">
            4 Etapes à réaliser!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-lg shadow-lg">
              <User className="h-10 w-10 sm:h-12 sm:w-12 text-leadryve-purple mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Renseignez votre profil</h3>
              <p className="text-sm sm:text-md text-gray-700">Donnez quelques informations sur votre entreprise et vos offres pour orienter Leadryve.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-lg shadow-lg">
              <Target className="h-10 w-10 sm:h-12 sm:w-12 text-leadryve-purple mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Créez votre mission</h3>
              <p className="text-sm sm:text-md text-gray-700">Définissez le type de clients que vous souhaitez cibler (votre persona).</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-lg shadow-lg">
              <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-leadryve-purple mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Générez des opportunités</h3>
              <p className="text-sm sm:text-md text-gray-700">Leadryve identifie et sélectionne pour vous les prospects les plus pertinents.</p>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-lg shadow-lg">
              <Mail className="h-10 w-10 sm:h-12 sm:w-12 text-leadryve-purple mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Contactez et convertissez</h3>
              <p className="text-sm sm:text-md text-gray-700">Recevez des messages personnalisés rédigés par Leadryve, adaptés à chaque lead selon ses activités et vos produits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA "Commencer en 30s" */}
      <div className="py-12 sm:py-16 lg:py-24 bg-gray-50 text-center">
        <div className="responsive-container px-4">
          <Button asChild className="bg-leadryve-purple hover:bg-leadryve-purple/90 text-white font-regular py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base">
            <a href="https://app.leadryve.com/">Commencer en 30s</a>
          </Button>
        </div>
      </div>

      {/* Section "Une touche unique" */}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 sm:py-8">
        <div className="responsive-container text-center text-gray-400 px-4">
          <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} Leadryve. Tous droits réservés.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 text-sm sm:text-base">
            <a href="https://leadryve.com/privacy-policy" className="hover:text-white">Politique de confidentialité</a>
            <a href="https://leadryve.com/terms-of-service" className="hover:text-white">Conditions d'utilisation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
