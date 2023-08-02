FROM openjdk:19-jdk-alpine

ENV forge_version=recommended
ENV Xms=6G
ENV Xmx=6G

RUN apk add --update bash curl

WORKDIR /usr/local/bin
COPY forge.sh ./forge
RUN dos2unix ./forge
RUN chmod +x ./forge

RUN mkdir /mc
WORKDIR /mc
COPY eula.txt .

CMD [ "forge" ]
