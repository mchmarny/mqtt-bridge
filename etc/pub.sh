#!/bin/bash

while [ true ]; do
  val=$(( $RANDOM ))
  ts=$(date +%s)
  msg="{ 't': ${ts}, 'm': 'temp', 'v': ${val} }"
  mosquitto_pub -t "data/num" -m $val
  mosquitto_pub -t "data/msg" -m "${msg}"
  echo $val
  echo $msg
  sleep 1
done
echo "DONE"



