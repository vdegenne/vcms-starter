#!/bin/bash

# FUNCTIONS
echoerr () {
  printf "\e[31m%s\e[0m\n" "$*" >&2;
  exit 1;
}


#--------------------------------------------------
# Dummy check if the script is run from the root
[ ! -d scripts ] && echoerr 'Please run this script from the root directory.';


#--------------------------------------------------
# We should check if the back-end server is running
back_processes="$(ps aux | grep -E 'node build/[^ ]*' | head -n -1)"

[ -z "$back_processes" ] && echoerr 'No running back-end server was found. Did you try to run `yarn run:dev` first ?'

backPidFound=false
while read back_proc
do
  path=$(grep -E 'node build/[^ ]*' -o <<< "$back_proc" | awk '{print $2}')
  if [ -f "$PWD/$path.js" ]; then
    backPidFound=true
    back_pid=$(awk '{print $2}' <<< "$back_proc")
    break
  fi
done <<< "$back_processes"

[ ! $backPidFound ] && echoerr 'No running back-end server was found. Did you try to run `yarn run:dev` first ?'



#------------------------------------------------------------
# We should get the port of the back-end server as it exists
back_port=$(netstat -tulpn 2>/dev/null | grep $back_pid | grep -E ':::[0-9]+' -o | awk '{print substr($0, 4)}')

[ -z "$back_port" ] && echoerr "Couldn't find a port for the back server.";



#----------------------------------
# check if NODE_ENV is defined
if [ -z $NODE_ENV ]; then
  echo 'NODE_ENV is undefined. Using "dev" value'
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
selector=".$NODE_ENV.\"public-directory\""
publicDir="$(jq -r $selector <<< "$JSON")"

if [ "$publicDir" = 'null' ]; then
  publicDir="$(jq -r '."public-directory"' <<< "$JSON")"

  if [ "$publicDir" = 'null' ]; then
    publicDir='public'
  fi
fi



# moving in the polymer directory
cd "$publicDir"


#----------------------------------------------------------------------
# If .polymer.port is existing, it means an instance is already running
# We should abort
if [ -f .polymer.port ]; then
  echoerr ".polymer.port' was found. call './scripts/stop-polymer.sh' before calling this script again."
fi


#---------------------------------------------------
# running polymer serve
printf "Running \"\e[33mpolymer serve --hostname \"$localhostname\" --proxy-path \"/api\" --proxy-target \"$localhostname:$back_port/api\"\e[0m\"\n"
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
# save port in a temporary file so we can call 'yarn stop-polymer'
echo "$port" > .polymer.port


#---------------------------------------------------
# remove .polymer-serve.output
rm .polymer-serve.output


printf "\e[32mListening on http://$localhostname:$port/\e[0m\n";
