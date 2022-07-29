const { connect } = require('mongoose');
const { logger } = require('../utils/logger');

const dbConnect = async () => {
	try {
		await connect(process.env.MONGO_URL);
		logger.log({ level: 'info', message: 'db connected' });
	} catch (e) {
		logger.log({ level: 'error', message: e.message });
	}
};

module.exports = { dbConnect };
