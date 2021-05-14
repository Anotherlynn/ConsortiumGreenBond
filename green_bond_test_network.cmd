SET MICROFAB_CONFIG="{'port': 39600,'endorsing_organizations':[{'name': 'system_admin'},{'name': 'supervisor'},{'name': 'entity'}],'channels':[{'name': 'channel1','endorsing_organizations':['system_admin','supervisor','entity']}]}"
::docker run -e %MICROFAB_CONFIG% -p 127.0.0.1:40000:2000/tcp ibmcom/ibp-microfab
docker run -e %MICROFAB_CONFIG% -p 39600:39600 ibmcom/ibp-microfab
