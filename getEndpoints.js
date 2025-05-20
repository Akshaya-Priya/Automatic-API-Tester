// const path = require('path');
// const fs = require('fs').promises; //for file handling
// const { testFromFile } = require('./testEndpoints');

// async function listGetEndpoints(app, serverFilePath) {
// //   const absolutePath = path.resolve(process.cwd(), serverFilePath);

// //   let app;
// //   try {
// //     // Load the Express app from the given file
// //     app = require(absolutePath);
// //   } catch (err) {
// //     console.error(`❌ Failed to load server: ${err.message}`);
// //     return;
// //   }

//   if (!app._router || !app._router.stack) {
//     console.error('❌ No routes found. Make sure the app exports an Express instance.');
//     return;
//   }

//   console.log(`🔍 GET endpoints in "${serverFilePath}":`);
//   const output=[];

//   app._router.stack.forEach((middleware) => {
//     if (middleware.route && middleware.route.methods.get) {
//       const route = middleware.route.path;
//       console.log(`➡️  ${route}`);
//       output.push(route);
//     } else if (middleware.name === 'router' && middleware.handle.stack) {
//       middleware.handle.stack.forEach((handler) => {
//         if (handler.route && handler.route.methods.get) {
//           const route = handler.route.path;
//           console.log(`➡️  ${route}`);
//           output.push(route);
//         }
//       });
//     }
//   });

const path = require('path');
const fs = require('fs').promises;
const { testFromFile } = require('./testEndpoints');

async function listAllEndpoints(app, serverFilePath) {
  if (!app._router || !app._router.stack) {
    console.error('No routes found. Make sure the app exports an Express instance.');
    return;
  }

  const extractRoutes = (stack, prefix = '') => {
    const routes = [];

    for (const layer of stack) {
      if (layer.route) {
        const fullPath = pathJoin(prefix , layer.route.path);
        const methods = Object.keys(layer.route.methods).map((m) => m.toUpperCase());
        routes.push({ path: fullPath, methods });
      } else if (layer.name === 'router' && layer.handle.stack) {
        const routePrefix = layer.regexp.source
          .replace('^\\', '/')
          .replace('\\/?(?=\\/|$)', '')
          .replace(/\\\//g, '/')
          .replace(/\$$/, '');
        const nestedPrefix = pathJoin(prefix , routePrefix);
        routes.push(...extractRoutes(layer.handle.stack, nestedPrefix));
      }
    }
    return routes;
  };

  const routes = extractRoutes(app._router.stack);

  console.log(` HTTP endpoints in "${serverFilePath}":`);
  routes.forEach((r) => {
    console.log(` ${r.methods.join(', ')} ${r.path}`);
  });

  const outputFile = path.join(process.cwd(), 'all-endpoints.json');

  try {
    await fs.writeFile(outputFile, JSON.stringify(routes, null, 2), 'utf-8');
    console.log(`All endpoints saved to ${outputFile}`);
  } catch (err) {
    console.error(`Failed to write file: ${err.message}`);
    return;
  }

  if (typeof testFromFile === 'function') {
    await testFromFile();
  }
}

// Utility function to safely join URL paths
function pathJoin(...parts) {
  return parts
    .map(part => part.replace(/(^\/+|\/+$)/g, '')) // remove leading/trailing slashes
    .filter(Boolean) // remove empty strings
    .join('/')
    .replace(/^/, '/'); // ensure leading slash
}

module.exports = listAllEndpoints;
