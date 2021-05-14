const { EnrollAdminFull, IsUserRegisteredByWallet } = require('./controller.js');
exports.InitAdmin = async () =>
{
    if(!IsUserRegisteredByWallet('admin', 'systemadmin'))
    {
        await EnrollAdminFull('systemadmin');
    }
    if(!IsUserRegisteredByWallet('admin', 'entity'))
    {
        await EnrollAdminFull('entity');
    }
    if(!IsUserRegisteredByWallet('admin', 'supervisor'))
    {
        await EnrollAdminFull('supervisor');
    }
}

