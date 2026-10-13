const http = require('http');

const server = http.createServer((req, res) => {
  // 1. 设置跨域头 (允许你的前端发请求过来)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. 处理浏览器的预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 3. 接收 POST 提交的数据
  if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // 把数据收集起来
    });
    req.on('end', () => {
      console.log('🔥 后端收到数据了：', body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: '后端已成功接收！', data: JSON.parse(body) }));
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 后端服务器已启动，监听端口 ${PORT}`);
});
