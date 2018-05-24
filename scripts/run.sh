#!/bin/bash

set -e

#--------------------------------------------------
# Dummy check if the script is run from the root
if [ ! -d scripts ]; then
 printf '\e[31mPlease run this script from the root directory.\e[0m\n' >&2;
 exit 1;
fi

source ./scripts/helpers/logger.sh


#----------------------------------
# check if NODE_ENV is defined
if [ -z $NODE_ENV ]; then
  echoinfo "NODE_ENV not set. Rolling back to 'NODE_ENV=prod' !"
  NODE_ENV=prod
fi


#----------------------------------
# check if pm2 is installed
if ! hash pm2 2>/dev/null; then
  echoerr 'You need pm2 to run this script. Try "sudo yarn global add pm2"'
fi


#----------------------------------
# check if js-yaml is installed
if [ ! -f ./node_modules/.bin/js-yaml ]; then
  echoerr 'You need js-yaml to run this script. Did you run "yarn vcms:install" ?'
fi



#---------------------------------------------------
# get the .vcms.yml YAML file and convert to a json
JSON="$(./node_modules/.bin/js-yaml .vcms.yml)"


#---------------------------------------------------
# trying to resolve port (for polymer server proxy)
selector=".$NODE_ENV.port"
port="$(jq -r $selector <<< "$JSON")"

if [ $port = null ]; then
  port="$(jq -r '.port' <<< "$JSON")"

  if [ $port = null ]; then
    echoerr "port couldn't be resolved, verify the property is in '.vcms.yml' file."
  fi
fi



pm2 start --name %appname%:$port build/%appname%.js -- -p $port
