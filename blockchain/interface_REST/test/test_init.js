const { InitAdmin } = require('../src/initadmin');
const { RegisterUserBoth, SetUserDetail } = require('../src/controller');
async function main()
{
    await InitAdmin();
    await RegisterUserBoth('Donia7', 'supervisor', 'qweasdzxc');
    const doniadetail = {'性别':'a', 'age':233}
    const stringified = JSON.stringify(doniadetail);
    await SetUserDetail('Donia7', 'supervisor', stringified);
}
main()
