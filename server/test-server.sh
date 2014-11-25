#!/bin/bash
curl -X POST -H "Content-Type:application/json" --data "$1" "$2" && echo
