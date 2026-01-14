// index.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const TelegramBot = require('node-telegram-bot-api');

// ==================== ПРОВЕРКА ПЕРЕМЕННЫХ ====================

console.log('🔍 Checking environment variables...');
console.log('   BOT_TOKEN exists:', !!process.env.BOT_TOKEN);
console.log('   BOT_TOKEN length:', process.env.BOT_TOKEN?.length || 0);
console.log('   DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('   PORT:', process.env.PORT || 3000);

if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing in .env file!');
  process.exit(1);
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Telegram Bot с защитой от конфликтов
console.log('🤖 Initializing Telegram bot...');

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    interval: 1000,
    autoStart: false,
    params: {
      timeout: 10
    }
  }
});

// Задержка перед стартом polling (даём время старому процессу умереть)
setTimeout(() => {
  console.log('🔄 Starting bot polling...');
  bot.startPolling();
}, 3000);

// Обработка ошибок polling
bot.on('polling_error', (error) => {
  if (error.code === 'ETELEGRAM' && error.message.includes('409')) {
    console.log('⚠️ Conflict detected, restarting polling in 5 seconds...');
    bot.stopPolling();
    setTimeout(() => {
      bot.startPolling();
    }, 5000);
  } else {
    console.error('❌ Polling error:', error.code, error.message);
  }
});

// Проверка подключения бота
bot.getMe().then((botInfo) => {
  console.log('✅ Bot connected successfully!');
  console.log(`   Bot username: @${botInfo.username}`);
  console.log(`   Bot name: ${botInfo.first_name}`);
}).catch((error) => {
  console.error('❌ Bot connection failed:', error.message);
});

// Логируем ВСЕ входящие сообщения (для отладки)
bot.on('message', (msg) => {
  console.log('📨 Received message:', {
    chatId: msg.chat.id,
    text: msg.text,
    from: msg.from.username || msg.from.first_name,
  });
});

// Логируем ошибки бота
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.code, error.message);
});

bot.on('error', (error) => {
  console.error('❌ Bot error:', error.message);
});

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// ==================== TELEGRAM BOT COMMANDS ====================

// Команда /start
bot.onText(/\/start/, async (msg) => {
  console.log('🚀 /start command received!');
  
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;
  const firstName = msg.from.first_name;
  const lastName = msg.from.last_name;

  console.log('   User info:', { chatId, userId, username, firstName });

  try {
    // Создаём или обновляем пользователя
    await prisma.user.upsert({
      where: { id: BigInt(userId) },
      update: {
        username,
        firstName,
        lastName,
      },
      create: {
        id: BigInt(userId),
        username,
        firstName,
        lastName,
        role: 'GUEST',
      },
    });
    console.log('   ✅ User saved to database');

    // Отправляем приветствие с кнопкой Web App
    const webAppUrl = process.env.WEBAPP_URL || 'https://google.com';
    
    await bot.sendMessage(chatId, 
      `👋 Привет, ${firstName}!\n\n` +
      `🌿 Добро пожаловать в нашу кальянную!\n\n` +
      `Здесь ты можешь:\n` +
      `• 🔍 Посмотреть меню вкусов\n` +
      `• 🎨 Собрать свой микс\n` +
      `• ⭐ Оценить миксы других гостей\n` +
      `• 📦 Сделать заказ на столик\n\n` +
      `Нажми кнопку ниже, чтобы открыть приложение! 👇`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🌿 Открыть меню',
                web_app: { url: webAppUrl }
              }
            ],
            [
              {
                text: '📖 Помощь',
                callback_data: 'help'
              }
            ]
          ]
        }
      }
    );
    console.log('   ✅ Welcome message sent!');
    
  } catch (error) {
    console.error('❌ Error in /start:', error);
    await bot.sendMessage(chatId, '❌ Произошла ошибка. Попробуй позже.');
  }
});

// Команда /menu - быстрый доступ к меню
bot.onText(/\/menu/, async (msg) => {
  console.log('📖 /menu command received!');
  const chatId = msg.chat.id;
  const webAppUrl = process.env.WEBAPP_URL || 'https://google.com';
  
  await bot.sendMessage(chatId,
    '🌿 Открой наше меню:',
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📖 Меню вкусов',
              web_app: { url: `${webAppUrl}/flavors` }
            }
          ],
          [
            {
              text: '🎨 Миксы',
              web_app: { url: `${webAppUrl}/mixes` }
            }
          ]
        ]
      }
    }
  );
});

// Команда /help
bot.onText(/\/help/, async (msg) => {
  console.log('📚 /help command received!');
  const chatId = msg.chat.id;
  
  await bot.sendMessage(chatId,
    `📚 *Помощь*\n\n` +
    `Доступные команды:\n` +
    `/start - Запустить бота\n` +
    `/menu - Открыть меню\n` +
    `/help - Показать эту справку\n\n` +
    `По любым вопросам обращайся к администратору! 🙌`,
    { parse_mode: 'Markdown' }
  );
});

// Команда /test - для проверки работы бота
bot.onText(/\/test/, async (msg) => {
  console.log('🧪 /test command received!');
  await bot.sendMessage(msg.chat.id, '✅ Бот работает отлично!');
});

// Обработка callback кнопок
bot.on('callback_query', async (query) => {
  console.log('🔘 Callback received:', query.data);
  
  if (query.data === 'help') {
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(query.message.chat.id, 
      `📚 *Помощь*\n\n` +
      `Доступные команды:\n` +
      `/start - Запустить бота\n` +
      `/menu - Открыть меню\n` +
      `/help - Показать эту справку`,
      { parse_mode: 'Markdown' }
    );
  }
});

// ==================== API ROUTES ====================

// --- Health Check ---
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '🌿 Hookah App API is running!',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// --- Users ---
app.get('/api/users/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: BigInt(telegramId) },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Конвертируем BigInt в string для JSON
    res.json({
      ...user,
      id: user.id.toString(),
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Brands ---
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { flavors: { where: { isDeleted: false } } }
        }
      },
      orderBy: { name: 'asc' },
    });
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/brands/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const brand = await prisma.brand.findUnique({
      where: { slug },
      include: {
        flavors: {
          where: { isDeleted: false, isAvailable: true },
          orderBy: { name: 'asc' },
        },
      },
    });
    
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    
    res.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Flavors ---
app.get('/api/flavors', async (req, res) => {
  try {
    const { brandId, tag, search } = req.query;
    
    const where = {
      isDeleted: false,
      isAvailable: true,
    };
    
    if (brandId) {
      where.brandId = parseInt(brandId);
    }
    
    if (tag) {
      where.flavorProfile = { has: tag };
    }
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    
    const flavors = await prisma.flavor.findMany({
      where,
      include: { brand: true },
      orderBy: { name: 'asc' },
    });
    
    res.json(flavors);
  } catch (error) {
    console.error('Error fetching flavors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/flavors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const flavor = await prisma.flavor.findUnique({
      where: { id: parseInt(id) },
      include: { brand: true },
    });
    
    if (!flavor || flavor.isDeleted) {
      return res.status(404).json({ error: 'Flavor not found' });
    }
    
    res.json(flavor);
  } catch (error) {
    console.error('Error fetching flavor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Mixes ---
app.get('/api/mixes', async (req, res) => {
  try {
    const { sort = 'popular', strength, authorId } = req.query;
    
    const where = {
      isPublished: true,
      isDeleted: false,
    };
    
    if (strength) {
      where.userStrength = strength;
    }
    
    if (authorId) {
      where.authorId = BigInt(authorId);
    }
    
    let orderBy;
    switch (sort) {
      case 'new':
        orderBy = { createdAt: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'popular':
      default:
        orderBy = { ordersCount: 'desc' };
    }
    
    const mixes = await prisma.mix.findMany({
      where,
      include: {
        author: {
          select: { id: true, username: true, firstName: true },
        },
        ingredients: {
          include: {
            flavor: {
              include: { brand: true },
            },
          },
        },
        _count: {
          select: { actions: true },
        },
      },
      orderBy,
    });
    
    // Конвертируем BigInt
    const result = mixes.map(mix => ({
      ...mix,
      authorId: mix.authorId.toString(),
      author: {
        ...mix.author,
        id: mix.author.id.toString(),
      },
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching mixes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/mixes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mix = await prisma.mix.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: { id: true, username: true, firstName: true },
        },
        ingredients: {
          include: {
            flavor: {
              include: { brand: true },
            },
          },
        },
      },
    });
    
    if (!mix || mix.isDeleted) {
      return res.status(404).json({ error: 'Mix not found' });
    }
    
    res.json({
      ...mix,
      authorId: mix.authorId.toString(),
      author: {
        ...mix.author,
        id: mix.author.id.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching mix:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать микс
app.post('/api/mixes', async (req, res) => {
  try {
    const { name, description, authorId, strength, ingredients } = req.body;
    
    // Валидация
    if (!name || !authorId || !ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Проверяем, что сумма процентов = 100
    const totalPercentage = ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
    if (totalPercentage !== 100) {
      return res.status(400).json({ error: 'Ingredients percentage must sum to 100' });
    }
    
    // Генерируем slug
    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    const mix = await prisma.mix.create({
      data: {
        name,
        slug,
        description,
        authorId: BigInt(authorId),
        userStrength: strength || 'MEDIUM',
        ingredients: {
          create: ingredients.map(ing => ({
            flavorId: ing.flavorId,
            percentage: ing.percentage,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            flavor: { include: { brand: true } },
          },
        },
      },
    });
    
    res.status(201).json({
      ...mix,
      authorId: mix.authorId.toString(),
    });
  } catch (error) {
    console.error('Error creating mix:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Mix Actions (Like, Dislike, Order) ---
app.post('/api/mixes/:id/action', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, type, tableNumber, comment } = req.body;
    
    if (!userId || !type) {
      return res.status(400).json({ error: 'Missing userId or type' });
    }
    
    const mixId = parseInt(id);
    
    // Для ORDER можно создавать несколько записей
    if (type === 'ORDER') {
      const action = await prisma.mixAction.create({
        data: {
          userId: BigInt(userId),
          mixId,
          type,
          tableNumber,
          comment,
        },
      });
      
      // Увеличиваем счётчик заказов
      await prisma.mix.update({
        where: { id: mixId },
        data: { ordersCount: { increment: 1 } },
      });
      
      // Отправляем уведомление в Telegram (опционально)
      const mix = await prisma.mix.findUnique({
        where: { id: mixId },
        include: { ingredients: { include: { flavor: true } } },
      });
      
      console.log(`📦 New order: Mix "${mix.name}" for table ${tableNumber}`);
      
      return res.status(201).json({
        ...action,
        userId: action.userId.toString(),
      });
    }
    
    // Для LIKE/DISLIKE - upsert (один раз на пользователя)
    const action = await prisma.mixAction.upsert({
      where: {
        userId_mixId_type: {
          userId: BigInt(userId),
          mixId,
          type,
        },
      },
      update: {},
      create: {
        userId: BigInt(userId),
        mixId,
        type,
      },
    });
    
    // Обновляем счётчики
    if (type === 'LIKE') {
      await prisma.mix.update({
        where: { id: mixId },
        data: { likesCount: { increment: 1 } },
      });
    } else if (type === 'DISLIKE') {
      await prisma.mix.update({
        where: { id: mixId },
        data: { dislikesCount: { increment: 1 } },
      });
    }
    
    res.status(201).json({
      ...action,
      userId: action.userId.toString(),
    });
  } catch (error) {
    console.error('Error creating action:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Получить действия пользователя
app.get('/api/users/:telegramId/actions', async (req, res) => {
  try {
    const { telegramId } = req.params;
    
    const actions = await prisma.mixAction.findMany({
      where: { userId: BigInt(telegramId) },
      include: {
        mix: {
          include: {
            ingredients: {
              include: {
                flavor: { include: { brand: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    const result = actions.map(action => ({
      ...action,
      userId: action.userId.toString(),
      mix: action.mix ? {
        ...action.mix,
        authorId: action.mix.authorId.toString(),
      } : null,
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching user actions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Flavor Tags (для фильтров) ---
app.get('/api/tags', (req, res) => {
  const tags = [
    { value: 'SWEET', label: '🍬 Сладкий' },
    { value: 'SOUR', label: '🍋 Кислый' },
    { value: 'FRESH', label: '🌿 Свежий' },
    { value: 'SPICY', label: '🌶️ Пряный' },
    { value: 'FRUITY', label: '🍎 Фруктовый' },
    { value: 'BERRY', label: '🍓 Ягодный' },
    { value: 'CITRUS', label: '🍊 Цитрусовый' },
    { value: 'MINT', label: '🌱 Мятный' },
    { value: 'ICE', label: '❄️ Ледяной' },
    { value: 'CREAMY', label: '🥛 Сливочный' },
    { value: 'NUTTY', label: '🥜 Ореховый' },
    { value: 'FLORAL', label: '🌸 Цветочный' },
    { value: 'HERBAL', label: '🌿 Травяной' },
    { value: 'EXOTIC', label: '🌴 Экзотический' },
    { value: 'DESSERT', label: '🍰 Десертный' },
    { value: 'TOBACCO', label: '🍂 Табачный' },
    { value: 'COFFEE', label: '☕ Кофейный' },
    { value: 'CHOCOLATE', label: '🍫 Шоколадный' },
    { value: 'VANILLA', label: '🍦 Ванильный' },
    { value: 'TROPICAL', label: '🏝️ Тропический' },
  ];
  res.json(tags);
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================

async function main() {
  try {
    // Проверяем подключение к БД
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Запускаем сервер
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}`);
      console.log(`\n💡 Send /start or /test to your bot in Telegram!`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

main();
