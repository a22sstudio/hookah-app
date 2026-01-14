// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...\n');

  // ==================== BRANDS ====================
  
  console.log('📦 Creating brands...');
  
  const darkside = await prisma.brand.upsert({
    where: { slug: 'darkside' },
    update: {},
    create: {
      name: 'Darkside',
      slug: 'darkside',
      description: 'Премиальный табак из России с насыщенными вкусами',
      isActive: true,
    },
  });

  const musthave = await prisma.brand.upsert({
    where: { slug: 'musthave' },
    update: {},
    create: {
      name: 'Musthave',
      slug: 'musthave',
      description: 'Популярный российский бренд с яркими миксами',
      isActive: true,
    },
  });

  const blackburn = await prisma.brand.upsert({
    where: { slug: 'blackburn' },
    update: {},
    create: {
      name: 'BlackBurn',
      slug: 'blackburn',
      description: 'Крепкий табак для настоящих ценителей',
      isActive: true,
    },
  });

  console.log('✅ Brands created\n');

  // ==================== DARKSIDE FLAVORS ====================
  
  console.log('🍇 Creating Darkside flavors...');

  const darksideFlavors = [
    {
      name: 'Grape Core',
      slug: 'grape-core',
      description: 'Насыщенный виноград с легкой терпкостью',
      flavorProfile: ['SWEET', 'FRUITY'],
      manufacturerStrength: 7,
    },
    {
      name: 'Kalee Grapefruit',
      slug: 'kalee-grapefruit',
      description: 'Сочный грейпфрут с горчинкой',
      flavorProfile: ['CITRUS', 'SOUR', 'FRESH'],
      manufacturerStrength: 6,
    },
    {
      name: 'Supernova',
      slug: 'supernova',
      description: 'Ледяной взрыв свежести',
      flavorProfile: ['ICE', 'FRESH', 'MINT'],
      manufacturerStrength: 8,
    },
    {
      name: 'Polar Cream',
      slug: 'polar-cream',
      description: 'Мятное мороженое со сливками',
      flavorProfile: ['MINT', 'ICE', 'CREAMY', 'DESSERT'],
      manufacturerStrength: 5,
    },
    {
      name: 'Falling Star',
      slug: 'falling-star',
      description: 'Маракуйя с манго и тропическими нотами',
      flavorProfile: ['TROPICAL', 'EXOTIC', 'SWEET', 'FRUITY'],
      manufacturerStrength: 6,
    },
  ];

  for (const flavor of darksideFlavors) {
    await prisma.flavor.upsert({
      where: {
        brandId_slug: {
          brandId: darkside.id,
          slug: flavor.slug,
        },
      },
      update: flavor,
      create: {
        ...flavor,
        brandId: darkside.id,
      },
    });
  }

  console.log('✅ Darkside flavors created\n');

  // ==================== MUSTHAVE FLAVORS ====================
  
  console.log('🍓 Creating Musthave flavors...');

  const musthaveFlavors = [
    {
      name: 'Strawberry Lemonade',
      slug: 'strawberry-lemonade',
      description: 'Клубничный лимонад - летняя классика',
      flavorProfile: ['BERRY', 'CITRUS', 'SWEET', 'FRESH'],
      manufacturerStrength: 5,
    },
    {
      name: 'Pinkman',
      slug: 'pinkman',
      description: 'Грейпфрут, клубника и малина',
      flavorProfile: ['BERRY', 'CITRUS', 'SWEET', 'FRUITY'],
      manufacturerStrength: 6,
    },
    {
      name: 'Mango',
      slug: 'mango',
      description: 'Спелый тайский манго',
      flavorProfile: ['TROPICAL', 'SWEET', 'FRUITY', 'EXOTIC'],
      manufacturerStrength: 5,
    },
    {
      name: 'Mint',
      slug: 'mint',
      description: 'Освежающая перечная мята',
      flavorProfile: ['MINT', 'FRESH', 'HERBAL'],
      manufacturerStrength: 7,
    },
    {
      name: 'Milky Rice',
      slug: 'milky-rice',
      description: 'Рисовая каша со сгущёнкой',
      flavorProfile: ['CREAMY', 'SWEET', 'DESSERT', 'VANILLA'],
      manufacturerStrength: 4,
    },
  ];

  for (const flavor of musthaveFlavors) {
    await prisma.flavor.upsert({
      where: {
        brandId_slug: {
          brandId: musthave.id,
          slug: flavor.slug,
        },
      },
      update: flavor,
      create: {
        ...flavor,
        brandId: musthave.id,
      },
    });
  }

  console.log('✅ Musthave flavors created\n');

  // ==================== BLACKBURN FLAVORS ====================
  
  console.log('🔥 Creating BlackBurn flavors...');

  const blackburnFlavors = [
    {
      name: 'Something Tropical',
      slug: 'something-tropical',
      description: 'Микс из экзотических фруктов',
      flavorProfile: ['TROPICAL', 'EXOTIC', 'SWEET', 'FRUITY'],
      manufacturerStrength: 8,
    },
    {
      name: 'Raspberry Shock',
      slug: 'raspberry-shock',
      description: 'Кислая малина с холодком',
      flavorProfile: ['BERRY', 'SOUR', 'ICE', 'FRESH'],
      manufacturerStrength: 9,
    },
    {
      name: 'Cane Mint',
      slug: 'cane-mint',
      description: 'Тростниковая мята - мощный холод',
      flavorProfile: ['MINT', 'ICE', 'FRESH', 'SWEET'],
      manufacturerStrength: 10,
    },
    {
      name: 'Original Tobacco',
      slug: 'original-tobacco',
      description: 'Классический табачный вкус',
      flavorProfile: ['TOBACCO', 'SPICY', 'NUTTY'],
      manufacturerStrength: 8,
    },
    {
      name: 'Lemon Shock',
      slug: 'lemon-shock',
      description: 'Кислый лимон с ледяной свежестью',
      flavorProfile: ['CITRUS', 'SOUR', 'ICE', 'FRESH'],
      manufacturerStrength: 9,
    },
  ];

  for (const flavor of blackburnFlavors) {
    await prisma.flavor.upsert({
      where: {
        brandId_slug: {
          brandId: blackburn.id,
          slug: flavor.slug,
        },
      },
      update: flavor,
      create: {
        ...flavor,
        brandId: blackburn.id,
      },
    });
  }

  console.log('✅ BlackBurn flavors created\n');

  // ==================== TEST USER ====================
  
  console.log('👤 Creating test admin user...');

  // ЗАМЕНИ 123456789 на свой Telegram ID!
  const adminUser = await prisma.user.upsert({
    where: { id: BigInt(123456789) },
    update: {},
    create: {
      id: BigInt(123456789),
      username: 'admin',
      firstName: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created\n');

  // ==================== EXAMPLE MIXES ====================
  
  console.log('🎨 Creating example mixes...');

  const grapeCore = await prisma.flavor.findFirst({
    where: { slug: 'grape-core' },
  });
  
  const supernova = await prisma.flavor.findFirst({
    where: { slug: 'supernova' },
  });
  
  const pinkman = await prisma.flavor.findFirst({
    where: { slug: 'pinkman' },
  });
  
  const mango = await prisma.flavor.findFirst({
    where: { slug: 'mango' },
  });

  if (grapeCore && supernova) {
    await prisma.mix.upsert({
      where: { slug: 'grape-ice-classic' },
      update: {},
      create: {
        name: 'Grape Ice Classic',
        slug: 'grape-ice-classic',
        description: 'Классический микс винограда с ледяной свежестью',
        authorId: adminUser.id,
        userStrength: 'MEDIUM',
        rating: 4.5,
        likesCount: 12,
        ordersCount: 8,
        ingredients: {
          create: [
            { flavorId: grapeCore.id, percentage: 70 },
            { flavorId: supernova.id, percentage: 30 },
          ],
        },
      },
    });
  }

  if (pinkman && mango) {
    await prisma.mix.upsert({
      where: { slug: 'tropical-pink' },
      update: {},
      create: {
        name: 'Tropical Pink',
        slug: 'tropical-pink',
        description: 'Тропическая свежесть с ягодными нотами',
        authorId: adminUser.id,
        userStrength: 'LIGHT',
        rating: 4.8,
        likesCount: 24,
        ordersCount: 15,
        ingredients: {
          create: [
            { flavorId: pinkman.id, percentage: 50 },
            { flavorId: mango.id, percentage: 50 },
          ],
        },
      },
    });
  }

  console.log('✅ Example mixes created\n');

  // ==================== SUMMARY ====================
  
  const brandsCount = await prisma.brand.count();
  const flavorsCount = await prisma.flavor.count();
  const usersCount = await prisma.user.count();
  const mixesCount = await prisma.mix.count();

  console.log('📊 Seed completed:');
  console.log(`   • Brands: ${brandsCount}`);
  console.log(`   • Flavors: ${flavorsCount}`);
  console.log(`   • Users: ${usersCount}`);
  console.log(`   • Mixes: ${mixesCount}`);
  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
