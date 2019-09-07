# UBC UAS Dockerfile - API Backend

# Pull the Python base image
FROM python:3.7

# Add dependencies
RUN apt-get -qq update && apt-get -qq install -y \
        libxml2-dev \
        libxslt-dev \
        libboost-python-dev \
        libexiv2-dev \
        python3 \
        python3-dev \
        python3-nose \
        python3-pip \
        python3-pyproj \
        python3-lxml \
        sudo

# Get exiv2 0.26 and build py3exiv2 from source for WEBP support
RUN mkdir -p /tmp
WORKDIR /tmp
RUN bash -c "echo 'deb http://ftp.debian.org/debian experimental main contrib non-free' >> /etc/apt/sources.list.d/experimental.list"
RUN apt-get update && apt-get -t experimental install -y libexiv2-26 libexiv2-dev exiv2
RUN git clone https://github.com/mcmclx/py3exiv2.git
WORKDIR /tmp/py3exiv2
RUN python3 configure.py && ./build.sh && ./build.sh -i
RUN rm -rf /tmp

# Create our working DIR
RUN mkdir -p /uas/gcomv2/api
WORKDIR /uas/gcomv2/api

# Install Python Dependencies
COPY requirements.txt ./
RUN pip3 install -U -r requirements.txt

# Expose GCOM_v2 server
ENV PYTHONUNBUFFERED=1
EXPOSE 8080
STOPSIGNAL SIGINT
