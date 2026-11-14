import { Scale, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ConditionsGeneralesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-3">
          <Scale className="w-4 h-4" />
          Conditions Générales d&apos;Utilisation & Vente
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Conditions Générales d&apos;Utilisation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Dernière mise à jour : 22 octobre 2026
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm space-y-6 text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            1. Objet et acceptation des conditions
          </h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU ») régissent l&apos;accès et l&apos;utilisation des services proposés par la plateforme <strong>LocalDeals</strong>. En utilisant le site pour consulter des offres ou réserver des coupons, l&apos;utilisateur accepte sans réserve les présentes CGU.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            2. Gratuité du service pour les résidents
          </h2>
          <p>
            L&apos;accès à la plateforme, la consultation des offres locales et la génération de coupons de réduction sont <strong>100% gratuits</strong> pour les résidents et consommateurs. Aucun paiement n&apos;est exigé par LocalDeals pour obtenir un coupon.
          </p>
          <p>
            Le règlement du produit ou du service après déduction de la remise s&apos;effectue directement auprès du commerçant partenaire lors de votre visite en magasin.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            3. Respect de la Directive européenne Omnibus (Transparence des réductions)
          </h2>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Article L. 112-1-1 du Code de la consommation
            </div>
            <p className="text-amber-800 leading-relaxed">
              Toute annonce d&apos;une réduction de prix doit indiquer le prix antérieur pratiqué par le commerçant avant l&apos;application de la réduction. Le prix antérieur correspond au prix le plus bas pratiqué par le professionnel à l&apos;égard de tous les consommateurs au cours des 30 derniers jours précédant l&apos;offre.
            </p>
          </div>
          <p>
            Les commerçants partenaires s&apos;engagent formellement sur l&apos;honneur et par contrat à ne publier que des prix de référence véridiques et attestables.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            4. Fonctionnement et validité des coupons
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Chaque coupon dispose d&apos;un code alphanumérique unique et d&apos;une date limite de validité.</li>
            <li>Le coupon est valable une seule fois par personne, sauf mention contraire dans les conditions particulières du commerçant.</li>
            <li>En cas de litige avec un commerçant, l&apos;utilisateur peut utiliser la fonction « Signaler cette offre » sur la plateforme pour engager une médiation.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
