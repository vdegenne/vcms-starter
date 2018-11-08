#!/bin/bash


function get_backend_port () {
  [ -z $1 ] && {
    return;
  }

  back_port=$(netstat -tulpn 2>/dev/null | grep $1 | grep -E ':::[0-9]+' -o | awk '{print substr($0, 4)}');

  printf "$back_port"
  return 0;
}
