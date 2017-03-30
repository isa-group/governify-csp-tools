FROM isagroup/minizinc

# Install nodejs
RUN apt-get install -y curl && curl -sL https://deb.nodesource.com/setup_6.x | bash
RUN apt-get install -y nodejs && apt-get clean

# CSP Tools
RUN mkdir governify-csp-tools
WORKDIR /tmp/governify-csp-tools
ADD . ./
RUN npm install
EXPOSE 10082 10045
CMD npm start