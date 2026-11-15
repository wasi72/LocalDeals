const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const currencies = await prisma.offer.groupBy({
    by: ['currency'],
    _count: { id: true },
  });
  console.log('Currencies in DB:', currencies);

  for (const c of currencies) {
    try {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: (c.currency || 'USD').toUpperCase(),
      }).format(12.34);
      console.log(`Currency ${c.currency}: OK -> ${formatted}`);
    } catch (e) {
      console.error(`ERROR with currency ${c.currency}:`, e.message);
    }
  }

  // Also check if any offer has null or strange currency, or negative price, or null business
  const weirdOffers = await prisma.offer.findMany({
    where: {
      OR: [
        { currency: null },
        { currency: '' },
        { businessId: null },
      ]
    },
    take: 10
  });
  console.log('Weird offers count:', weirdOffers.length);
  
  await prisma.$disconnect();
}

check();
