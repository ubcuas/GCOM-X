# UBC UAS Dockerfile - API Backend

# Pull the Python base image
FROM ubcuas/pyuuas:latest

# Add dependencies
RUN apt-get -qq update && apt-get install -y \
        cmake \
        libboost-python-dev \
        libgdal-dev \
        libwebp-dev \
        libxml2-dev \
        libxslt-dev \
        python3-dev \
        python3-pip \
        sudo

# Make dir for manual deps
RUN mkdir -p /tmp

# Create our working DIR
RUN mkdir -p /uas/gcomx/api
WORKDIR /uas/gcomx/api

# Install Python Dependencies
COPY requirements.txt ./
RUN pip3 install -U -r requirements.txt

# Expose GCOM server
ENV PYTHONUNBUFFERED=1
EXPOSE 8080
STOPSIGNAL SIGINT

# Run server
# NOTE: 0.0.0.0 must be specified below and will map to localhost. Does not work otherwise.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]
