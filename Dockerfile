FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
EXPOSE 8100
CMD ["node", "-e", "require('http').createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end('<h1>Ionic CRUD App Running</h1>');}).listen(8100,'0.0.0.0')"]
