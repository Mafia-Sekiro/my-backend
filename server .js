const http = require('http');
const fs = require('fs'); // 1. 引入文件系统模块

// 读取数据文件，如果没有就返回空数组
function readData() {
  try {
    const data = fs.readFileSync('./messages.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return []; // 文件不存在就返回空数组
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  // 新增：获取所有留言的接口
  if (req.method === 'GET' && req.url === '/messages') {
    let messages = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(messages));
    return;
  }

  // 提交数据的接口
  if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      let newData = JSON.parse(body);
      let messages = readData();
      
      // 把新数据放进去
      messages.unshift(newData); 
      
      // 写入文件！
      fs.writeFileSync('./messages.json', JSON.stringify(messages));
      
      console.log('🔥 数据已存入文件！', newData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: '后端已存入库！', data: newData }));
    });
    return;
  }

  res.writeHead(404); res.end('Not Found');
});

server.listen(3000, () => { console.log('🚀 服务器已启动，数据持久化开启'); });
