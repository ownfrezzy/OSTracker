const mongoose = require('mongoose');

const { Schema } = mongoose;

const CollectionSchema = new Schema(
	{
		slug: { type: String },
		address: { type: String },
		name: { type: String },
		banner_image_url: { type: String },
		description: { type: String },
		short_description: { type: String },
		external_url: { type: String },
		image_url: { type: String },
		large_image_url: { type: String },
		telegram_url: { type: String },
		discord_url: { type: String },
		twitter_username: { type: String },
		instagram_username: { type: String },
		medium_username: { type: String },
		wiki_url: { type: String },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Collection', CollectionSchema);
