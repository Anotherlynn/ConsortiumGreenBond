'use strict';

//get libraries
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path')
const jwt = require('jsonwebtoken')

//create express web-app
const app = express();
const router = express.Router();

//get the libraries to call
//var network = require('./network/network.js');
//var validate = require('./network/validate.js');
//var analysis = require('./network/analysis.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

//设置跨域访问
app.all('*', function (req, res, next)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//get home page
app.get('/', function (req, res)
{
    console.log('ssss')
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

//获取”发起交易“页面的”选择公司“下拉栏的数据
app.post('/api/transactionCompany', function (req, res)
{
    //print variables
    console.log('查询所有发行人');
    var token = req.body.token;
    const decoded = jwt.verify(token, 'somePrivateKey')
    cardid = decoded.cardid
    network.查询所有发行人(cardid)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                res.json({
                    error: response.error
                });
            } else
            {
                //else return success
                res.json({
                    success: response
                });
            }
        });
});
app.post('/api/login', function (req, res)
{
    //print variables
    console.log('用户登录');
    用户id = req.body.用户id
    cardid = req.body.cardid
    network.用户登录(用户id, cardid)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                res.json({
                    error: response.error
                });
            } else
            {
                //else return success
                res.json({
                    success: response
                });
            }
        });
});
//提交”发起交易“页面表单
app.post('/api/transaction', function (req, res)
{

    console.log('注册债券 收到请求')
    //declare variables to retrieve from request
    var token = req.body.token;
    const decoded = jwt.verify(token, 'somePrivateKey')
    cardid = decoded.cardid
    var 交易代码 = req.body.交易代码;
    var 发行规模 = req.body.发行规模;
    var 发行人简称 = req.body.发行人简称;
    var 债券全称 = req.body.债券全称;
    var 债券简称 = req.body.债券简称;
    var 募集资金用途 = req.body.募集资金用途;
    var GB类型 = req.body.GB类型;
    var 发行起始日 = req.body.发行起始日;
    var 是否贴标 = req.body.是否贴标;

    var 绿债金额 = req.body.绿债金额;
    var GB判断 = req.body.GB判断;
    var GI = req.body.GI;
    var GI符号 = req.body.GI符号;
    var 项目名称 = req.body.项目名称;
    var GB二级分类 = req.body.GB二级分类;
    var 所使用绿债金额 = req.body.所使用绿债金额;
    var 标签 = req.body.标签;
    var 备注 = req.body.备注;
    var 发行起始日 = req.body.发行起始日;
    var 发行期限 = req.body.发行期限;
    var 债券评级 = req.body.债券评级;
    var 主体评级 = req.body.主体评级;
    var 票面利率 = req.body.票面利率;
    var 浮动利率 = req.body.浮动利率;
    var 特殊条款 = req.body.特殊条款;
    var 增信方式 = req.body.增信方式;
    var 上市日期 = req.body.上市日期;
    var 上市地点 = req.body.上市地点;
    var 债券代码列表 = req.body.债券代码列表;
    var 到期日 = req.body.到期日;
    var 利率类型 = req.body.利率类型;
    var 付息频率 = req.body.付息频率;
    var 评级机构 = req.body.评级机构;
    var 担保人 = req.body.担保人;
    var 发行时担保人评级 = req.body.发行时担保人评级;
    var 担保人企业性质 = req.body.担保人企业性质;
    var 担保条款 = req.body.担保条款;
    var 主承销商 = req.body.主承销商;
    var 发行方式 = req.body.发行方式;
    var 发行价格 = req.body.发行价格;
    var Wind债券类型一级 = req.body.Wind债券类型一级;
    var Wind债券类型二级 = req.body.Wind债券类型二级;
    var 是否发行失败 = req.body.是否发行失败;
    var 是否城投债 = req.body.是否城投债;
    var 是否增发 = req.body.是否增发;
    var 是否跨市场 = req.body.是否跨市场;
    var 发行年度 = req.body.发行年度;
    var 发行人简称 = req.body.发行人简称;
    var 发行人全称 = req.body.发行人全称;
    var 公司介绍 = req.body.公司介绍;
    var 主要产品及类型 = req.body.主要产品及类型;
    var 发行人行业二级 = req.body.发行人行业二级;
    var 发行人企业性质wind = req.body.发行人企业性质wind;
    var 发行人企业性质2 = req.body.发行人行业性质2;
    var 发行人省份 = req.body.发行人省份;
    var 用户id = req.body.用户id;
    //print variables
    console.log('注册债券 参数-Using param - 交易代码: ' + 交易代码 + ' 发行规模: ' + 发行规模 + ' 发行人: ' + 发行人 + '\n 债券全称 ' + 债券全称 + '\n债券简称' + 债券简称 + '\n募集资金用途' + 募集资金用途 + '\n GB类型' + GB类型 + '\n发行起始日期' + 发行起始日期 + '\n是否贴标' + 是否贴标 + '\n发行规模' + 发行规模 + '\n绿债金额' + 绿债金额 + '\nGB判断' + GB判断 + '\nGI' + GI + '\nGI符号' + GI符号 + '\n项目名称' + 项目名称 + '\nGB二级分类' + GB二级分类 + '\n所使用绿债金额' + 所使用绿债金额 + '\n标签' + 标签 + '\n备注' + 备注 + '\n发行起始日' + 发行起始日 + '\n发行期限' + 发行期限 + '\n债券评级' + 债券评级 + '\n主体评级' + 主体评级 + '\n票面利率' + 票面利率 + '\n浮动利率' + 浮动利率 + '\n 特殊条款' + 特殊条款 + '\n增信方式' + 增新方式 + '\n上市日期' + 上市日期 + '\n上市地点' + 上市地点 + '\n债券代码列表' + 债券代码列表 + '\n到期日' + 到期日 + '\n利率类型' + 利率类型 + '\n付息频率' + 付息频率 + '\n评级机构' + 评级机构 + '\n担保人' + 担保人 + '\n发行时担保人评级' + 发行时担保人评级 + '\n担保人企业性质' + 担保人企业性质 + '\n担保条款' + 担保条款 + '\n主承销商' + 主承销商 + '\n发行方式' + 发行方式 + '\n发行价格' + 发行价格 + '\nWind债券类型一级' + Wind债券类型一级 + '\nWind债券类型二级' + Wind债券类型二级 + '\n是否发型失败' + 是否发行失败 + '\n是否城投债' + 是否城投债 + '\n是否增发' + 是否增发 + '\n是否跨市场' + 是否跨市场 + '\n发行年度' + 发行年度);
    console.log('发行人信息： ' + '\n发行人简称' + 发行人简称 + '\n发行人全称' + 发行人全称 + '\n公司介绍' + 公司介绍 + '\n主要产品及类型' + 主要产品及类型 + '\n发行人行业二级' + 发行人行业二级 + '\n发行人企业性质wind' + 发行人企业性质wind + '\n发行人企业性质2' + 发行人企业性质2 + '\n发行人省份' + 发行人省份);
    console.log('操作员信息：' + '用户id' + 用户id + 'cardid:' + cardid);
    network.注册债券(cardid, 交易代码, 债券全称, 债券简称, 募集资金用途, GB类型, 发行起始日, 是否贴标, 发行规模, 绿债金额, GB判断, GI, GI符号, 项目名称, GB二级分类, 所使用绿债金额, 标签, 备注, 发行起始日, 发行期限, 债券评级, 主体评级, 票面利率, 浮动利率, 特殊条款, 增信方式, 上市日期, 上市地点, 债券代码列表, 到期日, 利率类型, 付息频率, 评级机构, 担保人, 发行时担保人评级, 担保人企业性质, 担保条款, 主承销商, 发行方式, 发行价格, Wind债券类型一级, Wind债券类型二级, 是否发行失败, 是否城投债, 是否增发, 是否跨市场, 发行年度, 发行人简称, 用户id)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                res.json({
                    error: response.error
                });
            } else
            {
                //else return success
                res.json({
                    success: response
                });
            }
        });

});


app.post('/api/register', function (req, res)
{

    console.log('注册用户 收到请求')
    //前端只需要返回密码和公司,都是String
    //账户后端随机生成
    //营业执照暂不处理
    //完成后，后端会返回注册生成的完整信息
    var cardid = req.body.cardid;
    var 公司 = req.body.公司;

    //print variables
    console.log('注册用户 参数-Using param -: ' + ' cardid: ' + cardid + ' 公司: ' + 公司);

    network.注册用户(cardid, 公司)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                res.json({
                    error: response.error
                });
            } else
            {
                //else return success
                res.json({
                    success: response
                });
            }
        });

});

//提交"公司管理"页面表单
app.post('/api/companyManagement', function (req, res)
{

    console.log('注册发行人 收到请求')
    //类型都为String
    var token = req.body.token;
    const decoded = jwt.verify(token, 'somePrivateKey')
    var cardid = decoded.cardid
    var 发行人简称 = req.body.发行人简称
    var 发行人全称 = req.body.发行人全称
    var 公司介绍 = req.body.公司介绍
    var 主要产品及类型 = req.body.主要产品及类型

    var 发行人行业二级 = req.body.发行人行业二级
    var 发行人企业性质wind = req.body.发行人企业性质wind
    var 发行人企业性质2 = req.body.发行人企业性质2
    var 发行人省份 = req.body.发行人省份

    //print variables
    console.log('注册用户 参数-Using param - ' + 'cardid:' + cardid + '发行人简称: ' + 发行人简称 + ' 发行人全称: ' + 发行人全称 + ' 公司介绍: ' + 公司介绍 + '主要产品及类型' + 主要产品及类型 + '发行人行业二级' + 发行人行业二级 + '发行人企业性质wind' + 发行人企业性质wind + '发行人企业性质2' + 发行人企业性质2 + '发行人省份' + 发行人省份);

    network.注册发行人(cardid, 发行人简称, 发行人全称, 公司介绍, 主要产品及类型, 发行人行业二级, 发行人企业性质wind, 发行人企业性质2, 发行人省份)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                res.json({
                    error: response.error
                });
            } else
            {
                //else return success
                res.json({
                    success: response
                });
            }
        });

});
app.post('/api/generate', function (req, res)
{

    console.log('请求注册的账号')
    //前端只需要返回密码和公司,都是String
    //账户后端随机生成
    //营业执照暂不处理
    //完成后，后端会返回注册生成的完整信息
    var token = req.body.token;
    const decoded = jwt.verify(token, 'somePrivateKey')
    var cardid = decoded.cardid
    var 公司 = req.body.公司;

    //print variables
    console.log('注册用户 参数-Using param -: ' + ' cardid: ' + cardid + ' 公司: ' + 公司);

    network.注册用户(cardid, 公司)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                res.json({
                    error: response.error
                });
            } else
            {
                //else return success
                res.json({
                    success: response
                });
            }
        });

});
app.post('/api/uploadlicence', function (req, res)
{

    console.log('uploadlicence')
    //前端只需要返回密码和公司,都是String
    //账户后端随机生成
    //营业执照暂不处理
    //完成后，后端会返回注册生成的完整信息
    var token = req.body.token;
    const decoded = jwt.verify(token, 'somePrivateKey')
    var cardid = decoded.cardid
    var 公司 = req.body.公司;

    //print variables
    console.log('注册用户 参数-Using param -: ' + ' cardid: ' + cardid + ' 公司: ' + 公司);

    network.注册用户(cardid, 公司)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                res.json({
                    error: response.error
                });
            } else
            {
                //else return success
                res.json({
                    success: response
                });
            }
        });

});

//为”债券管理“页面获取数据
app.post('/api/management', function (req, res)
{
    //print variables
    console.log('查询所有债券');
    var token = req.body.token;
    const decoded = jwt.verify(token, 'somePrivateKey')
    var cardid = decoded.cardid
    network.查询所有债券(cardid)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                res.json({
                    error: response.error
                });
            } else
            {
                //else return success
                res.json({
                    success: response
                });
            }
        });
});
//为”交易数据“页面获取数据
app.post('/api/transactionData', function (req, res)
{
    //print variables
    console.log('查询交易日志');
    var token = req.body.token;
    const decoded = jwt.verify(token, 'somePrivateKey')
    var cardid = decoded.cardid
    network.查询交易日志(cardid)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                res.json({
                    error: response.error
                });
            } else
            {
                //else return success
                res.json({
                    success: response
                });
            }
        });
});

//暂时没用
app.post('//查询债券', function (req, res)
{
    //declare variables to retrieve from request
    var 交易代码 = req.body.交易代码;
    var cardid = req.body.cardid

    //print variables
    console.log('查询债券： Using param - 交易代码: ' + 交易代码);

    network.GETbondData(cardid, 交易代码)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                res.json({
                    error: response.error
                });
            } else
            {
                //else return success
                console.log('查询成功');
                res.json({
                    success: response
                });
            }
        });
});

//暂时没用
app.post('/api/查询cash', function (req, res)
{
    //declare variables to retrieve from request
    var 交易代码 = req.body.交易代码;
    var 发行规模 = req.body.发行规模
    var cardid = req.body.cardid
    //print variables
    console.log('查询cash： Using param - 交易代码: ' + 交易代码 + '发行规模:' + 发行规模);
    network.GETcashData(cardid, 交易代码, 发行规模)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                res.json({
                    error: response.error
                });
            } else
            {
                //else return success
                res.json({
                    success: response
                });
            }
        });
});
//declare port
var port = process.env.PORT || 9000;
if (process.env.VCAP_APPLICATION)
{
    port = process.env.PORT;
}

//run app on port
app.listen(port, function ()
{
    console.log('app running on port: %d', port);
});
