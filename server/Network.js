const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

const jwt = require('jsonwebtoken')

//declate namespace
const namespace = 'org.greenbond.biznet';

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore({ type: 'composer-wallet-inmemory' });

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = 'greenbond';
let factory;

/*
* Import card for an identity
* @param {String} cardName The card name to use for this identity
* @param {Object} identity The identity details
*/
async function importCardForIdentity(cardName, identity) {

    //use admin connection
    adminConnection = new AdminConnection();
    //declare metadata
    const metadata = {
        userName: identity.userID,
        version: 1,
        enrollmentSecret: identity.userSecret,
        businessNetwork: businessNetworkName
    };
    //get connectionProfile from json, create Idcard
    const connectionProfile = require('./local_connection.json');
    const card = new IdCard(metadata, connectionProfile);
    //import card
    await adminConnection.importCard(cardName, card);
}
/*
* Reconnect using a different identity
* @param {String} cardName The identity to use
*/
async function useIdentity(cardName) {
    //disconnect existing connection
    await businessNetworkConnection.disconnect();
    //connect to network using cardName
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardName);
}

//export module
module.exports = {

    注册用户: async function (cardid, 公司) {
        try {
            //connect to network with cardid
            businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@greenbond');
            console.log('1')

            //get the factory for the business network.
            factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            const 新用户 = factory.newResource(namespace, '用户', 用户id);
            用户id = Math.round(Math.random() * 10000000);
            新用户.用户id = 用户id;
            新用户.cardid = cardid;
            新用户.级别 = '普通用户'
            新用户.公司 = 公司
            //add member participant
            const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.用户');
            await participantRegistry.add(新用户);

            //issue identity
            const identity = await businessNetworkConnection.issueIdentity(namespace + '.用户#' + 用户id, cardid);

            //import card for identity
            await importCardForIdentity(cardid, identity);

            //disconnect
            await businessNetworkConnection.disconnect('admin@greenbond');

            return 新用户;
        }
        catch (err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }
    },
    /*
    * Get Member data
    * @param {String} cardid Card id to connect to network
    * @param {String} accountNumber Account number of member
    */
    用户登录: async function (cardid, 用户id) {

        try {

            //connect to network with cardid
            businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect(cardid);

            //get member from the network
            const memberRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.用户');
            const 用户数据 = await memberRegistry.get(用户id);

            //disconnect
            await businessNetworkConnection.disconnect(cardid);
            const user = { cardid: cardid }
            const token = jwt.sign(user, 'somePrivateKey')
            用户数据.token = token;

            //return member object
            return 用户数据;
        }
        catch (err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }

    },

    注册发行人: async function (cardid, 发行人简称, 发行人全称, 公司介绍, 主要产品及类型, 发行人行业二级, 发行人企业性质wind, 发行人企业性质2, 发行人省份) {
        try {
            //connect to network with cardid
            businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect(cardid);
            console.log('1')

            //get the factory for the business network.
            factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            const 新发行人 = factory.newResource(namespace, '发行人', 发行人简称);
            新发行人.发行人全称 = 发行人全称
            新发行人.公司介绍 = 公司介绍
            新发行人.主要产品及类型 = 主要产品及类型
            新发行人.发行人行业二级 = 发行人行业二级
            新发行人.发行人企业性质wind = 发行人企业性质wind
            新发行人.发行人企业性质2 = 发行人企业性质2
            新发行人.发行人省份 = 发行人省份
            //add member participant
            const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.发行人');
            await participantRegistry.add(新发行人);

            //disconnect
            await businessNetworkConnection.disconnect(cardid);

            return true;
        }
        catch (err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }
    },
    /*
    * 发布bond并初始化对应的cash
    * @param {String} bondid bond的主key
    * @param {Long} value 债券金额
    * @param {String} issuer 债券发行者
    */
    注册债券: async function (cardid, 交易代码, 债券全称, 债券简称, 募集资金用途, GB类型, 发行起始日, 是否贴标, 发行规模, 绿债金额, GB判断, GI, GI符号, 项目名称, GB二级分类, 所使用绿债金额, 标签, 备注, 发行期限, 债券评级, 主体评级, 票面利率, 浮动利率, 特殊条款, 增信方式, 上市日期, 上市地点, 债券代码列表, 到期日, 利率类型, 付息频率, 评级机构, 担保人, 发行时担保人评级, 担保人企业性质, 担保条款, 主承销商, 发行方式, 发行价格, Wind债券类型一级, Wind债券类型二级, 是否发行失败, 是否城投债, 是否增发, 是否跨市场, 发行年度, 发行人简称, 用户id) {
        try {
            //connect to network with cardid
            businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect(cardid);
            console.log('1')

            //get the factory for the business network.
            factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            Intvalue = parseInt(发行规模);
            const PublishBond = factory.newTransaction(namespace, '注册债券');
            PublishBond.交易代码 = 交易代码;
            PublishBond.债券信息 = factory.newConcept(namespace, '债券信息')
            PublishBond.债券信息.发行规模 = Intvalue;
            PublishBond.债券信息.发行人简称 = factory.newRelationship(namespace, '发行人', 发行人简称);
            PublishBond.债券信息.债券全称 = 债券全称
            PublishBond.债券信息.债券简称 = 债券简称
            PublishBond.债券信息.募集资金用途 = 募集资金用途
            PublishBond.债券信息.GB类型 = GB类型
            PublishBond.债券信息.发行起始日 = 发行起始日
            PublishBond.债券信息.是否贴标 = 是否贴标
            PublishBond.债券信息.绿债金额 = 绿债金额
            PublishBond.债券信息.GB判断 = GB判断
            PublishBond.债券信息.GI = GI
            PublishBond.债券信息.GI符号 = GI符号
            PublishBond.债券信息.项目名称 = 项目名称
            PublishBond.债券信息.GB二级分类 = GB二级分类
            PublishBond.债券信息.所使用绿债金额 = 所使用绿债金额
            PublishBond.债券信息.标签 = 标签
            PublishBond.债券信息.备注 = 备注
            PublishBond.债券信息.发行起始日 = 发行起始日
            PublishBond.债券信息.发行期限 = 发行期限
            PublishBond.债券信息.债券评级 = 债券评级
            PublishBond.债券信息.主体评级 = 主体评级
            PublishBond.债券信息.票面利率 = 票面利率
            PublishBond.债券信息.浮动利率 = 浮动利率
            PublishBond.债券信息.特殊条款 = 特殊条款
            PublishBond.债券信息.增信方式 = 增信方式
            PublishBond.债券信息.上市日期 = 上市日期
            PublishBond.债券信息.上市地点 = 上市地点
            PublishBond.债券信息.债券代码列表 = 债券代码列表
            PublishBond.债券信息.到期日 = 到期日
            PublishBond.债券信息.利率类型 = 利率类型
            PublishBond.债券信息.付息频率 = 付息频率
            PublishBond.债券信息.评级机构 = 评级机构
            PublishBond.债券信息.担保人 = 担保人
            PublishBond.债券信息.发行时担保人评级 = 发行时担保人评级
            PublishBond.债券信息.担保人企业性质 = 担保人企业性质
            PublishBond.债券信息.担保条款 = 担保条款
            PublishBond.债券信息.主承销商 = 主承销商
            PublishBond.债券信息.发行方式 = 发行方式
            PublishBond.债券信息.发行价格 = 发行价格
            PublishBond.债券信息.Wind债券类型一级 = Wind债券类型一级
            PublishBond.债券信息.Wind债券类型二级 = Wind债券类型二级
            PublishBond.债券信息.是否发行失败 = 是否发行失败
            PublishBond.债券信息.是否城投债 = 是否城投债
            PublishBond.债券信息.是否增发 = 是否增发
            PublishBond.债券信息.是否跨市场 = 是否跨市场
            PublishBond.债券信息.发行年度 = 发行年度

            //submit transaction
            await businessNetworkConnection.submitTransaction(PublishBond);
            console.log('5')
            //disconnect
            await businessNetworkConnection.disconnect(cardid);

            return true;

        }
        catch (err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
    * 根据已有bondid来查询对应债券的相关信息
    * @param {String} bondid bond的主key
    */
    查询债券: async function (cardid, 交易代码) {

        try {
            //connect to network with cardid
            businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect(cardid);

            //get member from the network
            const bondRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.债券');
            const bond = await bondRegistry.get(交易代码);

            //disconnect
            await businessNetworkConnection.disconnect(cardid);

            //return member object
            return bond;
        }
        catch (err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }
    },

    查询所有债券: async function (cardid) {
        try {
            const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
            const connection = new BusinessNetworkConnection();
            await connection.connect(cardid);
            const query = connection.buildQuery('SELECT org.greenbond.biznet.债券 ');
            const 所有债券信息 = await connection.query(query);
            await businessNetworkConnection.disconnect(cardid);

            return 所有债券信息;
        }
        catch (err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error
        }
    },
    查询所有发行人: async function (cardid) {
        try {
            const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
            const connection = new BusinessNetworkConnection();
            await connection.connect(cardid);
            const query = connection.buildQuery('SELECT org.greenbond.biznet.发行人 ');
            const 所有发行人信息 = await connection.query(query);
            await businessNetworkConnection.disconnect(cardid);

            return 所有发行人信息;
        }
        catch (err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error
        }
    },

    /*
    * 根据已有bondid和value字段来匹配查询对应cash的相关信息
    * @param {String} bondid bond的主key
    * @param {Long} value bond的价值
    */
    查询cash: async function (cardid, 交易代码, 发行规模) {

        try {
            //connect to network with cardid
            businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect(cardid);
            const cash = new Array();
            for (var i = 0; i < 发行规模; i++) {
                cashid = 交易代码 + i.toString();
                //get member from the network
                const cashRegistry = await businessNetworkConnection.getAssetRegistry(namespace + 'CashAsset');
                cash[i] = await cashRegistry.get(cashid);
            }
            //disconnect
            await businessNetworkConnection.disconnect(cardid);
            //return cash[] object
            return cash;
        }
        catch (err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }
    },
    查询交易日志: async function (cardid) {
        try {
            const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
            const connection = new BusinessNetworkConnection();
            await connection.connect(cardid);
            const query = connection.buildQuery('SELECT org.greenbond.biznet.注册债券 ');
            const 交易日志 = await connection.query(query);
            await businessNetworkConnection.disconnect(cardid);

            return 交易日志;
        }
        catch (err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error
        }
    },

    /*
    * 查询测试
    * @param {String} value 查询值
    */
    QUERY: async function (input) {
        try {
            //connect to network with cardid
            businessNetworkConnection = new BusinessNetworkConnection();
            await businessNetworkConnection.connect('admin@greenbond');
            const query = businessNetworkConnection.buildQuery('SELECT org.greenbond.biznet.BondAsset WHERE (bondid == _$inputValue)');
            const assets = await businessNetworkConnection.query(query, { inputValue: input })
            //disconnect
            await businessNetworkConnection.disconnect('admin@greenbond');
            //return cash[] object
            return assets;
        }
        catch (err) {
            //print and return error
            console.log(err);
            var error = {};
            error.error = err.message;
            return error;
        }
    }
}
