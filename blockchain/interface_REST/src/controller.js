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
    console.log(`用户${UserName}的钱包应属路径是${WalletPathString},注意尚不知道文件钱包是否存在`);
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
 * @param {String} OrganizationName 组织名称
 */
exports.RegisterUserOnBlockchain = async (UserName, UserPassword) =>
{
    await this.EnrollAdminFull('system_admin');//如果没有admin用户的话就注册一个在钱包里,不然下一行不能执行
    const response = await InvokeTransaction(CHANNELNAME, 'user_contract', 'UserRegister', [UserName, UserPassword], 'admin', 'system_admin');
    return response.result;
}
exports.IsUserExist = async (UserName) =>
{
    await this.EnrollAdminFull('system_admin');//如果没有admin用户的话就注册一个在钱包里,不然下一行不能执行
    const response = InvokeTransaction(CHANNELNAME, 'user_contract', 'UserExists', [UserName], 'admin', 'system_admin');
    return response.result;
}
exports.SetUserDetail = async (UserName, StringifiedString) =>
{
    await this.EnrollAdminFull('system_admin');//如果没有admin用户的话就注册一个在钱包里,不然下一行不能执行
    const response = InvokeTransaction(CHANNELNAME, 'user_contract', 'SetUsetDetail', [UserName, StringifiedString], 'admin', 'system_admin');
    return response.result;
}
exports.RegisterUserBoth = async (UserName, UserPassword, OrganizationName) =>
{
    await this.RegisterUserOnBlockchain(UserName, UserPassword, 'system_admin');
    await this.RegisterUserOnWallet(UserName, OrganizationName);
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

