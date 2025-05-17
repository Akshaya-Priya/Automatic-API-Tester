const path = require('path');
const fs = require('fs'); //for file handling
const { testFromFile, sendRequest } = require('./testEndpoints');

function listGetEndpoints(serverFilePath) {
  const absolutePath = path.resolve(process.cwd(), serverFilePath);

  let app;
  try {
    // Load the Express app from the given file
    app = require(absolutePath);
  } catch (err) {
    console.error(`❌ Failed to load server: ${err.message}`);
    return;
  }

  if (!app._router || !app._router.stack) {
    console.error('❌ No routes found. Make sure the app exports an Express instance.');
    return;
  }

  console.log(`🔍 GET endpoints in "${serverFilePath}":`);
  const output=[];

  app._router.stack.forEach((middleware) => {
    if (middleware.route && middleware.route.methods.get) {
      const route = middleware.route.path;
      console.log(`➡️  ${route}`);
      output.push(route);
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route && handler.route.methods.get) {
          const route = handler.route.path;
          console.log(`➡️  ${route}`);
          output.push(route);
        }
      });
    }
  });

  // Write to a file
  const outputFile = path.join(process.cwd(), 'get-endpoints.txt');
  fs.writeFileSync(outputFile, output.join('\n'), 'utf-8');
  console.log(`📝 GET endpoints saved to ${outputFile}`);
  testFromFile();
}

// EXPORT it properly
module.exports = listGetEndpoints;
