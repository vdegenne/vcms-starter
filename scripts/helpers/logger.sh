#!/bin/bash

echoerr () {
  printf "\e[31m%s\e[0m\n" "$*" >&2;
  exit 1;
}

echoinfo () {
  printf "\e[33m%s\e[0m\n" "$*";
}

echosuccess () {
  printf "\e[32m%s\e[0m\n" "$*";
  return 0;
}
