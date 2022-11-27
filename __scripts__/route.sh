#!/bin/bash
LOC=`dirname $BASH_SOURCE`
ROUTE=$(oc get route 2>/dev/null | grep 1339 | awk '{ print $2 }')

if [[ -n $ROUTE ]]; then
    sed -i "s/https:\/\/route.*/https:\/\/${ROUTE}\/api/" $LOC/../swagger.yaml
    sed -i "s/\${REPLACE_ME}/${ROUTE}/" $LOC/../swagger.yaml
    else
    echo "Route doesn't exist"
fi