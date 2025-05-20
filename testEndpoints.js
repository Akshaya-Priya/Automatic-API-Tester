const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Remove if Node >= 18
const { spawn } = require('child_process');

async function sendRequest(endpoint) {
  const method = "GET";
  const url = `http://localhost:3000${endpoint}`;
  const headers = {};

  const start = Date.now();

  try {
    const response = await fetch(url, {
      method,
      headers,
    });

    const text = await response.text();
    const textContent = `➡️ [${method}] ${url}\nStatus: ${response.status}\n${text}\n`;
    console.log(textContent);

    const duration = Date.now() - start;

    if (duration < 2000) {
      await new Promise(res => setTimeout(res, 2000 - duration));
    }
  } catch (error) {
    console.log(`\n\nError for ${url}: ${error.message}\n`);
  }
}

async function testFromFile() {
  const filePath = path.resolve(__dirname, 'all-endpoints.json');

  if (!fs.existsSync(filePath)) {
    console.error('File not found.');
    process.exit(1);
  }

  let endpoints;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    endpoints = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse JSON:', err.message);
    return;
  }

  const getEndpoints = endpoints
    .filter(route => route.methods.includes('GET') && !route.path.includes(':'))
    .map(route => route.path);

  for (const endpoint of getEndpoints) {
    console.log(`\n\n Testing endpoint: ${endpoint}`);
    await sendRequest(endpoint);
    await new Promise(res => setTimeout(res, 500)); // Optional delay between requests
  }

  console.log('\n All GET endpoints tested.');

  await startReactDashboard();  // Wait for React dashboard to finish

  console.log('React dashboard closed. Continuing with the rest of the program...');
}

function startReactDashboard() {
  return new Promise((resolve, reject) => {
    const reactAppPath = path.resolve(__dirname, './api-test-canvas'); // Adjust as needed

    const reactProcess = spawn('npm', ['run', 'dev'], {
      cwd: reactAppPath,
      shell: true,
      stdio: 'inherit'
    });

    reactProcess.on('spawn', () => {
      console.log('\n React dashboard is launching...');
      console.log(' Visit your dashboard at: http://localhost:3000\n');
    });

    reactProcess.on('error', (err) => {
      console.error(' Failed to start React dashboard:', err.message);
      reject(err);
    });

    reactProcess.on('close', (code, signal) => {
      console.log(`\n React dashboard process exited with code ${code}${signal ? ` and signal ${signal}` : ''}.`);
      resolve();
    });
  });
}

// Execute only if run directly
if (require.main === module) {
  (async () => {
    await testFromFile();
  })();
}

module.exports = {
  sendRequest,
  testFromFile,
  startReactDashboard
};



// const fs = require('fs');
// const path = require('path');
// const fetch = require('node-fetch'); // Required in Node.js < 18, remove if using >=18
// const { spawn } = require('child_process');

// async function sendRequest(endpoint) {
//   const method = "GET";
//   const url = `http://localhost:3000${endpoint}`;
//   const headers = {};
//   const data = {};
//   const start = Date.now(); // Start timer

//   try {
//     const response = await fetch(url, {
//       method,
//       headers,
//     });

//     const text = await response.text();
//     const textContent = `➡️ [${method}] ${url}\nStatus: ${response.status}\n${text}\n`;
//     console.log(textContent);
    
//     const duration = Date.now() - start;

//     // Wait remaining time if request took less than 5s
//     if (duration < 2000) {
//       await new Promise(res => setTimeout(res, 2000 - duration));
//     }
//   } catch (error) {
//     const textContent = `\n\n❌ Error for ${url}: ${error.message}\n`;
//     console.log(textContent);
//   }
// }

// async function testFromFile() {
//   const filePath = path.resolve(__dirname, 'all-endpoints.json');

//   if (!fs.existsSync(filePath)) {
//     console.error('❌ File not found.');
//     process.exit(1);
//   }

//   let endpoints;
//   try {
//     const raw = fs.readFileSync(filePath, 'utf-8');
//     endpoints = JSON.parse(raw);
//   } catch (err) {
//     console.error('❌ Failed to parse JSON:', err.message);
//     return;
//   }

//   const getEndpoints = endpoints
//     .filter(route => route.methods.includes('GET'))
//     .map(route => route.path);

//   for (const endpoint of getEndpoints) {
//     console.log(`\n\n📡 Testing endpoint: ${endpoint}`);
//     await sendRequest(endpoint);
//     await new Promise(res => setTimeout(res, 500)); // Optional delay between requests
//   }
//   console.log('\n✅ All endpoints tested. Launching dashboard...');

//   startReactDashboard();
// }

// function startReactDashboard() {
//   const reactAppPath = path.resolve(__dirname, './api-test-canvas'); // Adjust this path to your actual React app directory

//   const reactProcess = spawn('npm', ['run', 'dev'], {
//     cwd: reactAppPath,
//     shell: true,
//     stdio: 'inherit'
//   });

//   reactProcess.on('spawn', () => {
//     console.log('\n🚀 React dashboard is launching...');
//     console.log('🔗 Visit your dashboard at: http://localhost:3000\n');
//   });

//   reactProcess.on('error', (err) => {
//     console.error('❌ Failed to start React dashboard:', err.message);
//   });
// }

// // Execute only if run directly
// if (require.main === module) {
//   testFromFile();
// }

// // Export the functions
// module.exports = {
//   sendRequest,
//   testFromFile
// };


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