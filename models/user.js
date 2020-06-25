"use strict";

const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    bcrypt = require("bcrypt"),
    randToken = require("rand-token"),
    userSchema = mongoose.Schema({
        apiToken: {
            type: String
        },
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
        dateEdited: {
            type: Date,
            default: Date.now,
            optional: true
        },
        subscribers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscriber"
        }],
        acceptedSubscribers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscriber"
        }],
        messagesWithPeople:[{
            with: [{
                target: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                messages:[{
                    content: {
                        type: String,
                        default: ''
                    },
                    from: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                    },
                    createdAt: {
                        type: Date,
                        default: Date.now
                    }
                }]
            }]
        }]
    });

// userSchema.pre("save", function(next) {
//     let user = this;
//     if (!user.apiToken) user.apiToken = randToken.generate(16);
//     next();
// });

userSchema.virtual("fullName")
    .get(function() {
        return `${this.name.first} ${this.name.last}`;
    });

userSchema.pre("save", function(next) {
    let user = this;
    if (!user.apiToken) user.apiToken = randToken.generate(16);
    bcrypt.hash(user.password, 10).then(hash => {
            user.password = hash;
            next();
        })
        .catch(error => {
            console.log(`Error in hashing password: ${error.message}`);
            next(error);
        });
});

userSchema.methods.passwordComparison = function(inputPassword) {
    let user = this;
    return bcrypt.compare(inputPassword, user.password);
};

userSchema.methods.fullname = function() {
    return `${this.name.first} ${this.name.last}`;
};

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});


//should also add which user posted it so they can communicate through dms
module.exports = mongoose.model("User", userSchema);