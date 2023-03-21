const Message = require("../models/message");
const { Op } = require("sequelize");
var CronJob = require('cron').CronJob;
const ArchiveMessage = require("../models/archiveMessages");
var oldDate = new Date();
oldDate.setDate(oldDate.getDate()-1);
module.exports = new CronJob(
	'0 0 1 * * *',
	async function() {
		const oldMsg = await Message.findAll({
            where:{
                createdAt:{
                    [Op.lt]:oldDate
            }
      
      }
    })
    Promise.all(oldMsg.map(async (e)=>{
        await e.destroy();
        await ArchiveMessage.create(e.dataValues);
    }))
	},
	null,
	true,
	'America/Los_Angeles'
);
