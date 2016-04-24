'use strict'

const chai = require('chai');
const mocha = require('mocha');
const should = chai.should();
const User = require('../models/user');

describe('usermodel', () => {
	it('user should be created', () => {
	 	 User.create({
	 	 	username: "user1",
	 	 	firstname: "max",
	 	 	lastname: "mustermann",
	 	 	password: "password",
	 	 	permission: 1
	 	 });

	 	 User.User.findOne({
	 	 	where: {
	 	 		username: "user1"
	 	 	}
	 	 }).then((data) => console.log(data));
    });
});