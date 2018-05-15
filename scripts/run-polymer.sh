#!/bin/bash

# FUNCTIONS
echoerr () {
  printf "%s\n" "$*" >&2;
  exit 1;
}


#----------------------------------
# check if NODE_ENV is defined
if [ -z $NODE_ENV ]; then
  echoerr 'NODE_ENV is undefined'
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


echo polymer serve --root "/$publicDir" --hostname $localhostname --proxy-path "/api" --proxy-target "$localhostname:$port/api"
