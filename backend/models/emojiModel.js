const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const emojiSchema = new Schema(
    {
        emoji:{
            type:String,
            required:true
        }
    }
)
const Emoji = model("Emoji",emojiSchema)
module.exports = Emoji