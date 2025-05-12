FROM debian:latest
WORKDIR /app
EXPOSE 8501


SHELL ["/bin/bash", "-c"] 

RUN apt update && apt install \
python3-virtualenv \
tcpdump -y

COPY . .

RUN virtualenv -p python3 ./env
RUN source ./env/bin/activate && pip3 install -r requirements.txt

RUN chmod +x ./start.bash
CMD ["./start.bash"]
