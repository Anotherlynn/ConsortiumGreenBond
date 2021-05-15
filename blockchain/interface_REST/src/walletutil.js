const path = require('path');
const { buildWallet } = require('./AppUtil.js');
const { Wallets } = require('fabric-network');
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
        console.log(`An identity for the user ${UserName}.${OrganizationName} exists in the wallet`);
        return true;
    }
    return false;
}