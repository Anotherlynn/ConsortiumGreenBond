/*
 * SPDX-License-Identifier: Apache-2.0
 */
/*
在这里实现用户注册和登录的接口
把注册登录-用户详细信息表分开，因为目前密码是必填项，详细信息可以且着
注意，Fabric按照organizatio管理组织，所以用户的主键是name.org
org只有三种取值['systemadmin', 'supervisor', 'entity']，区分大小写
思路：详细信息当对象存储，不再区块链上数据建模了。
直接定义一个rich query接口
用户名区分大小写
*/
'use strict';
const userpw_table_prefix = 'UserPwTable_';
const userdetail_table_prefix = 'UserDetailTable_';
const { Contract } = require('fabric-contract-api');
class UserContract extends Contract
{
    async UserExists(ctx, name, org)
    {
        const UserId = userpw_table_prefix + name + '.' + org;
        const buffer = await ctx.stub.getState(UserId);
        return (!!buffer && buffer.length > 0);
    }
    /**
     * @param {Context} ctx
     * @param {String} name 
     * @param {String} psw 
     */
    async UserRegister(ctx, name, org, psw)
    {
        const UserId = userpw_table_prefix + name + '.' + org;
        const exists = await this.UserExists(ctx, UserId);
        if (exists)
        {
            throw new Error(`用户 ${name} 已经存在了，不能重复注册`);
        }
        if (psw.length === 0)
        {
            throw new Error(`密码不能为空`);
        }
        const buffer = Buffer.from(psw);
        await ctx.stub.putState(UserId, buffer);
        return true;
    }
    /**
     * 
     * @param {*} ctx 
     * @param {*} name 
     * @param {*} org 
     * @param {*} psw 
     * @returns 
     */
    async UserLogin(ctx, name, org, psw)
    {
        const UserId = userpw_table_prefix + name + '.' + org;
        const exists = await this.UserExists(ctx, name, org);
        if (!exists)
        {
            throw new Error(`用户 ${name} 不存在`);
        }
        const pw = await ctx.stub.getState(UserId);
        const decode_pw = pw.toString();
        if (psw === decode_pw)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    /**
     * 
     * @param {String} name 
     */
    async UserDelete(ctx, name, org)
    {
        const exists = await this.UserExists(ctx, name, org);
        if (!exists)
        {
            throw new Error(`用户${name}.${org}不存在，不能删除`);
        }
        const UserId = userpw_table_prefix + name + '.' + org;
        const DetailId = userdetail_table_prefix + name;
        await ctx.stub.deleteState(UserId);
        await ctx.stub.deleteState(DetailId);
        return true;
    }

    /**
     * 
     * @param {String} name 
     * @param {String} details 这里传进来的应该是已经Stringnify后的字符串化对象，注意要在后端事先处理。因此不在区块链上建立Schema。
     */
    async SetUserDetail(ctx, name, org, StringifiedDetail)
    {
        const exists = await this.UserExists(ctx, name, org);
        if (!exists)
        {
            throw new Error(`用户${name}尚未注册，不能设置详细信息`);
        }
        const buffer = Buffer.from(StringifiedDetail);
        const DetailId = userdetail_table_prefix + name + '.' + org;
        await ctx.stub.putState(DetailId, buffer);
        return true;//设置成功后返回true
    }

    /**
     * 
     * @param {String} name 
     */
    async GetUserDetail(ctx, name, org)
    {
        const exists = await this.UserExists(ctx, name, org);
        if (!exists)
        {
            throw new Error(`用户${name}不存在，不能获取其详细信息`);
        }
        const DetailId = userdetail_table_prefix + name + '.' + org;
        const buffer = await ctx.stub.getState(DetailId);
        //const DetailString = JSON.parse(buffer.toString());//返回值有问题
        const StringifiedDetail = buffer.toString();
        return StringifiedDetail;
    }

    async QueryUserByString(ctx, queryString)
    {
        const resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await this._GetAllResults(resultsIterator, false);
        return JSON.stringify(results)
    }
    async _GetAllResults(iterator, isHistory)
    {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done)
        {
            if (res.value && res.value.value.toString())
            {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true)
                {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    try
                    {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch (err)
                    {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                }
                else
                {
                    jsonRes.Key = res.value.key;
                    try
                    {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch (err)
                    {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }

}
module.exports = UserContract