require('dotenv').config();
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const bot = new Telegraf(process.env.BOT_TOKEN);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Sample user data storage
const users = {};

// Start command
bot.start((ctx) => {
  const userId = ctx.from.id;
  users[userId] = users[userId] || { balance: 0 };
  
  ctx.replyWithMarkdown(`
    *Welcome to DataEarn Bot!* 📱💾
    
    Your current balance: *${users[userId].balance}MB*
    
    Available commands:
    /tasks - Browse available tasks
    /balance - Check your balance
  `);
});

// Tasks command
bot.command('tasks', (ctx) => {
  const tasks = [
    {
      id: 1,
      platform: 'YouTube',
      action: 'Subscribe to channel',
      target: 'youtube.com/example',
      reward: 50,
      time: 1
    },
    {
      id: 2,
      action: 'Like 3 Instagram posts',
      target: 'instagram.com/example',
      reward: 30,
      time: 2
    }
  ];

  let message = '*Available Tasks:*\n\n';
  tasks.forEach(task => {
    message += `🔹 *${task.platform}*: ${task.action}\n`;
    message += `🔗 ${task.target}\n`;
    message += `⏱ ${task.time}min | 🎁 ${task.reward}MB\n\n`;
  });

  ctx.replyWithMarkdown(message);
});

// Launch bot
bot.launch()
  .then(() => console.log('Bot is running'))
  .catch(err => console.error(err));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
