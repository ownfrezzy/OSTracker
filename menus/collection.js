const { Menu } = require('@grammyjs/menu');
const User = require('../db/schemas/users');
const Collection = require('../db/schemas/collections');
const { logger } = require('../utils/logger');
const { getCollectionDetails, getStatMessage } = require('../utils/getData');

const collectionMenu = new Menu('collection-menu')
	.text('Add to favorite', async (ctx) => {
		try {
			const collectionObject = ctx.session.collection_object;
			let user = await User.findOne({
				tg_id: ctx.update.callback_query.from.id,
			});
			if (!user) {
				user = await User.create({ tg_id: ctx.update.callback_query.from.id });
			}
			let collection = await Collection.findOne({
				address: collectionObject.address,
			}).lean();
			if (!collection) {
				const {
					slug,
					name,
					banner_image_url,
					short_description,
					external_url,
					large_image_url,
					telegram_url,
					discord_url,
					twitter_username,
					instagram_username,
					medium_username,
					wiki_url,
				} = collectionObject.collection;
				const { address } = collectionObject;
				collection = await Collection.create({
					slug,
					name,
					banner_image_url,
					short_description,
					external_url,
					large_image_url,
					telegram_url,
					discord_url,
					twitter_username,
					instagram_username,
					medium_username,
					wiki_url,
					address,
				});
			}
			const { saved_collections } = user;
			if (!saved_collections.includes(collection._id)) {
				user.saved_collections.push(collection._id);
				user.save();
				ctx.session.step = 'idle';
				await ctx.reply('Added to favorite');
			} else {
				await ctx.reply('Collection already in your favorited');
				ctx.session.step = 'idle';
			}
		} catch (e) {
			logger.log({ level: 'error', message: e.message });
			await ctx.reply('Something gone wrong');
		}
	})
	.text('More details', async (ctx) => {
		await ctx.reply('Collecting data...please w8');
		try {
			const { slug } = ctx.session.collection_object.collection;
			const { stats } = await getCollectionDetails(slug);
			await ctx.reply(
				getStatMessage(stats, ctx.session.collection_object.collection.name),
				{ parse_mode: 'Markdown' },
			);
			ctx.session.step = 'idle';
		} catch (e) {
			logger.log({ level: 'error', message: e.message });
			await ctx.reply('Something went wrong');
			ctx.session.step = 'idle';
		}
	})
	.row()
	.text('Cancel', async (ctx) => {
		ctx.session.step = 'idle';
		await ctx.deleteMessage();
	});

module.exports = {
	collectionMenu,
};
