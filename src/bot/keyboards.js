const { user_status_enum, commands_enum } = require("../consts");


const keyboards = {
  [user_status_enum.idle]: {
    reply_markup: {
      keyboard: [
        [{ text: commands_enum.match }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  },
  [user_status_enum.matched]: {
    reply_markup: {
      keyboard: [
        [{ text: commands_enum.disconnect }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  },
  [user_status_enum.available]: {
    reply_markup: {
      keyboard: [
        [{ text: commands_enum.pause }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  },
};

module.exports = keyboards;
