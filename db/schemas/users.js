const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new Schema({
	tg_id: { type: Number },
	saved_collections: [{ type: ObjectId, ref: 'Collection' }],
});

module.exports = mongoose.model('User', UserSchema);
