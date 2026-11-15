const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const total = await prisma.offer.count();
  console.log(`Checking all ${total} offers...`);

  let skip = 0;
  let errors = 0;
  const batchSize = 2000;

  while (skip < total) {
    const chunk = await prisma.offer.findMany({
      skip,
      take: batchSize,
      include: {
        business: true,
        category: true,
      },
    });

    for (const o of chunk) {
      if (!o.business) {
        console.error(`Offer ${o.id} has no business!`);
        errors++;
      }
      if (!o.category) {
        console.error(`Offer ${o.id} has no category!`);
        errors++;
      }
      if (!o.category?.icon) {
        console.error(`Offer ${o.id} category has no icon!`);
        errors++;
      }
      if (!o.category?.name) {
        console.error(`Offer ${o.id} category has no name!`);
        errors++;
      }
      if (!o.title) {
        console.error(`Offer ${o.id} has no title!`);
        errors++;
      }
      if (typeof o.originalPriceCents !== 'number' || isNaN(o.originalPriceCents)) {
        console.error(`Offer ${o.id} invalid originalPriceCents!`);
        errors++;
      }
      if (typeof o.discountPriceCents !== 'number' || isNaN(o.discountPriceCents)) {
        console.error(`Offer ${o.id} invalid discountPriceCents!`);
        errors++;
      }
      if (!o.currency) {
        console.error(`Offer ${o.id} has no currency!`);
        errors++;
      }
      if (!o.endsAt || isNaN(new Date(o.endsAt).getTime())) {
        console.error(`Offer ${o.id} has invalid endsAt!`);
        errors++;
      }
    }

    skip += chunk.length;
    console.log(`Checked ${skip} / ${total} offers...`);
  }

  console.log(`Finished. Total errors found: ${errors}`);
  await prisma.$disconnect();
}

check();
