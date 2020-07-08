/* Declare required npm packages */
var express = require('express');
var router = express.Router();

/* Declare related Routers */
var applicationRouter = require('./application.router');
var roleRouter = require('./role.router');
var privilegeRouter = require('./privilege.router');
// var rolePrivilegeRouter = require('./role.privilege.router');
var commonRouter = require('./common.router');
var userRouter = require('./user.router');
var tokenRouter=require('./token.router');
var ldapRouter=require('./ldap.router');
var imprivataRouter=require('./imprivata.router');


/* Include other routers to index router */
router.use('/', commonRouter)
router.use('/Application', applicationRouter);
router.use('/Role', roleRouter);
router.use('/Privilege', privilegeRouter);
//router.use('/RolePrivilege', rolePrivilegeRouter);
router.use('/User', userRouter);
router.use('/Token',tokenRouter);
router.use('/Ldap',ldapRouter);
router.use('/Imprivata',imprivataRouter);

module.exports = router;