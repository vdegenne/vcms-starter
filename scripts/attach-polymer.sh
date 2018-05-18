#!/bin/bash

set -e

#--------------------------------------------------
# Dummy check if the script is run from the root
if [ ! -d scripts ]; then
 printf '\e[31mPlease run this script from the root directory.\e[0m\n' >&2;
 exit 1;
fi

source ./scripts/helpers/logger.sh


read -p "Polymer Application type (polymer-basic-starter): " apptype
read -p "Polymer Application Name (%appname%): " appname

# defaults
[ -z "$apptype" ] && apptype='polymer-basic-starter';
[ -z "$appname" ] && appname='%appname%';



echoinfo '===============================';
echoinfo '= fetching the starter        =';
echoinfo '===============================';
github-fetch-starter -n "$appname" $apptype
rsync -a "$appname/" public/
rm -rf "$appname"
echosuccess 'done';

echoinfo '==================================';
echoinfo '= Installing dependencies        =';
echoinfo '==================================';
cd public/
yarn install

printf "==> \e[32mthe polymer starter was moved in the 'public' directory\e[0m\n"
