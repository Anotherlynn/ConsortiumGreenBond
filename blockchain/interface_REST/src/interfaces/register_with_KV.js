
exports.RegisterUser = async (userID, organizationName) => {

    //const orgName = organizationName.toLowerCase()+'.vrs.com';
    //const ccpName = 'connection-profile-'+organizationName.toLowerCase()+'.json';
    //const caName = 'ca.'+organizationName.toLowerCase()+'.vrs.com';
    const ccpName = 'GreenbondTest' + organizationName[0].toUpperCase() + (organizationName.substring(1)).toLowerCase() + 'GatewayConnection.json'
    const orgName = organizationName.toLowerCase();
    //const ccpName = 'connection.json';
    const caName = orgName + 'ca-api.127-0-0-1.nip.io:39600';
    const ccp = buildCCP(orgName, ccpName);
    const caClient = buildCAClient(FabricCAServices, ccp, caName);
    //const walletPath = path.join(__dirname, 'wallet-'+organizationName.toLowerCase());
    const pathName = orgName + '_wallets';
    const walletPath = path.resolve(__dirname, '..', 'wallets', pathName)

    console.log(`walletpath is ${walletPath}`)
    const wallet = await buildWallet(Wallets, walletPath);

    // if(organizationName.toLowerCase() == "manufacturer"){
    //     mspID = "ManufacturerMSP";
    // }else if(organizationName.toLowerCase() == "dealer"){
    //     mspID = "DealerMSP";
    // }else if(organizationName.toLowerCase() == "excise"){
    //     mspID = "ExciseMSP";
    // }else{
    //     throw new Error(`no such MSP found: ${organizationName.toLowerCase()}`);
    // }
    // mspID = 'Org1MSP'
    mspID = orgName + 'MSP'
    await enrollAdmin(caClient, wallet, mspID);
    await registerAndEnrollUser(caClient, wallet, mspID, userID);
    var response = {
        success: true,
        message: userID + ' enrolled Successfully',
    };
    return response;

}