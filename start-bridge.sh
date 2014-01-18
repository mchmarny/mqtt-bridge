#!/bin/bash

export LOGS_FILE="*.log"
echo "log: ${LOGS_FILE}" 
if [ -f $LOGS_FILE ]; then
	echo "   clearing log..." 
   rm $LOGS_FILE
fi

echo "checking for forever..." 
if [[ -n $(npm list -g -parseable forever) ]]
then
   echo "   ok"
else
   sudo npm install forever -g
fi

export BASE_DIR="${PWD}"
forever start -m 1 \
             -a -l "${BASE_DIR}/bridge-forever.log" \
             --sourceDir $BASE_DIR \
             --minUptime 1s \
             --spinSleepTime 3s bridge.js

