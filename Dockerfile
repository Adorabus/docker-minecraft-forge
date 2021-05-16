FROM openjdk:8
ENV forge_version=recommended
ENV Xms=6G
ENV Xmx=6G
RUN mkdir /mc
WORKDIR /mc
COPY eula.txt .
COPY forge.sh .
CMD [ "./forge.sh" ]
