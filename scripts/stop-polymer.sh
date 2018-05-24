#!/bin/bash

set -e

#--------------------------------------------------
# Dummy check if the script is run from the root
if [ ! -d scripts ]; then
 printf '\e[31mPlease run this script from the root directory.\e[0m\n' >&2;
 exit 1;
fi


# functions we'll need
source ./scripts/helpers/logger.sh


#----------------------------------
# check if NODE_ENV is defined
if [ -z $NODE_ENV ]; then
  echoinfo "NODE_ENV not set. Rolling back to 'NODE_ENV=dev' !"
  NODE_ENV=dev
fi



#----------------------------------
# check if jq is installed
if ! hash jq 2>/dev/null; then
  echoerr 'You need jq to run this script'
fi

#----------------------------------
# check if js-yaml is installed
if [ ! -f ./node_modules/.bin/js-yaml ]; then
  echoerr 'You need js-yaml to run this script. Did you run "yarn install" ?'
fi


#---------------------------------------------------
# get the .vcms.yml YAML file and convert to a json
JSON="$(./node_modules/.bin/js-yaml .vcms.yml)"


echoinfo "moving in the polymer directory. Assume 'public' !"
cd public/

#-------------------------------------------------
# We should check if a Polymer application exists
if [ ! -f polymer.json ]; then
  echoerr 'no Polymer application found. Run `yarn polymer:attach` to install one.'
fi




#-------------------------------
# check if .polymer.port exists
if [ ! -f .polymer.port ]; then
  echoerr "'.polymer.port' doesn't exist. It means no polymer server is running right now. Try './scripts/run-polymer.sh'"
fi

#-------------------------
# get process information
port="$(cat .polymer.port)"
process_info="$(netstat -tupln 2>/dev/null | grep $port | awk '{print $NF}')"

# if no process was found
if [ -z "$process_info" ]; then
  printf "\e[31mNo process information was found. Just deleting '.polymer.port' and aborting.\e[0m\n"
  rm .polymer.port
  exit 0;
fi


process_name=${process_info##*/}
process_id=${process_info%%/*}

if [ "$process_name" != 'polymer' ]; then
  echoerr "The process listening on port $port is not a Polymer server. Aborting"
fi

#-------------------------------------
# We should kill the Polymer process
kill -15 $process_id

#-------------------------------------
# And removing the .polymer.port file
rm .polymer.port

printf "\e[32mThe Polymer server stopped successfully!\e[0m\n"
