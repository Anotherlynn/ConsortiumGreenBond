const { BuildConnectionFile, buildWallet } = require('./AppUtil');
const GlobalVars = require('../global_vars.js');
const path = require('path');
const NetWorkName = GlobalVars.NetWorkName;
const { Wallets, Gateway } = require('fabric-network');
const { EnrollAdminFull, IsUserRegisteredByWallet} = require('./controller');
exports.InvokeTransaction = async (ChannelName, ChaincodeName, fcn, args, ActorName, ActorOrganizationName) =>
{
    try
    {
        //logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));
        // if (ActorName === 'admin')
        // {
            
        // }
        if (ActorName === 'admin' && ActorOrganizationName === 'systemadmin')
        {
            if (!IsUserRegisteredByWallet('admin', 'systemadmin'))
            {
                await EnrollAdminFull('systemadmin');
            }
        }
        const OrgNameLower = ActorOrganizationName.toLowerCase();
        //const FirstHighOthersLowOrgName = ActorOrganizationName[0].toUpperCase() + (ActorOrganizationName.substring(1)).toLowerCase();
        const WalletPathName = OrgNameLower + '_wallets';
        const ConnectionConfigFileName = NetWorkName + ActorOrganizationName[0].toUpperCase() + (ActorOrganizationName.substring(1)).toLowerCase() + 'GatewayConnection.json'//注意只是文件名
        const ConnectionConfigFile = BuildConnectionFile(OrgNameLower, ConnectionConfigFileName);
        const WalletPathString = path.resolve(__dirname, '..', 'wallets', WalletPathName);

        const wallet = await buildWallet(Wallets, WalletPathString);//基于文件系统的钱包文件
        console.log(`用户${ActorName}的钱包应属路径是${WalletPathString},注意尚不知道文件钱包是否存在`);
        //const mspID = ActorOrganizationName[0].toUpperCase() + (ActorOrganizationName.substring(1)).toLowerCase() + 'MSP';

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(ActorName);
        if (!identity)
        {
            console.log(` ${ActorName} 并不存在于 ${ActorOrganizationName} 的钱包文件目录中`);
            throw new Error(`${ActorName}并不存在于 ${ActorOrganizationName} 的钱包文件目录中`);
        }
        const connectOptions =
        {
            wallet,
            identity: ActorName,
            discovery: { enabled: true, asLocalhost: true },
        }
        const gateway = new Gateway();
        try
        {
            await gateway.connect(ConnectionConfigFile, connectOptions);
            const network = await gateway.getNetwork(ChannelName);
            const contract = network.getContract(ChaincodeName);

            let result;
            let message;

            if (fcn === "UserRegister")
            {
                result = await contract.submitTransaction(fcn, args[0], args[1], args[2]);
                message = "注册用户";
            }
            if (fcn === "UserExists")
            {
                result = await contract.submitTransaction(fcn, args[0], args[1]);
                message = "检查用户是否存在"
            }
            if (fcn === "SetUserDetail")
            {
                result = await contract.submitTransaction(fcn, args[0], args[1], args[2]);
                message = "设置用户详细信息";
            }
            if (fcn === "GetUserDetail")
            {
                result = await contract.submitTransaction(fcn, args[0], args[1]);
                message = "获得用户详细信息";
            }
            if (fcn === "QueryUserByString")
            {
                result = await contract.submitTransaction(fcn, args[0]);
                message = "用户富查询";
            }
            if (fcn === "UserLogin")
            {
                result = await contract.submitTransaction(fcn, args[0], args[1], args[2]);
                message = "用户登录";
            }
                let response =
                {
                    message: message,
                    result
                }
            return response;
        }
        finally
        {
            gateway.disconnect();
        }
    }
    catch (error)
    {
        console.log(`运行智能合约时捕获到了错误: ${error}`)
        // return error.message
        let response =
        {
            status: 404,
            'content': '运行智能合约时捕获到了错误',
            'error': error,
        }
        return response;
    }
}