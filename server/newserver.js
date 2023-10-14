//get libraries
const express = require('express');
const bodyParser = require('body-parser');
//const request = require('request');
//const path = require('path')
//const jwt = require('jsonwebtoken')
const controllers = require('../blockchain/interface_REST/src/controller')
const { InitAdmin } = require('../blockchain/interface_REST/src/initadmin');
InitAdmin();
//create express web-app
const app = express();
//const router = express.Router();

//get the libraries to call
//var network = require('./network/network.js');
//var validate = require('./network/validate.js');
//var analysis = require('./network/analysis.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

//设置跨域访问

app.all('*', function (req, res, next) {
    //设置请求头
    //允许所有来源访问
    res.header('Access-Control-Allow-Origin', '*')
    //用于判断request来自ajax还是传统请求
    res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept");
    //允许访问的方式
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    //修改程序信息与版本
    res.header('X-Powered-By', ' 3.2.1')
    //内容类型：如果是post请求必须指定这个属性
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
  })

//run app on port
app.listen(9000, function ()
{
    console.log('app running on port: 9000');
});

//get home page
// app.get('/', function (req, res)
// {
//     console.log('ssss')
//     res.sendFile(path.join(__dirname + '/public/index.html'));
// });

app.post('/api/login', function (req, res)
{
    //print variables
    
    let username = req.body.username;
    let org = req.body.org;
    let password = req.body.password;
    console.log(`用户登录${username},${org},${password}`);
    //network.用户登录(用户id, cardid)
    controllers.UserLogin(username, org, password)
        .then((response) =>
        {
            //return error if error in response
            if (response.error != null)
            {
                console.log('后台检测到登陆失败')
                console.log(response);
                res.json({
                    error: response.error,
                    status: 0
                });
            } else
            {
                //else return success
                console.log('后台检测到登陆成功')
                console.log(response);
                res.json({
                    success: response,
                    status:1
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
    //console.log('注册用户 参数-Using param -: ' + ' cardid: ' + cardid + ' 公司: ' + 公司);

    //network.注册用户(cardid, 公司)
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