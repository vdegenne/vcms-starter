#!/bin/bash

set -e

read -p "Polymer Application type (polymer-basic-starter): " apptype
read -p "Polymer Application Name (%appname%): " appname

# defaults
[ -z "$apptype" ] && apptype='polymer-basic-starter';
[ -z "$appname" ] && appname='%appname%';

github-fetch-starter -n "$appname" $apptype
rsync -a "$appname/" public/
rm -rf "$appname"

printf "==> \e[32mthe polymer starter was moved in the 'public' directory\e[0m\n"
