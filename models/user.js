"use strict";

const mongoose = require("mongoose"),
    userSchema = mongoose.Schema({
        name: {
            first: {
                type: String,
                trim: true
            },
            last: {
                type: String,
                trim: true
            }
        },
        address: {
            type: String,
            required: 'Address is required',
            default: '',
            minlength: 8,
            maxlength: 50,
            trim: true
        },
        email: {
            type: String,
            required: 'Email is required',
            lowercase: true,
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
        },
        aboutMe: {
            type: String,
            optional: true,
            maxlength: 200
        },
        subscribers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscriber"
        }],
        password: {
            type: String,
            required: 'Password is required',
            minlength: 8,
            //Minimum eight characters, at least one letter, one number and one special character
            match: [/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Please provide a valid password']
        },
        dateCreated: {
            type: Date,
            default: Date.now,
            optional: true
        },
    });

userSchema.virtual("fullName")
    .get(function() {
        return `${this.name.first} ${this.name.last}`;
    });

//should also add which user posted it so they can communicate through dms
module.exports = mongoose.model("User", userSchema);