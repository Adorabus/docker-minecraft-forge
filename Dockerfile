FROM openjdk:8-alpine
ENV forge_version=recommended
ENV Xms=6G
ENV Xmx=6G
ENV cliww_limit=200
ENV Xmx=6G
RUN mkdir /mc
WORKDIR /mc
COPY cliww .
WORKDIR /mc/cliww
RUN apk add --update nodejs npm bash curl
RUN npm install
RUN npm link
WORKDIR /mc
COPY eula.txt .
COPY forge.sh .
RUN dos2unix forge.sh
RUN chmod +x ./forge.sh
CMD [ "./forge.sh" ]
