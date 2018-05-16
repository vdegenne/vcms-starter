#!/bin/bash

set -e

#--------------------------------------------------
# Dummy check if the script is run from the root
if [ ! -d scripts ]; then
 printf '\e[31mPlease run this script from the root directory.\e[0m\n' >&2;
 exit 1;
fi


# functions we'll need
source ./scripts/helpers/echoerr.sh
source ./scripts/helpers/get_backend_pid.sh


#----------------------------------
# check if NODE_ENV is defined
if [ -z $NODE_ENV ]; then
  echoerr "NODE_ENV can't be resolved"
fi

if ! hash tsc 2>/dev/null; then
  echoerr 'tsc is required to run this script.'
fi



#---------------------------------------------
# We should check if an instance of the server
# is not running already.
back_pid=$(get_backend_pid)
if [ ! -z $back_pid ]; then
  printf 'A backend instance was found. Now killing this instance.\n'
  kill -15 $back_pid
  sleep 1
  printf 'The backend instance was killed. Proceeding...\n'
fi

#-------------------------------------
# compiling to be sure to have the last
# version of the application.
printf 'Compiling the code...\n'
tsc

#----------------------------------------------
# Finally running a new instance of the server
printf 'Running the application...\n'
node build/%appname% "$@"
