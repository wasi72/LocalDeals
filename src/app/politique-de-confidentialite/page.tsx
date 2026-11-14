import { Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-3">
          <Shield className="w-4 h-4" />
          Règlement Général sur la Protection des Données (RGPD / CNIL)
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Politique de Confidentialité
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Dernière mise à jour : 22 octobre 2026
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm space-y-6 text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            1. Notre engagement de sobriété numérique
          </h2>
          <p>
            Chez LocalDeals, nous respectons scrupuleusement le principe de <strong>minimisation des données</strong> édicté par le RGPD. Nous ne collectons que les informations strictement nécessaires à la réservation de vos coupons chez les commerçants de votre quartier.
          </p>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-950 block">Aucune revente de données</strong>
              <span className="text-xs text-emerald-900">
                Vos données personnelles ne sont jamais vendues, louées ou cédées à des courtiers en données ou régies publicitaires tierces.
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            2. Données collectées et finalités
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>
              <strong>Résidents / Utilisateurs :</strong> Adresse email (uniquement pour l&apos;envoi et la sauvegarde de vos coupons de réduction), historique des coupons réclamés.
            </li>
            <li>
              <strong>Données de localisation :</strong> Si vous choisissez d&apos;activer la recherche à proximité, vos coordonnées GPS sont traitées localement dans votre navigateur pour calculer les distances en kilomètres. Elles ne sont pas enregistrées sur nos serveurs.
            </li>
            <li>
              <strong>Commerçants partenaires :</strong> Nom de l&apos;enseigne, numéro SIRET, adresse commerciale, coordonnées de contact professionnelles.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            3. Vos droits RGPD (Accès, Rectification, Suppression)
          </h2>
          <p>
            Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants concernant vos données à caractère personnel :
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Droit d&apos;accès et d&apos;obtention d&apos;une copie de vos données</li>
            <li>Droit de rectification de données inexactes</li>
            <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
            <li>Droit à la limitation du traitement et droit d&apos;opposition</li>
          </ul>
          <p>
            Pour exercer vos droits, adressez simplement un email à notre délégué à la protection des données : <strong>dpo@localdeals.fr</strong>. Une réponse vous sera apportée sous 30 jours calendaires maximum.
          </p>
          <p className="text-xs text-slate-500">
            Vous conservez également le droit d&apos;introduire une réclamation auprès de la Commission Nationale de l&apos;Informatique et des Libertés (CNIL — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline text-emerald-700">cnil.fr</a>).
          </p>
        </section>
      </div>
    </div>
  );
}
