#!/bin/bash

set -e

#--------------------------------------------------
# Dummy check if the script is run from the root
if [ ! -d scripts ]; then
 printf '\e[31mPlease run this script from the root directory.\e[0m\n' >&2;
 exit 1;
fi


#----------------------------------
# check if pm2 is installed
if [ ! -f pm2 ]; then
  echoerr 'You need pm2 to run this script. Try "sudo yarn global add pm2"'
fi

pm2 start --name %appname% build/%appname%.js
