import { FileText, Shield, Building } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-3">
          <FileText className="w-4 h-4" />
          Conformité Loi LCEN (France)
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Mentions Légales</h1>
        <p className="text-xs text-slate-500 mt-1">
          Dernière mise à jour : 22 octobre 2026
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm space-y-6 text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            1. Éditeur de la plateforme
          </h2>
          <p>
            Le site <strong>LocalDeals</strong> (ci-après « la Plateforme ») est édité par l&apos;équipe projet LocalDeals France.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Dénomination :</strong> LocalDeals SAS (en cours d&apos;immatriculation)</li>
            <li><strong>Siège social :</strong> 75011 Paris, France</li>
            <li><strong>Email de contact :</strong> contact@localdeals.fr</li>
            <li><strong>Directrice de la publication :</strong> Claire Dubois</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            2. Hébergement
          </h2>
          <p>
            La Plateforme est hébergée sur des infrastructures cloud sécurisées conformes aux normes européennes de protection des données :
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Hébergeur :</strong> Vercel Inc. / AWS Cloud Region Europe (Paris / Francfort)</li>
            <li><strong>Adresse :</strong> 440 N Barranca Ave #4133 Covina, CA 91723</li>
            <li><strong>Certificat de sécurité :</strong> Chiffrement TLS 1.3 / HTTPS 256 bits</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            3. Rôle de la plateforme & Nature des offres
          </h2>
          <p>
            LocalDeals agit en qualité d&apos;intermédiaire technique et d&apos;opérateur de plateforme de mise en relation au sens de l&apos;article L. 111-7 du Code de la consommation.
          </p>
          <p>
            Les offres, promotions, remises et coupons sont directement émis et exécutés par les commerçants partenaires indépendants. Chaque commerçant partenaire est seul responsable du respect de ses engagements contractuels, de la qualité des produits ou prestations fournis et de la sincérité des prix de référence affichés.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            4. Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des éléments constituant le site LocalDeals (textes, logos, arborescence, base de données, code source, graphismes) sont protégés par le droit de la propriété intellectuelle. Toute reproduction ou utilisation non autorisée est passible de sanctions au titre du Code de la propriété intellectuelle.
          </p>
        </section>
      </div>
    </div>
  );
}
