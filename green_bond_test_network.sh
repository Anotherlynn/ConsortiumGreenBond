#注意，当前情形下的domain_name为"127-0-0-1.nip.io"
#默认的order organization名字是orderer
#注意要在linux发布，windows发布后网络问题很迷惑
#windows的dockers不知道把容器发布在甚么端口了
export MICROFAB_CONFIG='{
    "port": 39600,
    "endorsing_organizations":[
        {
            "name": "system_admin"
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
                "system_admin",
                "supervisor",
                "entity"
            ]
        }
    ]
}'
docker run -e MICROFAB_CONFIG -p 39600:39600 ibmcom/ibp-microfab
