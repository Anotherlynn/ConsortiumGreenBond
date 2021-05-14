//事实上应该在服务器初始化的时候生成三个组织的admin账户
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

exports.EnrollAdminFull = async (OrganizationName) =>
{
    const OrgNameLower = OrganizationName.toLowerCase();
    const WalletPathName = OrgNameLower + '_wallets';
    const WalletPathString = path.resolve(__dirname, '..', 'wallets', WalletPathName);
    const wallet = await buildWallet(Wallets, WalletPathString);//基于文件系统的钱包文件
    let ConnectionConfigFileName;
    //注意system_admin的连接配置文件中没有下划线
    //TODO:!
    if (OrgNameLower === 'system_admin')
    {
        ConnectionConfigFileName = NetWorkName + 'SystemAdminGatewayConnection';
    }
    else
    {
        
    }
    const ConnectionConfigFileName = NetWorkName + OrganizationName[0].toUpperCase() + (OrganizationName.substring(1)).toLowerCase() + 'GatewayConnection.json'//注意只是文件名
    const CAName = OrgNameLower + 'ca-api.127-0-0-1.nip.io:39600';
    const ConnectionConfigFile = BuildConnectionFile(OrgNameLower, ConnectionConfigFileName);
    const caClient = buildCAClient(FabricCAServices, ConnectionConfigFile, CAName);
    const mspID = OrganizationName[0].toUpperCase() + (OrganizationName.substring(1)).toLowerCase() + 'MSP';
    await enrollAdmin(caClient, wallet, mspID);
}
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
    const mspID = OrganizationName[0].toUpperCase() + (OrganizationName.substring(1)).toLowerCase() + 'MSP';
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
 * 采用用户希望注册组织的CA Admin在链上注册信息
 * @param {String} UserName 用户名
 * @param {String} UserOrg 用户组织，注意这个东西只有三种取值情形['system_admin','entity','supervisor']
 * @param {String} OrganizationName 组织名称
 */
exports.RegisterUserOnBlockchain = async (UserName, UserOrg, UserPassword) =>
{
    const response = await InvokeTransaction(CHANNELNAME, 'user_contract', 'UserRegister', [UserName, UserOrg, UserPassword], 'admin', 'system_admin');
    return response.result;
}
/**
 * 同时在区块链数据库和钱包地址register and enroll
 * 这个函数由超级管理员调用
 * @param {String} UserName 用户名
 * @param {String} UserPassword 密码
 * @param {String} OrganizationName 组织的名称
 */
 exports.RegisterUserBoth = async (UserName, UserPassword, OrganizationName) =>
 {
     await this.RegisterUserOnBlockchain(UserName, UserPassword, 'system_admin');
     await this.RegisterUserOnWallet(UserName, OrganizationName);
     let InitObject = Object();
     InitObject.org = OrganizationName.toLocaleLowerCase();
     const EmptyObjectString = JSON.stringify(InitObject);
     await this.SetUserDetail(UserName,EmptyObjectString);
     
 }

/**
 * 用超级管理员调用
 * 返回是否登陆成功的布尔值
 * @param {String} UserName 用户名
 * @param {String} psw 密码
 * @returns 登陆成功布尔值
 */
exports.UserLogin = async (UserName, psw) =>
{
    if (!this.IsUserExist(UserName))
    {
        throw new Error(`用户${UserName}不存在，不能登录`)
    }
    await this.EnrollAdminFull('system_admin');//如果没有admin用户的话就注册一个在钱包里,不然下一行不能执行
    const response = await InvokeTransaction(CHANNELNAME, 'user_contract', 'UserLogin', [UserName, psw], 'admin', 'system_admin');
    return response.result;
}

/**
 * 这查询可以限制权限
 * @param {String} UserName 用户名
 * @returns 返回布尔值
 */
exports.IsUserExist = async (UserName, Actor = 'admin') =>
{
    let ActorOrganizationName;
    if (Actor === 'admin')
    {
        await this.EnrollAdminFull('system_admin');
        ActorOrganizationName = 'system_admin'
    }
    else
    {
        ActorOrganizationName = (JSON.parse(this.GetUserDatail(Actor))).org;
    }
    
    const response = InvokeTransaction(CHANNELNAME, 'user_contract', 'UserExists', [UserName], Actor, ActorOrganizationName);
    return response.result;
}
/**
 * 这个函数并非系统管理员调用，有可能是自己调用
 * @param {String} UserName 用户名字符串
 * @param {String} StringifiedString 字符串化的用户详细信息对象
 * @returns 返回true
 */
exports.SetUserDetail = async (UserName, StringifiedString, Actor = 'admin') =>
{
    let ActorOrganizationName;
    if (Actor === 'admin')
    {
        await this.EnrollAdminFull('system_admin');
        ActorOrganizationName = 'system_admin'
    }
    else
    {
        ActorOrganizationName = (JSON.parse(this.GetUserDatail(Actor))).org;
    }
    await this.EnrollAdminFull('system_admin');//如果没有admin用户的话就注册一个在钱包里,不然下一行不能执行
    ActorOrganizationName = (JSON.parse(this.GetUserDatail(Actor))).org;
    const response = InvokeTransaction(CHANNELNAME, 'user_contract', 'SetUsetDetail', [UserName, StringifiedString], Actor, ActorOrganizationName);
    return response.result;
}
/**
 * 获得parse之前的用户详细信息
 * 
 * @param {String} UserName 用户名字符串
 * @returns 和setuserdetail传进去的参数是相同的格式
 */
exports.GetUserDatail = async (UserName) =>
{
    await this.EnrollAdminFull('system_admin');
    const response = InvokeTransaction(CHANNELNAME, 'user_contract', 'GetUserDetail', [UserName], 'admin', 'system_admin');
    return response.result;
}
exports.GerUserOrg = async (Username) =>
{
    await this.EnrollAdminFull
}
exports.QueryUserByString = async (QueryString) =>
{
    //
}

/**
 * 采用区块链钱包文件系统判断用户是否存在。注意，在Fabric框架中允许在不同组织的两个人同名。
 * 因此该逻辑不宜后续采用
 * @param {String} UserName 用户名
 * @param {组织信息} OrganizationName 组织名称
 * @returns 
 */
exports.IsUserRegisteredByWallet = async (UserName, OrganizationName) =>
{
    const walletPath = path.join(__dirname, 'wallet-' + OrganizationName.toLowerCase());
    const wallet = await buildWallet(Wallets, walletPath);
    const UserNameentity = await wallet.get(UserName);
    if (UserNameentity)
    {
        console.log(`An identity for the user ${UserName} exists in the wallet`);
        return true;
    }
    return false;
}

