const { Menu } = require('@grammyjs/menu');

/** Welcome menu appears after executing '/start' command * */
const welcomeMenu = new Menu('welcome-menu')
	.text('Saved collections', async (ctx) => {
		// TODO: Get favorited collections from db and build dynamic menu
		await ctx.reply('Looking  for your collections...');
	})
	.text('Find a collection', async (ctx) => {
		ctx.session.step = 'addressInput';
		await ctx.reply('Paste an ETH address of collection you looking for');
	})
	.row()
	.text('Cancel', async (ctx) => {
		ctx.session.step = 'idle';
		await ctx.deleteMessage();
	});

module.exports = {
	welcomeMenu,
};
