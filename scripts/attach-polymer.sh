#!/bin/bash

set -e

read -p "Polymer Application type (polymer-basic-starter): " apptype
read -p "Polymer Application Name (polymer-basic-starter): " appname

# defaults
[ -z "$apptype" ] && apptype='polymer-basic-starter';
[ -z "$appname" ] && appname='polymer-basic-starter';

github-fetch-starter -n "%appname%" $apptype
mv "$appname" 'public'
