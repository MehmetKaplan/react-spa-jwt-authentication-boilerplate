curip=`ifconfig | grep inet | grep -Ev 'inet6|10.0|127.0' | awk '{print $2}'` && sed -e "s/TAG_TEST_SERVER_IP/$curip/g" ../templates/api-ip.js > ./src/common-logic/api-ip.js

