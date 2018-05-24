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


#----------------------------------
# check if NODE_ENV is defined
if [ -z $NODE_ENV ]; then
  echoinfo "NODE_ENV not set. Rolling back to 'NODE_ENV=dev' !"
  NODE_ENV=dev
fi

if ! hash tsc 2>/dev/null; then
  echoerr 'tsc is required to run this script.'
fi



#---------------------------------------------
# We should check if an instance of the server
# is not running already.
back_pid=$(get_backend_pid)
if [ ! -z $back_pid ]; then
  echoinfo 'A backend instance was found. Now killing this instance.'
  kill -15 $back_pid
  sleep 1
  echosuccess 'The backend instance was killed. Proceeding...'
fi


echoinfo '==================================';
echoinfo '= Compiling the code..           =';
echoinfo '==================================';
tsc
echosuccess 'done';

echoinfo '==================================';
echoinfo '= Running the application        =';
echoinfo '==================================';
NODE_ENV=$NODE_ENV node build/%appname% "$@"
echosuccess 'done';
