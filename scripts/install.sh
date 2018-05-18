#!/bin/bash

set -e

#--------------------------------------------------
# Dummy check if the script is run from the root
if [ ! -d scripts ]; then
 printf '\e[31mPlease run this script from the root directory.\e[0m\n' >&2;
 exit 1;
fi

# make all the scripts executables
chmod +x ./scripts/*

source ./scripts/helpers/logger.sh

echoinfo '==================================';
echoinfo '= Install dependencies           =';
echoinfo '==================================';
yarn install
echosuccess 'done';

# Install Polymer dependencies if there is a polymer application
if [ -d public ]; then
  cd public/
  if [ -f polymer.json ]; then
    echoinfo '==================================';
    echoinfo '= Install Polymer Dependencies   =';
    echoinfo '==================================';
    yarn install
    echosuccess 'done';
  fi
fi
