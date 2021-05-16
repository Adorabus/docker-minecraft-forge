### Environment Variables
`forge_version` Which version of forge server to use. Possible values are `latest`, `recommended`, or a version number. (ex. 1.16.5-36.1.18)

`Xms` Initial JVM memory allocation. (default: 6G)

`Xmx` Maximum Java memory allocation. (default: 6G)

### Bind Mounts
Mount anything you want into the `/mc` folder. (ex. server.properties, mods, world, config, etc.)

## docker-compose
```yml
version: "3.8"

services:
  mc:
    image: adorabus/minecraft-forge
    ports:
      - 25565:25565
      # - 25575:25575 # RCON
    volumes:
      - ./server.properties:/mc/server.properties
      - ./world:/mc/world
      - ./mods:/mc/mods
      - ./config:/mc/config
    environment:
      forge_version: latest
      Xms: 6G
      Xmx: 6G
```
