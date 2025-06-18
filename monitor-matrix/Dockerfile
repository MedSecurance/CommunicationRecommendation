FROM ubuntu:latest
WORKDIR /app
EXPOSE 33761

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