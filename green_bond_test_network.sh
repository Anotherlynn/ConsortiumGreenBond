#注意，当前情形下的domain_name为"127-0-0-1.nip.io"
#默认的order organization名字是orderer
#注意要在linux发布，windows的docker不知道把网卡弄成什么样子
#很烦，因此全栈在ubuntu上进行。
export MICROFAB_CONFIG='{
    "port": 39600,
    "endorsing_organizations":[
        {
            "name": "systemadmin"
        },
        {
            "name": "supervisor"
        },
        {
            "name": "entity"
        }
    ],
    "channels":[
        {
            "name": "channel1",
            "endorsing_organizations":[
                "systemadmin",
                "supervisor",
                "entity"
            ]
        }
    ]
}'
docker run -e MICROFAB_CONFIG -p 39600:39600 ibmcom/ibp-microfab
