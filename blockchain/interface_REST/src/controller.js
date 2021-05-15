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
    //await enrollAdmin(caClient, wallet, mspID);
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
    return response;
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
    //TODO:返回response还是结果？
    await this.RegisterUserOnBlockchain(UserName, UserOrg, UserPassword);
    const response = await this.RegisterUserOnWallet(UserName, UserOrg);
    console.log('在两个地方成功注册了用户')
    return response;
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
    const response =  await InvokeTransaction(CHANNELNAME, 'user_contract', 'UserLogin', [UserName, UserOrg, psw], 'admin', 'systemadmin');
    return response;
}

/**
 * 这查询接口可以由其他人来调用
 * @param {String} UserName 用户名
 * @param {String} UserOrg 用户所属组织，注意这个东西只有三种取值情形['systemadmin','entity','supervisor']
 * @returns 返回布尔值
 */
exports.IsUserExist = async (UserName, UserOrg, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    const response = await InvokeTransaction(CHANNELNAME, 'user_contract', 'UserExists', [UserName, UserOrg], Actor, ActorOrg);
    return response;
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

    const response = await InvokeTransaction(CHANNELNAME, 'user_contract', 'SetUserDetail', [UserName, UserOrg, StringifiedString], Actor, ActorOrg);
    return response;
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
    // if (!this.IsUserExist(UserName, UserOrg))
    // {
    //     throw new Error(`用户${UserName}.${UserOrg}不存在,不能获得信息`);
    // }
    const response = await InvokeTransaction(CHANNELNAME, 'user_contract', 'GetUserDetail', [UserName, UserOrg], Actor, ActorOrg);
    return response;
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
    const response = await InvokeTransaction(CHANNELNAME, 'user_contract', 'QueryUserByString', [QueryString], Actor, ActorOrg);
    return response;
}


/**
 * 
 * @param {String} BondId 债券的唯一标识符
 * @param {String} Actor 发起者
 * @param {String} ActorOrg 用户所属组织，注意这个东西只有三种取值情形['systemadmin','entity','supervisor']
 * @returns {Boolean} 是否存在的布尔值
 */
exports.BondExists = async (BondId, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    const response = await InvokeTransaction(CHANNELNAME, 'greenbond_contract', 'BondExists', [BondId], Actor, ActorOrg);
    return response.result;
}
/**
 * 
 * @param {String} BondId 债券的唯一标识符
 * @param {string} ObjStr stringified之后的债券详细信息对象
 * @param {String} Actor 发起者
 * @param {String} ActorOrg 用户所属组织，注意这个东西只有三种取值情形['systemadmin','entity','supervisor']
 * @returns {Boolean} 创建成功则返回true
 */
exports.CreateBondWithObj = async (BondId, ObjStr, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    const response = await InvokeTransaction(CHANNELNAME, 'greenbond_contract', 'createBondWithObj', [BondId, ObjStr], Actor, ActorOrg);
    return response.result;
}
/**
 * 
 * @param {String} BondId 债券的唯一标识符
 * @param {String} Actor 发起者
 * @param {String} ActorOrg 用户所属组织，注意这个东西只有三种取值情形['systemadmin','entity','supervisor']
 * @returns {String} 返回Stringified的详细信息对象
 */
exports.ReadBond = async (BondId, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    const response = await InvokeTransaction(CHANNELNAME, 'greenbond_contract', 'readBond', [BondId], Actor, ActorOrg);
    return response.result;
}
/**
 * 
 * @param {String} BondId 债券的唯一标识符
 * @param {String} Actor 发起者
 * @param {string} ObjStr stringified之后的债券详细信息对象
 * @param {String} ActorOrg 用户所属组织，注意这个东西只有三种取值情形['systemadmin','entity','supervisor']
 * @returns {Boolean} 修改成功则返回true
 */
exports.UpdateBond = async (BondId, ObjStr, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    const response = await InvokeTransaction(CHANNELNAME, 'greenbond_contract', 'updateBond', [BondId, ObjStr], Actor, ActorOrg);
    return response.result;
}
/**
 * 
 * @param {String} BondId 债券的唯一标识符
 * @param {String} Actor 发起者
 * @param {String} ActorOrg 用户所属组织，注意这个东西只有三种取值情形['systemadmin','entity','supervisor']
 * @returns {Boolean} 是否存在的布尔值
 */
exports.DeleteBond = async (BondId, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    const response = await InvokeTransaction(CHANNELNAME, 'greenbond_contract', 'deleteBond', [BondId], Actor, ActorOrg);
    return response.result;
}
/**
 * 
 * @param {String} StartKey 开始键
 * @param {String} EndKey 结束键
 * @param {String} Actor 发起者
 * @param {String} ActorOrg 用户所属组织，注意这个东西只有三种取值情形['systemadmin','entity','supervisor']
 * @returns {String} Stringified后的查询结果列表
 */
exports.QueryAllAssets_by_range = async (StartKey, EndKey, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    const response = await InvokeTransaction(CHANNELNAME, 'greenbond_contract', 'queryAllAssets_by_range', [StartKey, EndKey], Actor, ActorOrg);
    return response.result;
}
/**
 * 可以查询到债券的所有变更记录
 * @param {String} BondId 债券id
 * @param {String} Actor 发起者
 * @param {String} ActorOrg 用户所属组织，注意这个东西只有三种取值情形['systemadmin','entity','supervisor']
 * @returns {String} Stringified后的查询结果列表
 */
exports.QueryHistorybykey = async (BondId, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    const response = await InvokeTransaction(CHANNELNAME, 'greenbond_contract', 'queryHistorybykey', [BondId], Actor, ActorOrg);
    return response.result;
}
/**
 * 
 * @param {String} queryString 符合mango语法的富查询语句
 * @param {String} Actor 发起者
 * @param {String} ActorOrg 发起者隶属组织
 * @returns Stringified后的查询结果列表
 */
exports.GetQueryResultForQueryString = async (queryString, Actor = 'admin', ActorOrg = 'systemadmin') =>
{
    const response = await InvokeTransaction(CHANNELNAME, 'greenbond_contract', 'getQueryResultForQueryString', [queryString], Actor, ActorOrg);
    return response.result;
}