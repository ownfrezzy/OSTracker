const { Menu, MenuRange } = require('@grammyjs/menu');

/** Dynamic menu for demonstration * */
const dynamicMenu = new Menu('dynamic')
	.url('About', 'https://grammy.dev/plugins/menu')
	.row()
	.dynamic(() => {
		const range = new MenuRange();
		for (let i = 0; i < 3; i++) {
			range.text(i.toString(), (ctx) => ctx.reply(`You chose ${i}`)).row();
		}
		return range;
	})
	.text('Cancel', (ctx) => ctx.deleteMessage());

module.exports = {
	dynamicMenu,
};
