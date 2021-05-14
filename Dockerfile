FROM openjdk:8
ARG forge_version=1.16.5-36.1.18
ENV forge_version=${forge_version}
ENV Xms=6G
ENV Xmx=6G
RUN mkdir /mc
WORKDIR /mc
# COPY forge-$forge_version-installer.jar . # local
ADD https://maven.minecraftforge.net/net/minecraftforge/forge/$forge_version/forge-$forge_version-installer.jar .
RUN java -jar forge-$forge_version-installer.jar --installServer
COPY eula.txt .
CMD java -Xms${Xms} -Xmx${Xmx} -jar forge-$forge_version.jar -nogui