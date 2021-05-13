/*
 * SPDX-License-Identifier: Apache-2.0
 */
/*
在这里实现用户注册和登录的接口
注意要把注册登录-用户详细信息表分开。
思路：详细信息当对象存储，不再区块链上数据建模了。
直接定义一个rich query接口
*/
'use strict';
const userpw_table_prefix = 'UserPwTable_';
const userdetail_table_prefix = 'UserDetailTable_';
const { Contract, Context } = require('fabric-contract-api');
class userContract extends Contract{
    /**
     * @param {Context} ctx
     * @param {String} name 
     * @param {String} psw 
     */
    async UserRegister(ctx, name, psw){
        
    }

    /**
     * 
     * @param {String} name 
     */
    async UserDelete(ctx, name){

    }

    /**
     * 
     * @param {String} name 
     * @param {String} details 这里传进来的应该是已经Stringnify后的字符串化对象，注意要在后端事先处理。因此不在区块链上建立Schema。
     */
    async SetUserDetail(ctx, name, details){

    }

    /**
     * 
     * @param {String} name 
     */
    async GetUserDetail(ctx, name){

    }
    
    async QueryUserByString(ctx, name, queryinfo){

    }
}
module.exports = userContract