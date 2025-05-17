const path = require('path');

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

  app._router.stack.forEach((middleware) => {
    if (middleware.route && middleware.route.methods.get) {
      console.log(`➡️  ${middleware.route.path}`);
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route && handler.route.methods.get) {
          console.log(`➡️  ${handler.route.path}`);
        }
      });
    }
  });
}

// EXPORT it properly
module.exports = listGetEndpoints;
