import React from 'react';
import usePageTitle from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  usePageTitle("Politique de Confidentialité");

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
            <Link to="/terms-of-service" className="text-sm sm:text-base text-gray-700 hover:text-leadryve-purple font-medium">Conditions d'utilisation</Link>
          </div>
        </div>
      </nav>

      <div className="responsive-container py-16 sm:py-24 lg:py-32 px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-center mb-10 sm:mb-12">
          Politique de Confidentialité
        </h1>
        <div className="prose prose-lg mx-auto text-gray-700 text-base sm:text-lg">
          <p className="mb-6">
            Chez Leadryve, nous nous engageons à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons et partageons vos informations personnelles lorsque vous utilisez notre service SaaS de génération de leads B2B alimenté par IA.
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Informations que nous collectons</h2>
          <p className="mb-6">
            Nous collectons des informations pour fournir de meilleurs services à tous nos utilisateurs. Les types d'informations que nous collectons incluent :
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>**Informations que vous nous donnez directement :** Par exemple, lorsque vous créez un compte Leadryve, nous vous demandons des informations personnelles, comme votre nom, votre adresse e-mail, votre numéro de téléphone et les détails de votre entreprise.</li>
            <li>**Informations que nous obtenons de votre utilisation de nos services :** Nous collectons des informations sur les services que vous utilisez et la manière dont vous les utilisez, comme les missions que vous créez, les leads générés et vos interactions avec notre plateforme.</li>
            <li>**Données de leads :** Dans le cadre de nos services de génération de leads, nous collectons et traitons des données publiques sur des entreprises et des professionnels. Ces données sont utilisées uniquement pour identifier des prospects pertinents pour votre entreprise.</li>
          </ul>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Comment nous utilisons les informations collectées</h2>
          <p className="mb-6">Nous utilisons les informations que nous collectons pour :</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Fournir, maintenir, protéger et améliorer nos services.</li>
            <li>Développer de nouveaux services.</li>
            <li>Personnaliser nos services pour vous, y compris la fourniture de contenu et de leads pertinents.</li>
            <li>Mesurer l'efficacité de nos campagnes marketing.</li>
            <li>Communiquer avec vous, par exemple pour vous informer des modifications ou des améliorations de nos services.</li>
          </ul>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Partage des informations</h2>
          <p className="mb-6">
            Nous ne partageons pas vos informations personnelles avec des entreprises, des organisations ou des individus extérieurs à Leadryve, sauf dans les cas suivants :
          </p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>**Avec votre consentement :** Nous partagerons des informations personnelles avec des entreprises, des organisations ou des individus extérieurs à Leadryve lorsque nous avons votre consentement.</li>
            <li>**Pour le traitement externe :** Nous transmettons des informations personnelles à nos affiliés ou à d'autres entreprises ou personnes de confiance qui les traitent pour notre compte, selon nos instructions et conformément à notre politique de confidentialité et à toute autre mesure de sécurité et de confidentialité appropriée.</li>
            <li>**Pour des raisons juridiques :** Nous partagerons des informations personnelles avec des entreprises, des organisations ou des individus extérieurs à Leadryve si nous pensons en toute bonne foi que l'accès, l'utilisation, la conservation ou la divulgation de ces informations est raisonnablement nécessaire pour :
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Répondre à toute demande légale applicable, y compris les demandes gouvernementales.</li>
                <li>Faire appliquer les conditions d'utilisation applicables, y compris les enquêtes sur les violations potentielles.</li>
                <li>Détecter, prévenir ou traiter de toute autre manière les activités frauduleuses, de sécurité ou techniques.</li>
                <li>Protéger les droits, la propriété ou la sécurité de Leadryve, de nos utilisateurs ou du public, comme l'exige ou le permet la loi.</li>
              </ul>
            </li>
          </ul>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Sécurité des informations</h2>
          <p className="mb-6">
            Nous mettons en œuvre des mesures de sécurité pour protéger vos informations contre l'accès non autorisé, la modification, la divulgation ou la destruction. Cela inclut le cryptage de nos services à l'aide de SSL, l'examen de nos pratiques de collecte, de stockage et de traitement des informations, y compris les mesures de sécurité physiques, ainsi que des mesures de sécurité pour protéger contre l'accès non autorisé aux systèmes où nous stockons des informations personnelles.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Modifications de cette politique de confidentialité</h2>
          <p className="mb-6">
            Notre politique de confidentialité peut être modifiée de temps à autre. Nous ne réduirons pas vos droits en vertu de cette politique de confidentialité sans votre consentement explicite. Nous publierons toute modification de la politique de confidentialité sur cette page et, si les modifications sont importantes, nous fournirons un avis plus visible (y compris, pour certains services, une notification par e-mail des modifications de la politique de confidentialité).
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

export default PrivacyPolicy;
