SET MICROFAB_CONFIG="{'port': 39650,'endorsing_organizations':[{'name': 'systemadmin'},{'name': 'supervisor'},{'name': 'entity'}],'channels':[{'name': 'channel1','endorsing_organizations':['systemadmin','supervisor','entity']}]}"
::docker run -e %MICROFAB_CONFIG% -p 127.0.0.1:40000:2000/tcp ibmcom/ibp-microfab
docker run -e %MICROFAB_CONFIG% -p 39650:39650 ibmcom/ibp-microfab
