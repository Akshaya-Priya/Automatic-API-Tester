const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Required in Node.js < 18, remove if using >=18

async function sendRequest(endpoint) {
  const method = "GET";
  const url = `http://localhost:3000${endpoint}`;
  const headers = {};
  const data = {};

  try {
    const response = await fetch(url, {
      method,
      headers,
    });

    const text = await response.text();
    const textContent = `➡️ [${method}] ${url}\nStatus: ${response.status}\n${text}\n`;
    console.log(textContent);
  } catch (error) {
    const textContent = `\n\n❌ Error for ${url}: ${error.message}\n`;
    console.log(textContent);
  }
}

async function testFromFile() {
  const filePath = path.resolve(__dirname, 'all-endpoints.json');

  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found.');
    process.exit(1);
  }

  let endpoints;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    endpoints = JSON.parse(raw);
  } catch (err) {
    console.error('❌ Failed to parse JSON:', err.message);
    return;
  }

  const getEndpoints = endpoints
    .filter(route => route.methods.includes('GET'))
    .map(route => route.path);

  for (const endpoint of getEndpoints) {
    console.log(`\n\n📡 Testing endpoint: ${endpoint}`);
    await sendRequest(endpoint);
    await new Promise(res => setTimeout(res, 500)); // Optional delay between requests
  }
}

// Export the functions
module.exports = {
  sendRequest,
  testFromFile
};


// const fs = require('fs');
// const path = require('path');

// async function sendRequest(endpoint) {
//   const method =  "GET";
//   const url = `http://localhost:3000${endpoint}`;
//   const headersInput = "";
//   const bodyInput = "";

//   let headers = {};
//   let data = {};

//   try {
//     headers = headersInput ? JSON.parse(headersInput) : {};
//   } catch (err) {
//     return alert("Invalid headers JSON");
//   }

//   try {
//     data = bodyInput ? JSON.parse(bodyInput) : {};
//   } catch (err) {
//     return alert("Invalid body JSON");
//   }

//   try {
//     const response = await fetch(url, {
//       method,
//       headers,
//       body: (method !== "GET" && method !== "DELETE") ? JSON.stringify(data) : undefined,
//     });

//     const text = await response.text();
//     const textContent = `➡️ [${method}] ${url}\nStatus: ${response.status}\n${text}\n`;
//     console.log(textContent);
//   } catch (error) {
//     const textContent = `\n\n❌ Error for ${url}: ${error.message}\n`;
//     console.log(textContent);
//   }
// }

// async function testFromFile() {
//     const filePath = path.resolve(__dirname, 'all-endpoints.'); // or just './get-endpoints.txt'
//     if (!fs.existsSync(filePath)) {
//     console.error('❌ File not found.');
//     process.exit(1);
//     }

//     //const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean); // Remove empty lines
//     const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);

//   for (const endpoint of lines) {
//     // document.getElementById("method").value = "GET";
//     // document.getElementById("url").value = `http://localhost:3000${endpoint}`;
//     // document.getElementById("headers").value = "";
//     // document.getElementById("body").value = "";
//     console.log(`\n\n📡 Testing endpoint: ${endpoint}`);
//     await sendRequest(endpoint);
//     await new Promise(res => setTimeout(res, 500)); // Optional delay between requests
//   }
// }

// // Export the functions
// module.exports = {
//   sendRequest,
//   testFromFile
// };