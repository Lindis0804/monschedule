const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const jwt = require("jsonwebtoken");
const { secretKey } = require("../const/Const");
const emojiController = {
    addEmoji:async(req,res,next)=>{

    },
    getEmojiById:async(req,res,next)=>{

    },
    deleteEmoji:async(req,res,next)=>{

    },
    updateEmoji:async (req,res,next)=>{

    }
}
module.exports = emojiController