const mongoose = require("mongoose");

function colorValidator (v) {
  if (v.indexOf('#') == 0) {
      if (v.length == 7) {  // #f0f0f0
          return true;
      } else if (v.length == 4) {  // #fff
          return true;
      }
  }
  return COLORS.indexOf(v) > -1;
};

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  colorTheme: {
    type: String,
    required: true,
  },
  buttonColors: {
    color1: {
      type: String,
      validate: [colorValidator, 'not a valid color']
    },
    color2: {
      type: String,
      validate: [colorValidator, 'not a valid color']
    }
  },
  selected: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("brandModel", brandSchema);
module.exports.Schema = brandSchema;
