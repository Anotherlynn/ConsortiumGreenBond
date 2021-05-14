//事实上应该在服务器初始化的时候生成三个组织的admin账户
//
'use strict';
//const log4js = require('log4js');
//const logger = log4js.getLogger('BasicNetwork');
//const bodyParser = require('body-parser');
//const util = require('util');
//const fs = require('fs');
const path = require('path');
//const yaml = require('js-yaml');
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil');
const { BuildConnectionFile, buildWallet } = require('./AppUtil');
const { InvokeTransaction } = require('./InvokeTransactionFcn.js');
const GlobalVars = require('../global_vars.js');
const NetWorkName = GlobalVars.NetWorkName;
const CHANNELNAME = GlobalVars.Channel;
//logger.level = 'debug';
/**
 * 注册用户:register, enroll
 * @param {String} OrganizationName admin所在的org
 */
exports.EnrollAdminFull = async (OrganizationName) =>
{
    const OrgNameLower = OrganizationName.toLowerCase();
    const WalletPathName = OrgNameLower + '_wallets';
    const WalletPathString = path.resolve(__dirname, '..', 'wallets', WalletPathName);
    const wallet = await buildWallet(Wallets, WalletPathString);//基于文件系统的钱包文件
    const ConnectionConfigFileName = NetWorkName + OrganizationName[0].toUpperCase() + (OrganizationName.substring(1)).toLowerCase() + 'GatewayConnection.json'//注意只是文件名
    const CAName = OrgNameLower + 'ca-api.127-0-0-1.nip.io:39600';
    const ConnectionConfigFile = BuildConnectionFile(OrgNameLower, ConnectionConfigFileName);
    const caClient = buildCAClient(FabricCAServices, ConnectionConfigFile, CAName);
    const mspID = OrganizationName + 'MSP';//mspID首位没有大写
    await enrollAdmin(caClient, wallet, mspID);
}
/**
 * 私有函数
 * @param {String} UserName 
 * @param {*} OrganizationName 
 * @returns 
 */
exports.RegisterUserOnWallet = async (UserName, OrganizationName) =>
{
    const ConnectionConfigFileName = NetWorkName + OrganizationName[0].toUpperCase() + (OrganizationName.substring(1)).toLowerCase() + 'GatewayConnection.json'//注意只是文件名
    const OrgNameLower = OrganizationName.toLowerCase();
    const CAName = OrgNameLower + 'ca-api.127-0-0-1.nip.io:39600';
    const ConnectionConfigFile = BuildConnectionFile(OrgNameLower, ConnectionConfigFileName);
    const caClient = buildCAClient(FabricCAServices, ConnectionConfigFile, CAName);
    const WalletPathName = OrgNameLower + '_wallets';
    const WalletPathString = path.resolve(__dirname, '..', 'wallets', WalletPathName);
    const wallet = await buildWallet(Wallets, WalletPathString);//基于文件系统的钱包文件
    console.log(`用户${UserName}.${OrganizationName}的钱包应属路径是${WalletPathString},注意尚不知道文件钱包是否存在`);
    const mspID = OrganizationName + 'MSP';//mspID首位没有大写
    await enrollAdmin(caClient, wallet, mspID);
    await registerAndEnrollUser(caClient, wallet, mspID, UserName);
    var response =
    {
        success: true,
        message: UserName + ' enrolled Successfully',
    };
    return response;
}
/**
 * 私有函数
 * 采用用户希望注册组织的CA Admin在链上注册信息
 * @param {String} UserName 用户名
 * @param {String} UserOrg 用户组织，注意这个东西只有三种取值情形['systemadmin','entity','supervisor']
 * @param {String} OrganizationName 组织名称
 */
exports.RegisterUserOnBlockchain = async (UserName, UserOrg, UserPassword) =>
{
    const response = await InvokeTransaction(CHANNELNAME, 'user_contract', 'UserRegister', [UserName, UserOrg, UserPassword], 'admin', 'systemadmin');
    return response.result;
}
/**
 * 这个是暴露给前后端的
 * 同时在区块链数据库和钱包地址register and enroll
 * 这个函数由超级管理员调用
 * @param {String} UserName 用户名
 * @param {String} UserPassword 密码
 * @param {String} UserOrg 组织的名称, 注意这个东西只有三种取值情形['systemadmin','entity','supervisor']
 * @return 注册成功返回一个true,否则会抛出异常(如用户已经存在)
 */
 exports.RegisterUserBoth = async (UserName, UserOrg, UserPassword) =>
 {
     if (this.IsUserExist(UserName, UserOrg))
     {
         throw new Error(`用户${UserName}.${UserOrg}已经存在了,不能重复注册`);
     }
     await this.RegisterUserOnBlockchain(UserName, UserOrg, UserPassword);
     await this.RegisterUserOnWallet(UserName, UserOrg);
     return true;
     //let InitObject = Object();
     //InitObject.org = OrganizationName.toLocaleLowerCase();
     //const EmptyObjectString = JSON.stringify(InitObject);
     //await this.SetUserDetail(UserName,EmptyObjectString);
 }

/**
 * 仅超级管理员调用
 * 返回是否登陆成功的布尔值
 * @param {String} UserName 用户名
 * @param {String} psw 密码
 * @returns 登陆成功布尔值
 * @Error 如果用户不存在会抛出异常
 */
exports.UserLogin = async (UserName, UserOrg, psw) =>
{
    if (!this.IsUserExist(UserName, UserOrg))
    {
        throw new Error(`用户${UserName}.${UserOrg}不存在，不能登录`);
    }
    const response = await InvokeTransaction(CHANNELNAME, 'user_contract', 'UserLogin', [UserName, UserOrg, psw], 'admin', 'systemadmin');
    return response.result;
}

/**
 * 这查询接口可以由其他人来调用
 * @param {String} UserName 用户名
 * @param {String} UserOrg 用户所属组织，注意这个东西只有三种取值情形['systemadmin','entity','supervisor']
 * @returns 返回布尔值
 */
exports.IsUserExist = async (UserName, UserOrg, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    const response = InvokeTransaction(CHANNELNAME, 'user_contract', 'UserExists', [UserName, UserOrg], Actor, ActorOrg);
    return response.result;
}
/**
 * 这个函数并非系统管理员调用，有可能是自己调用
 * @param {String} UserName 用户名字符串
 * @param {String} UserOrg 用户所属组织
 * @param {String} Actor 调用该方法的用户名
 * @param {String} ActorOrg 调用该方法用户所属组织
 * @param {String} StringifiedString 字符串化的用户详细信息对象
 * @returns 设置成功返回true
 * @Error 如果被设置信息的用户不存在，会抛出错误
 * 
 */
exports.SetUserDetail = async (UserName, UserOrg, StringifiedString, Actor = 'admin', ActorOrg = 'systemadmin') =>
{

    const response = InvokeTransaction(CHANNELNAME, 'user_contract', 'SetUsetDetail', [UserName, UserOrg, StringifiedString], Actor, ActorOrg);
    return response.result;
}
/**
 * 可以由各种身份的用户调用
 * 获得parse之前的用户详细信息
 * @param {String} UserOrg 用户所属组织
 * @param {String} UserName 用户名字符串
 * @param {String} Actor 调用该方法的用户名
 * @param {String} ActorOrg 调用该方法用户所属组织
 * @returns 和setuserdetail传进去的参数是相同的格式
 * @Error 如果用户不存在会抛出异常
 */
exports.GetUserDatail = async (UserName, UserOrg, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    if (!this.IsUserExist(UserName, UserOrg))
    {
        throw new Error(`用户${UserName}.${UserOrg}不存在,不能获得信息`);
    }
    const response = InvokeTransaction(CHANNELNAME, 'user_contract', 'GetUserDetail', [UserName, UserOrg], Actor, ActorOrg);
    return response.result;
}

/**
 * 
 * @param {String} QueryString stringified后的富查询语句，例如'{"selector":{"sex":"male"}}'
 * @param {*} Actor 
 * @param {*} ActorOrg 
 * @returns 返回stringified后的大列表，其中每个元素都是JSON: '[{'key':'UserDetailTable_donia.entity','Record':{'性别':'男',age:21}}]'
 */
exports.QueryUserByString = async (QueryString, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    const response = InvokeTransaction(CHANNELNAME, 'user_contract', 'QueryUserByString', [QueryString], Actor, ActorOrg);
    return response.result;
}

/**
 * 采用区块链钱包文件系统判断用户是否存在。注意，在Fabric框架中允许在不同组织的两个人同名。
 * 因此该逻辑不宜后续采用
 * 该接口可暂时不管
 * @param {String} UserName 用户名
 * @param {组织信息} OrganizationName 组织名称
 * @returns 
 */
exports.IsUserRegisteredByWallet = async (UserName, OrganizationName) =>
{
    const OrgNameLower = OrganizationName.toLowerCase();
    const WalletPathName = OrgNameLower + '_wallets';
    const WalletPathString = path.resolve(__dirname, '..', 'wallets', WalletPathName);
    const wallet = await buildWallet(Wallets, WalletPathString);
    const UserNameentity = await wallet.get(UserName);
    if (UserNameentity)
    {
        console.log(`An identity for the user ${UserName} exists in the wallet`);
        return true;
    }
    return false;
}

