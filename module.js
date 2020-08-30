// module.js: Jablko Notepad
// Cale Overstreet
// August 30, 2020
// Allows for quick notes to be taken down. Only supports a single note sheet.

const fs = require("fs").promises;
const path = require("path");

const module_name = path.basename(__dirname);
const jablko = require(module.parent.filename);
const module_config = jablko.jablko_config.jablko_modules[module_name];

jablko.user_db.run(`CREATE TABLE IF NOT EXISTS ${module_name}
(username TEXT NOT NULL PRIMARY KEY,
note TEXT
)`);

module.exports.permission_level = 0

module.exports.generate_card = async function generate_card() {
	return (await fs.readFile(`${__dirname}/jablko_notepad.html`, "utf8")).replace(/\$MODULE_NAME/g, module_name);
}

module.exports.save_note = async (req, res) => {
	jablko.user_db.run(`INSERT OR IGNORE INTO ${module_name} (username, note) VALUES (?, ?)`, [req.username, req.body.note]);
	jablko.user_db.run(`UPDATE ${module_name} SET note=(?) WHERE username=(?)`, [req.body.note, req.username]);
	
	res.json({status: "good", message: "Saved Note"});
}

module.exports.get_note = async (req, res) => {
	const table_data = await jablko.user_db.get(`SELECT * FROM ${module_name} WHERE username=(?)`, [req.username]);

	res.json({status: "good", note: table_data.note});
}
