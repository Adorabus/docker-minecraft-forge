FROM openjdk:8-alpine
ENV forge_version=recommended
ENV Xms=6G
ENV Xmx=6G
RUN mkdir /mc
WORKDIR /mc
RUN apk add --update bash curl
COPY eula.txt .
COPY forge.sh .
RUN dos2unix forge.sh
RUN chmod +x ./forge.sh
CMD [ "./forge.sh" ]
