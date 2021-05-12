#注意，当前情形下的domain_name为"127-0-0-1.nip.io"
#默认的order organization名字是orderer
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
