module.exports = function(){
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
	 	 }).then( (thisUser) => thisUser.destroy({force: true}) );
	 	 /*User.User.findOne({
	 	 	where: {
	 	 		username: "user1"
	 	 	}
	 	 }).then(
	 	 	(a) => {
	 	 		console.log(a);
	 	 		a.destroy({force: true});
	 	 	});*/
    });
});

}
