#!/bin/bash


function get_backend_pid () {

  back_processes="$(ps aux | grep -E 'node build/[^ ]*' | head -n -1)"

  while read back_proc
  do
    path=$(grep -E 'node build/[^ ]*' -o <<< "$back_proc" | awk '{print $2}')
    if [ -f "$PWD/$path.js" ]; then
      back_pid=$(awk '{print $2}' <<< "$back_proc")
      break
    fi
  done <<< "$back_processes"

  echo $back_pid;
  return 0;
}
