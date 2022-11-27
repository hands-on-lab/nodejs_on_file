#!/bin/bash

npm install &> /dev/null
rm -rf build
echo -ne "Typescript Build..\r" 
npm run build &> /dev/null
echo -e "Typescript Build.. OK"
echo -ne "Uploading file..\r" 
scp -r build __scripts__ package.json swagger.yaml ibmuser@sandbox-wazi.techgym:/web/nodejs_example_on_file
echo -e "Uploading file.. OK"