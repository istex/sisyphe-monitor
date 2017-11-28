#!/bin/bash

for i in */; do echo "zip file: ${i%/}.zip" && zip -rq "${i%/}.zip" "$i" && echo "success" || echo "failed"; done
