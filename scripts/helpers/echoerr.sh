#!/bin/bash

echoerr () {
  printf "\e[31m%s\e[0m\n" "$*" >&2;
  exit 1;
}
