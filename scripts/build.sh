#!/bin/bash

set -e

#--------------------------------------------------
# Dummy check if the script is run from the root
if [ ! -d scripts ]; then
 printf '\e[31mPlease run this script from the root directory.\e[0m\n' >&2;
 exit 1;
fi

source ./scripts/helpers/logger.sh


if [ ! -d node_modules ]; then
  echoerr 'node_modules was not found. Did you run `yarn vcms:install` first ?'
fi


echoinfo '==================================';
echoinfo '= Build Backend                  =';
echoinfo '==================================';
yarn build
echosuccess 'done';

# build polymer if a Polymer application was found
if [ -d public ]; then
  cd public/
  if [ -f polymer.json ]; then
    echoinfo '==================================';
    echoinfo '= Build Polymer                  =';
    echoinfo '==================================';
    if [ ! -d node_modules ]; then
      echoerr 'node_modules was not found. Did you run `yarn vcms:install` first ?'
    fi
    polymer build
    echosuccess 'done';
  fi
fi

