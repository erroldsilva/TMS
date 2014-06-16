#!/bin/bash 
host="${2}"
hostip=$(echo $host | cut -d '@' -f 2)
keyfile=$1
#ssh-keygen -R {"$hostip"}
#ssh-keygen -R {"$host"}
scp -i "$keyfile" BootStrap.sh "$host":~/
ssh -i "$keyfile" "$host" -t 'sh ~/BootStrap.sh'

