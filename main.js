const { Bot, session } = require('grammy');
const { Router } = require('@grammyjs/router');
const Web3Utils = require('web3-utils');
const { collectionMenu, welcomeMenu, dynamicMenu } = require('./menus');
const { dbConnect } = require('./db/connect');
const { logger } = require('./utils/logger');
const { getImageCaption, getCollectionInfo } = require('./utils/getData');
require('dotenv').config();

const bot = new Bot(process.env.BOT_TOKEN);

// Middlewares
bot.use(session({ initial: () => ({ step: 'idle' }) }));
bot.use(collectionMenu);
bot.use(welcomeMenu);
bot.use(dynamicMenu);

// Declare routes
const router = new Router((ctx) => ctx.session.step);
/* Address input after user clicked Find a collection button in start menu */
const input = router.route('addressInput');

bot.use(router);

// Router listeners
/** Address input * */
input.on('message:text', async (ctx) => {
	if (Web3Utils.isAddress(ctx.message.text)) {
		try {
			await ctx.reply('Retrieving collection data...Please w8');
			const address = ctx.message.text;
			const collectionInfo = await getCollectionInfo(address);
			const { collection } = collectionInfo;
			const { large_image_url, image_url, banner_image_url } = collection;
			ctx.session.collection_object = collectionInfo;

			await ctx.api.sendPhoto(
				ctx.message.chat.id,
				large_image_url || banner_image_url || image_url,
				{
					caption: getImageCaption(collection),
					parse_mode: 'Markdown',
					reply_markup: collectionMenu,
				},
			);
		} catch (e) {
			logger.log({ level: 'error', message: e.message });
			await ctx.reply('Something gone wrong, prolly collection doesnt exists');
		}
	} else {
		await ctx.reply('Send proper ETH address you dumb!');
	}
});

// Declare commands
bot.command('start', async (ctx) => {
	ctx.session.step = 'idle';
	await ctx.reply(
		'Welcome to OSTracker bot! Choose an option below to add new collection or look through the saved collections:',
		{ reply_markup: welcomeMenu },
	);
});
bot.command('dyn', async (ctx) => {
	await ctx.reply('Here is your saved collections:', {
		reply_markup: dynamicMenu,
	});
});

bot.start().then(dbConnect());
