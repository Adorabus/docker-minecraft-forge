FROM alpine:latest

ENV forge_version=recommended
ENV Xms=6G
ENV Xmx=6G
ENV cliww_limit=200

RUN apk add --update nodejs npm bash curl openjdk21-jre

WORKDIR /usr/local/bin
COPY forge.sh ./forge
RUN dos2unix ./forge
RUN chmod +x ./forge


COPY cliww /opt/cliww
WORKDIR /opt/cliww
RUN npm install
RUN npm link

RUN mkdir /mc
WORKDIR /mc
COPY eula.txt .

CMD [ "forge" ]
