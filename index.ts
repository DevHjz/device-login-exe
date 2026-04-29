/**
 * Trusted Quick Login Companion Application
 * 
 * This application demonstrates how to use the Casdoor Node.js SDK to implement 
 * a Trusted Quick Login Companion. It allows this device to act as a "trusted device"
 * that can approve login requests from other devices (e.g., a web browser on another PC).
 */

import { createNodeCompanion } from './casdoor-sdk/src/companion/bootstrap';
import * as path from 'path';

// --- SDK Initialization Parameters (Loaded from Environment Variables or Defaults) ---
const CASDOOR_SERVER_URL = process.env.CASDOOR_SERVER_URL || 'https://your-casdoor-server.com';
const CASDOOR_CLIENT_ID = process.env.CASDOOR_CLIENT_ID || 'your-client-id';
const APP_BASE_DIR = process.env.APP_BASE_DIR || path.join(process.env.APPDATA || __dirname, 'casdoor-companion', 'data');
const COMPANION_PORT = parseInt(process.env.COMPANION_PORT || '47321', 10);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://your-app-domain.com,http://localhost:3000').split(',');

/**
 * In a real application, you would obtain the user's session after they log in 
 * to this "Companion" app via Casdoor.
 */
const currentUserSession = {
  accessToken: 'USER_ACCESS_TOKEN_HERE',
  userName: 'john_doe',
  displayName: 'John Doe',
  avatar: 'https://casdoor.org/img/casdoor.png'
};

async function startCompanion() {
  try {
    console.log('Initializing Casdoor Trusted Quick Login Companion...');

    // 1. Create the Companion instance
    // We use createNodeCompanion which handles file-based storage for keys and bindings automatically.
    const companion = createNodeCompanion({
      serverUrl: CASDOOR_SERVER_URL,
      clientId: CASDOOR_CLIENT_ID,
      baseDir: APP_BASE_DIR,
      port: COMPANION_PORT,
      allowedOrigins: ALLOWED_ORIGINS,
      
      // Optional: Custom logic to approve a quick login request
      approveQuickLogin: async (input) => {
        console.log(`\n[Action Required] Quick login request received!`);
        console.log(`Application: ${input.applicationName || 'Unknown'}`);
        console.log(`User: ${input.displayName} (${input.userName})`);
        
        // In a real GUI app, you would show a dialog to the user here.
        // For this CLI example, we'll auto-approve.
        console.log('Auto-approving request...');
        return true; 
      }
    });

    // 2. Set the current user session
    // This will:
    // - Register this device as a "Trusted Device" in Casdoor if not already registered.
    // - Start a local HTTP server to handle discovery requests from the browser.
    console.log(`Setting session for user: ${currentUserSession.userName}`);
    await companion.setSession(currentUserSession);

    console.log('---------------------------------------------------------');
    console.log('Companion is now ACTIVE and PROTECTED.');
    console.log(`Local discovery server running on port: ${COMPANION_PORT}`);
    console.log('This device can now be used for Trusted Quick Login.');
    console.log('---------------------------------------------------------');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\nShutting down companion...');
      await companion.close();
      process.exit(0);
    });

  } catch (error: any) {
    console.error('Failed to start Companion:', error.message);
  }
}

// Start the application
startCompanion();
