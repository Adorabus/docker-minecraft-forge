#!/bin/bash

if [ -f ".env" ]
  then
  while IFS= read -r line || [ -n "$line" ]; do
    export $line
  done < .env
fi

FORGE_URL="https://files.minecraftforge.net/net/minecraftforge/forge/"

# make it lowercase
export forge_version=$(echo $forge_version | tr '[:upper:]' '[:lower:]')

start_server () {
  echo Starting forge server...
  if ! java -Xms${Xms} -Xmx${Xmx} -Dlog4j.configurationFile=log4j2_112-116.xml -jar forge-$forge_version.jar -nogui;
    then
    echo "Error starting server: \"forge-$forge_version.jar\""
  fi
}

if [ -z $forge_version ]
  then
  echo Environment variable forge_version is required!
  echo "If you don't know the version, you can use \"latest\" or \"recommended\"."
elif [ $forge_version = latest ]
  then
  echo Finding latest version...
  export forge_version=$(curl -s $FORGE_URL | tr -d "\n" | sed -r 's/(.*Download Latest<br>\s+<small>)([^<]+)(.*)/\2/' | sed 's/ //g')
  echo Found latest version \"$forge_version\"
elif [ $forge_version = recommended ]
  then
  echo Finding recommended version...
  export forge_version=$(curl -s $FORGE_URL | tr -d "\n" | sed -r 's/(.*Download Recommended<br>\s+<small>)([^<]+)(.*)/\2/' | sed 's/ //g')
  echo Found recommended version \"$forge_version\"
fi

if [ -f "forge-$forge_version.jar" ]
  then
  start_server
else
  echo Forge "$forge_version" not found, downloading installer...
  curl -O https://maven.minecraftforge.net/net/minecraftforge/forge/$forge_version/forge-$forge_version-installer.jar
  if [ $? -eq 0 ]
    then
    echo Installing forge server $forge_version...
    java -jar forge-$forge_version-installer.jar --installServer
    start_server
  else
    echo "Failed to find installer for forge version \"$forge_version\"."
    exit
  fi
fi
