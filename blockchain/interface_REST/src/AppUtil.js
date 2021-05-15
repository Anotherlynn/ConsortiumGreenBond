/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');

exports.BuildConnectionFile = (OrgName, FileName) => 
{
	// load the common connection configuration file
	//const ccpPath = path.resolve(__dirname, '..','..','crypto-config', 'peerOrganizations', orgName , fileName);
	//const ccpPath = path.resolve(__dirname, '..', 'connection.json')
	//console.log(`开始构建往${OrgName}的认证服务器连接文件路径`);
	const ccpPath = path.resolve(__dirname, '..', 'connection_cfgs', FileName)
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');
	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);
	//console.log(`成功加载连接文件，路径是 ${ccpPath}`);
	return ccp;
};



exports.buildWallet = async (Wallets, walletPath) => 
{
	// Create a new  wallet : Note that wallet is for managing identities.
	let wallet;
	if (walletPath)
	{
		wallet = await Wallets.newFileSystemWallet(walletPath);
		//console.log(`构建基于文件系统的钱包对象，其路径是 ${walletPath}`);
	}
	else
	{
		wallet = await Wallets.newInMemoryWallet();
		console.log('在内存里开了个钱包');
	}
	return wallet;
};

exports.prettyJSONString = (inputString) => 
{
	if (inputString) {
		return JSON.stringify(JSON.parse(inputString), null, 2);
	}
	else {
		return inputString;
	}
}