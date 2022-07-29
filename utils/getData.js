require('dotenv').config();
const scraperapiClient = require('scraperapi-sdk')(process.env.PROXY_KEY);
const { logger } = require('./logger');

function getImageCaption (collection) {
	const { description, short_description, name } = collection;

	const getSocials = (collection) => {
		const {
			slug,
			external_url,
			discord_url,
			twitter_username,
			instagram_username,
			telegram_url,
			medium_username,
		} = collection;

		let socials = `[OpenSea](https://opensea.io/collection/${slug})`;
		if (external_url) {
			socials = socials.concat(`\n[Website](${external_url})`);
		}
		if (twitter_username) {
			socials = socials.concat(
				`\n[Twitter](https://twitter.com/${twitter_username})`,
			);
		}
		if (discord_url) {
			socials = socials.concat(`\n[Discord](${discord_url})`);
		}
		if (instagram_username) {
			socials = socials.concat(
				`\n[Instagram](https://www.instagram.com/${instagram_username}/)`,
			);
		}
		if (telegram_url) {
			socials = socials.concat(`\n[Telegram]https://t.me/${telegram_url}`);
		}
		if (medium_username) {
			socials = socials.concat(`\n[Medium]https://${medium_username}.medium.com/`);
		}

		return socials;
	};

	return `
        *${name}*
        
${short_description || description}
        
*Socials:* 
${getSocials(collection)}
`;
}
async function getCollectionDetails (slug) {
	const details = await scraperapiClient.get(
		`https://api.opensea.io/api/v1/collection/${slug}/stats`,
		{
			headers: { Accept: 'application/json' },
		},
	);

	return JSON.parse(details);
}
async function getCollectionInfo (address) {
	try {
		const info = await scraperapiClient.get(
			`https://api.opensea.io/api/v1/asset_contract/${address}`,
			{
				headers: { Accept: 'application/json' },
			},
		);

		return JSON.parse(info);
	} catch (e) {
		logger.log({ level: 'error', message: e.message });
	}
}
function getStatMessage (stats, name) {
	const {
		one_day_volume,
		one_day_change,
		one_day_sales,
		one_day_average_price,
		seven_day_volume,
		seven_day_change,
		seven_day_sales,
		seven_day_average_price,
		thirty_day_volume,
		thirty_day_change,
		thirty_day_sales,
		thirty_day_average_price,
		total_volume,
		total_sales,
		total_supply,
		count,
		num_owners,
		floor_price,
		market_cap,
	} = stats;
	return `*${name}*

*1D Volume:* ${one_day_volume.toFixed(2)} Ξ

*1D Change:* ${one_day_change.toFixed(2)} Ξ

*1D Sales:* ${one_day_sales.toFixed(2)} Ξ

*1D Average Price:* ${one_day_average_price.toFixed(2)} Ξ


*7D Volume:* ${seven_day_volume.toFixed(2)} Ξ

*7D Change:* ${seven_day_change.toFixed(2)} Ξ

*7D Sales:* ${seven_day_sales.toFixed(2)} Ξ

*7D Average Price:* ${seven_day_average_price.toFixed(2)} Ξ


*30D Volume:* ${thirty_day_volume.toFixed(2)} Ξ

*30D Change:* ${thirty_day_change.toFixed(2)} Ξ
 
*30D Sales:* ${thirty_day_sales.toFixed(2)} Ξ

*30D Average Price:* ${thirty_day_average_price.toFixed(2)} Ξ


*Total volume:* ${total_volume.toFixed(2)} Ξ

*Total sales:* ${total_sales.toFixed(2)} Ξ


*Total supply:* ${total_supply.toFixed(2)} Ξ

*Count:* ${count.toFixed(2)} Ξ

*Owners:* ${num_owners.toFixed(2)} Ξ

*Floor:* ${floor_price.toFixed(2)} Ξ

*Market cap:* ${market_cap.toFixed(2)} Ξ`;
}

module.exports = {
	getImageCaption,
	getCollectionDetails,
	getCollectionInfo,
	getStatMessage,
};
