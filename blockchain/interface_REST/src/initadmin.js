const { EnrollAdminFull } = require('./controller.js');
//const { IsUserRegisteredByWallet } = require('./walletutil')
exports.InitAdmin = async () =>
{
    // if (await !IsUserRegisteredByWallet('admin', 'systemadmin'))
    // {
    //     await EnrollAdminFull('systemadmin');
    // }
    // if (await !IsUserRegisteredByWallet('admin', 'entity'))
    // {
    //     await EnrollAdminFull('entity');
    // }
    // if (await !IsUserRegisteredByWallet('admin', 'supervisor'))
    // {
    //     await EnrollAdminFull('supervisor');
    // }
    await EnrollAdminFull('systemadmin');
    await EnrollAdminFull('supervisor');
    await EnrollAdminFull('entity');
    console.log('成功初始化了三个组织的管理员')
}

