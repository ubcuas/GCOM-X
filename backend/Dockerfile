# UBC UAS Dockerfile - API Backend

# Pull the Python base image
FROM python:3.7.4-buster

# Add dependencies
RUN apt-get -qq update && apt-get install -y \
        cmake \
        libboost-python-dev \
        libwebp-dev \
        libxml2-dev \
        libxslt-dev \
        python3-dev \
        python3-pip \
        sudo

# Make dir for manual deps
RUN mkdir -p /tmp

# Build version 0.26 of libexiv2 for WEBP support
WORKDIR /tmp
RUN wget https://www.exiv2.org/releases/exiv2-0.26-trunk.tar.gz \
        && tar -xvf exiv2-0.26-trunk.tar.gz
WORKDIR /tmp/exiv2-trunk
RUN mkdir build && cd build \
        && sed -i '/GCC_MINOR/d' ../CMakeLists.txt \
        && cmake .. -DCMAKE_BUILD_TYPE=Release \
        && cmake --build . -- -j2 \
        && sudo make install \
        && sudo ldconfig

# Build py3exiv2 from source for WEBP support
WORKDIR /tmp
RUN git clone https://github.com/mcmclx/py3exiv2.git
WORKDIR /tmp/py3exiv2
RUN python3 configure.py && ./build.sh && ./build.sh -i

# Cleanup
RUN rm -rf /tmp

# Create our working DIR
RUN mkdir -p /uas/gcomv2/api
WORKDIR /uas/gcomv2/api

# Install Python Dependencies
COPY requirements.txt ./
RUN pip3 install -U -r requirements.txt

# Expose GCOM server
ENV PYTHONUNBUFFERED=1
EXPOSE 8080
STOPSIGNAL SIGINT
