#!/usr/bin/env node

const path = require('path');
const readline = require('readline');
const listGetEndpoints = require('./getEndpoints.js'); // assuming you saved the function

//for sequencial excecution
async function main(){

    // Get the server file path from CLI
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Please provide the path to your server file, e.g. `run-server server.js`');
        process.exit(1);
    }

    const inputPath = args[0];
    const serverPath = path.isAbsolute(inputPath)? inputPath: path.resolve(process.cwd(), inputPath);

    let serverInstance=null;
    try {
        const server = require(serverPath);

        // Check if it's an Express app (has .listen function)
        if (server && typeof server.listen === 'function') {
            serverInstance = server.listen(3000, async () => {
                console.log(`Server started from: ${serverPath} on http://localhost:3000 `);
                
                //  Call endpoint listing AFTER server has started
                try {
                    await listGetEndpoints(server, serverPath); // Ensure this function is async
                } catch (err) {
                    console.error("Error listing endpoints:", err.message);
                }

                //  Prompt after everything is done
                promptExit(serverInstance);
            });
        } else {
            console.warn(` The required module didn't export an Express app with a .listen method.`);
            
            console.error(`Could not retrieve Express app from the module.\n`);
            console.log(` To make this tool work properly, ensure your server file contains the following:\n`);

            console.log(` Export the Express app instance:
                ----------------------------------------------------
                const express = require('express');
                const app = express();

                // your routes here

                module.exports = app; // 👈 This line is important
                ----------------------------------------------------\n`);

            console.log(`✅ Or, if your app uses app.listen(...), export the server instance:
                ----------------------------------------------------
                const express = require('express');
                const app = express();

                // your routes here

                if (require.main === module) {
                    const server = app.listen(3000, () => {
                    console.log("Server running on port 3000");
                    });
                }
                module.exports = server; // 👈 This line is important
                ----------------------------------------------------\n`);
                
            process.kill(process.pid, 'SIGINT');
        }
    } catch (error) {
        console.error(`Failed to load server file: ${error.message}`);
        process.exit(1);
    }
}

function promptExit(serverInstance = null) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Do you want to terminate the running server? (y/n): ", (answer) => {
        if (answer.toLowerCase() === 'y') {
            if (serverInstance && typeof serverInstance.close === 'function') {
                serverInstance.close(() => {
                    console.log("Server terminated successfully.");
                    rl.close();
                    process.exit(0);
                });
            } else {
                console.log("Sending SIGINT to terminate...");
                rl.close();
                process.kill(process.pid, 'SIGINT'); // or 'SIGTERM'
            }
        } else {
            console.log("Server will continue running. You can stop it manually with Ctrl+C.");
            rl.close();
        }
    });
}

main();




// // Setup readline interface to wait for user input
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question("🔄 Do you want to terminate the running server? (y/n): ", (answer) => {
//     if (answer.toLowerCase() === 'y'){
//         console.log("🛑 Server terminated successfully.");
//         rl.close();
//     }else{
//         console.log("✅ Server will continue running. You can stop it manually with Ctrl+C.");
//     }
// });

// rl.question("🔄 Do you want to terminate the running server? (y/n): ", (answer) => {
//   if (answer.toLowerCase() === 'y') {
//     if (server && typeof server.close === 'function') {
//       server.close(() => {
//         console.log("🛑 Server terminated successfully.");
//         process.exit(0);
//       });
//     } else {
//       console.warn("⚠️ Server does not support graceful shutdown. Exiting forcefully.");
//       process.exit(1);
//     }
//   } else {
//     console.log("✅ Server will continue running. You can stop it manually with Ctrl+C.");
//     rl.close();
//   }
// });
