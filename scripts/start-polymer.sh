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
source ./scripts/helpers/get_backend_pid.sh
source ./scripts/helpers/get_backend_port.sh


#----------------------------------
# check if NODE_ENV is defined
if [ -z $NODE_ENV ]; then
  echoinfo "NODE_ENV not set. Rolling back to 'NODE_ENV=dev' !"
  NODE_ENV=dev
fi



#--------------------------------------------------
# We should check if the back-end server is running
back_pid=$(get_backend_pid)
[ -z $back_pid ] && echoerr 'No running back-end server was found. Did you try to run `yarn backend:start` or `yarn backend:watch` first ?';



#------------------------------------------------------------
# We should get the port of the back-end server as it exists
back_port=$(get_backend_port $back_pid)
[ -z $back_port ] && echoerr "Couldn't find a port for the back server.";



#----------------------------------
# check if jq is installed
if ! hash jq 2>/dev/null; then
  echoerr 'You need jq to run this script'
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
# trying to resolve localhostname (for polymer serve proxy)
selector=".$NODE_ENV.\"local-hostname\""
localhostname="$(jq -r $selector <<< "$JSON")"

if [ $localhostname = 'null' ]; then
  localhostname="$(jq -r '."local-hostname"' <<< "$JSON")"

  if [ $localhostname = 'null' ]; then
    echoerr "local hostname couldn't be resolved, verify the property is in '.vcms.yml' file."
  fi
fi

#---------------------------------------------------
# trying to resolve port (for polymer serve proxy)
selector=".$NODE_ENV.port"
port="$(jq -r $selector <<< "$JSON")"

if [ $port = 'null' ]; then
  port="$(jq -r '.port' <<< "$JSON")"

  if [ $port = 'null' ]; then
    echoerr "local port couldn't be resolved, verify the property is in '.vcms.yml' file."
  fi
fi


#---------------------------------------------------
# trying to resolve public directory (for polymer serve proxy)
# selector=".$NODE_ENV.\"public-directory\""
# publicDir="$(jq -r $selector <<< "$JSON")"

# if [ "$publicDir" = 'null' ]; then
#   publicDir="$(jq -r '."public-directory"' <<< "$JSON")"

#   if [ "$publicDir" = 'null' ]; then
#     publicDir='public'
#   fi
# fi



echoinfo "moving in the polymer directory. Assume 'public' !"
cd public/


#-------------------------------------------------
# We should check if a Polymer application exists
if [ ! -f polymer.json ]; then
  echoerr 'no Polymer application found. Run `yarn polymer:attach` to install one.'
fi


#----------------------------------------------------------------------
# If .polymer.port is existing, it means an instance is already running
# We should abort
if [ -f .polymer.port ]; then
  echoerr ".polymer.port' was found. run 'yarn polymer:stop' before calling this script again."
fi



echoinfo '==================================';
echoinfo '= Running "polymer serve"..      =';
echoinfo '==================================';
printf "Invoking \"\e[33mpolymer serve --hostname \"$localhostname\" --proxy-path \"/api\" --proxy-target \"$localhostname:$back_port/api\"\e[0m\"\n"
polymer serve --hostname "$localhostname" --proxy-path "/api" --proxy-target "http://$localhostname:$back_port/api" >> .polymer-serve.output &


#---------------------------------------------------
# waiting for the polymer serve to output
while [ -z "$(cat .polymer-serve.output 2>/dev/null)" ]
do
  sleep 1
done

#---------------------------------------------------
# getting the listening port from the output
port="$(cat .polymer-serve.output | grep -E ':[0-9]+' -o | head -n 1 | awk '{print substr($0, 2)}')"

#---------------------------------------------------
# save port in a temporary file so we can call 'yarn polymer:stop'
echo "$port" > .polymer.port


#---------------------------------------------------
# remove .polymer-serve.output
rm .polymer-serve.output

starting_url="http://$localhostname:$port/";
echosuccess "Listening on $starting_url";

# if hash google-chrome; then
#   printf 'Opening in Chrome\n'
#   google-chrome "$starting_url"
# fi

