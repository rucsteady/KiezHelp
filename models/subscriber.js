"use strict";

function MonthsFromNow(months) {
    var d = new Date();
    var targetMonth = d.getMonth() + months;
    d.setMonth(targetMonth);
    if (d.getMonth() !== targetMonth % 12) {
        d.setDate(0); // last day of previous month
    }
    return d;
}
const mongoose = require("mongoose"),
    subscriberSchema = mongoose.Schema({
        userId: {
            type: String,
            required: 'userId is required',
            trim: true
        },
        acceptedUserId: {
            type: String,
            optional: true
        },
        acceptanceStatus: {
            type: String,
            default: 'unaccepted',
            enum: ['accepted', 'unaccepted']
        },
        type: {
            type: String,
            required: 'Type is required',
            default: 'Volunteer',
            enum: ['Volunteer', 'Request']
        },
        name: {
            type: String,
            required: 'Name is required',
            default: '',
            minlength: 5,
            maxlength: 30,
            trim: true
        },
        address: {
            type: String,
            required: 'Address is required',
            default: '',
            minlength: 8,
            maxlength: 50,
            trim: true
        },
        date: {
            type: Date,
            default: Date.now,
            min: Date.now,
            max: MonthsFromNow(2)
        },
        option: {
            type: String,
            required: 'Option is required',
            default: 'GroceryShopping',
            minlength: 5,
            maxlength: 30
        },
        durafrom: {
            type: String,
            optional: true,
            trim: true,
            match: [/^[0-2][0-3]:[0-5][0-9]$/, 'Start time invalid']
        },
        durato: {
            type: String,
            optional: true,
            trim: true,
            match: [/^[0-2][0-3]:[0-5][0-9]$/, 'End time invalid']
        },
        message: {
            type: String,
            default: '',
            optional: true,
            maxlength: 100
        },
        dateCreated: {
            type: Date,
            default: Date.now
        }
    });
//should also add which user posted it so they can communicate through dms
module.exports = mongoose.model("Subscriber", subscriberSchema);