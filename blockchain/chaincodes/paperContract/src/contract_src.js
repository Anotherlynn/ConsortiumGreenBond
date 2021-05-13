/** 
 * SPDX-License-Identifier: Apache-2.0
 * 在这里实现绿色债券的合约
 * 主键：绿色债券唯一标识码
 */

'use strict';

const { Contract } = require('fabric-contract-api');
class GreenBondContract extends Contract
{
    /**
     * 根据bondid查询债券是否存在
     * @param {Context} ctx 接口对象 
     * @param {String} BondId 绿色债券唯一标识码 
     * @returns {Boolean} 返回是否存在
     */
    async BondExists(ctx, BondId)
    {
        const buffer = await ctx.stub.getState(BondId);
        return (!!buffer && buffer.length > 0);
    }
    /**
     * 提供bondid和详细信息，创建绿色债券
     * 没有在智能合约中实现schema，应该在后端编写详细的schema作为对象标准引入
     * @param {Context} ctx 
     * @param {String} BondId 唯一标识码
     * @param {String} objstr Stringnify之后的债券详细信息，注意一定是JSON.stringnify(obj)方法得到的
     * @returns {Boolean} 成功返回true，出了问题就直接抛出错误
     */
    async createBondWithObj(ctx, BondId, objstr)
    {
        const exists = await this.BondExists(ctx, BondId);
        if (exists)
        {
            throw new Error(`绿色债券 ${BondId} 已经存在了，不能重复创建`);
        }
        if (typeof objstr !== 'string')
        {
            throw new Error('objstr的类型应该是stringnify之后的字符串');
        }
        //const asset = JSON.parse(obj_string);
        let temp_obj;
        try
        {
            temp_obj = JSON.parse(objstr);
        }
        catch (e)
        {
            throw new Error('没办法解析objstr,考虑输入的东西是否严格是obj stringnify之后的东西');
        }
        const buffer = Buffer.from(JSON.stringify(temp_obj));
        await ctx.stub.putState(BondId, buffer);
        return true;//注册成功后返回true给caller.
    }
    /**
     * 读取债券的详细信息
     * @param {Context} ctx 接口对象
     * @param {String} BondId 唯一标识符
     * @returns {Object} 将会返回一个Object债券详细信息对象，查不到的话抛出错误
     */
    async readBond(ctx, BondId)
    {
        const exists = await this.BondExists(ctx, BondId);
        if (!exists)
        {
            throw new Error(`根据提供的BondID:${BondId}，查询并不存在`);
        }
        const buffer = await ctx.stub.getState(BondId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }
    /**
     * 更新债券信息，出了问题会抛出错误，成功后返回true
     * @param {Context} ctx 接口对象
     * @param {BondId} BondId 唯一标识符
     * @param {String} newValue 新的债券详细信息，注意该类型应于此类中的createBond中的value一致
     */
    async updateBond(ctx, BondId, objstr)
    {
        const exists = await this.BondExists(ctx, BondId);
        if (!exists)
        {
            throw new Error(`绿色债券 ${BondId} 并不存在，改不了`);
        }
        if (typeof objstr !== 'string')
        {
            throw new Error('objstr的类型应该是stringnify之后的字符串');
        }
        //const asset = JSON.parse(obj_string);
        let temp_obj;
        try
        {
            temp_obj = JSON.parse(objstr);
        }
        catch (e)
        {
            throw new Error('没办法解析objstr,考虑输入的东西是否严格是obj stringnify之后的东西');
        }
        const buffer = Buffer.from(JSON.stringify(temp_obj));
        await ctx.stub.putState(BondId, buffer);
        return true;//修改成功后返回true给caller.
    }

    /**
     * 
     * @param {Context} ctx 对象接口
     * @param {String} BondId 债券唯一标识符
     * @returns 如果删掉了就返回true，出了问题就报错
     */
    async deleteBond(ctx, BondId) {
        const exists = await this.BondExists(ctx, BondId);
        if (!exists)
        {
            throw new Error(`根据提供的BondID:${BondId}，查询并不存在，删不了`);
        }
        await ctx.stub.deleteState(BondId);
        return true;
    }
    /**
     * 这个查询方法适用于键比较连续的情形
     * 放这倒是没啥问题罢了，或许能用到
     * @param {Context} ctx 接口对象
     * @param {String} startKey 开始键
     * @param {String} endKey 结束键
     * @returns {String} 存有所有结果的Stringified JSON。注意这一JSON中每个元素都会是{Key:, Record:}
     */
    async queryAllAssets_by_range(ctx, startKey, endKey)
    {
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString())
            {
                console.log(res.value.value.toString());

                const Key = res.value.key;
                let Record;
                try
                {
                    Record = JSON.parse(res.value.value.toString());
                }
                catch (err)
                {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push({ Key, Record });
            }
            if (res.done)
            {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
    /**
     * 
     * @param {Context} ctx 对象接口
     * @param {String} BondId 债券唯一标识符
     * @returns {String} 返回Stringify之后的JSON查询结果，所以要注意在外Parse
     */
    async queryHistorybykey(ctx, BondId)
    {
        let resultsIterator = await ctx.stub.getHistoryForKey(BondId);
        let results = await this._GetAllResults(resultsIterator, true);
        return JSON.stringify(results);
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
    /**
     * 最重要的查询接口，查询语句在外部编写。注意符合CouchDB的mongo语法，e.g.{"selector":{"<key>":"<value>"}}
     * @param {Context} ctx 接口对象
     * @param {String} queryString 查询字符串
     * @returns Stringified JSON of quering results
     */
    async getQueryResultForQueryString(ctx, queryString)
    {
        const resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await this._GetAllResults(resultsIterator, false);
        return JSON.stringify(results)
    }
}

module.exports = GreenBondContract;
