FROM ubuntu:latest
WORKDIR /app
EXPOSE 33761

ARG MEDSEC_URL
ENV MEDSEC_URL=$MEDSEC_URL
ARG ADMIN_EMAIL
ENV ADMIN_EMAIL=$ADMIN_EMAIL
ARG UPDATE_DELAY_MINUTES
ENV UPDATE_DELAY_MINUTES=$UPDATE_DELAY_MINUTES
ARG EMAIL_DELAY_DAYS
ENV EMAIL_DELAY_DAYS=$EMAIL_DELAY_DAYS

SHELL ["/bin/bash", "-c"] 

RUN apt update && apt install libpcap0.8 \
    sudo \
    tcpdump \
    libpcap0.8-dev \
    python3-virtualenv -y

COPY . .

RUN virtualenv -p python3 ./env
RUN source ./env/bin/activate && pip3 install -r requirements.txt

RUN chmod +x ./ui/start.bash
CMD ["./ui/start.bash"]