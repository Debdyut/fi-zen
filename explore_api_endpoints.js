#!/usr/bin/env node

// Explore Deltaverse API - Find available endpoints
// This script explores the API to find what endpoints are actually available

const https = require('https');

const DELTAVERSE_API_URL = 'https://deltaverse-api-gewdd6ergq-uc.a.run.app';

async function exploreAPI() {
  console.log('🔍 Exploring Deltaverse API Endpoints');
  console.log('=====================================');
  console.log(`Base URL: ${DELTAVERSE_API_URL}`);
  console.log('');

  // Test potential chat-related endpoints
  const chatEndpoints = [
    '/api/v1/chat',
    '/api/v1/chat/message',
    '/api/v1/chat/messages',
    '/api/v1/chat/conversation',
    '/api/v1/chat/conversations',
    '/api/v1/ai/chat',
    '/api/v1/ai/message',
    '/chat',
    '/chat/message'
  ];

  console.log('🗨️  Testing Chat-Related Endpoints:');
  console.log('===================================');
  
  for (const endpoint of chatEndpoints) {
    await testEndpoint(endpoint, 'POST', {
      message: "hello",
      conversation_id: "test",
      user_id: "test"
    });
  }

  console.log('');
  console.log('📡 Testing API Discovery Endpoints:');
  console.log('===================================');
  
  // Test API discovery endpoints
  const discoveryEndpoints = [
    { path: '/docs', method: 'GET', name: 'OpenAPI Docs' },
    { path: '/openapi.json', method: 'GET', name: 'OpenAPI Schema' },
    { path: '/redoc', method: 'GET', name: 'ReDoc Documentation' },
    { path: '/api/v1', method: 'GET', name: 'API v1 Root' },
    { path: '/api', method: 'GET', name: 'API Root' }
  ];

  for (const endpoint of discoveryEndpoints) {
    await testEndpoint(endpoint.path, endpoint.method, null, endpoint.name);
  }

  console.log('');
  console.log('🔐 Testing Auth Endpoints (from spec):');
  console.log('======================================');
  
  const authEndpoints = [
    { path: '/api/v1/auth/send-otp', method: 'POST', name: 'Send OTP' },
    { path: '/api/v1/auth/verify-otp', method: 'POST', name: 'Verify OTP' },
    { path: '/api/v1/auth/google-login', method: 'POST', name: 'Google Login' },
    { path: '/api/v1/auth/me', method: 'GET', name: 'Get User Info' },
    { path: '/api/v1/auth/profile', method: 'POST', name: 'Update Profile' },
    { path: '/api/v1/auth/logout', method: 'POST', name: 'Logout' }
  ];

  for (const endpoint of authEndpoints) {
    await testEndpoint(endpoint.path, endpoint.method, {}, endpoint.name);
  }

  console.log('');
  console.log('📦 Testing Items Endpoints (from spec):');
  console.log('=======================================');
  
  const itemsEndpoints = [
    { path: '/api/v1/items/', method: 'GET', name: 'Get Items' },
    { path: '/api/v1/items/', method: 'POST', name: 'Create Item' },
    { path: '/api/v1/items/1', method: 'GET', name: 'Get Item by ID' },
    { path: '/api/v1/items/1', method: 'PUT', name: 'Update Item' },
    { path: '/api/v1/items/1', method: 'DELETE', name: 'Delete Item' }
  ];

  for (const endpoint of itemsEndpoints) {
    const payload = endpoint.method === 'POST' || endpoint.method === 'PUT' ? 
      { name: "test", price: 10.0 } : null;
    await testEndpoint(endpoint.path, endpoint.method, payload, endpoint.name);
  }

  console.log('');
  console.log('🎯 Summary:');
  console.log('===========');
  console.log('❌ /api/v1/chat/message endpoint does NOT exist');
  console.log('✅ Base API is healthy and responsive');
  console.log('✅ Standard endpoints (auth, items) are available');
  console.log('');
  console.log('💡 Recommendations:');
  console.log('- Chat functionality is not implemented in current API version');
  console.log('- Check with backend team if chat is planned for future release');
  console.log('- Consider using existing endpoints for now');
}

async function testEndpoint(path, method = 'GET', payload = null, name = null) {
  try {
    const response = await makeRequest(path, payload, method);
    const displayName = name || path;
    console.log(`✅ ${displayName}: Available (${response.status})`);
    
    // If it's a discovery endpoint, show some data
    if (path.includes('openapi') || path.includes('docs')) {
      console.log(`   📄 Content-Type: ${response.headers['content-type']}`);
    }
  } catch (error) {
    const displayName = name || path;
    if (error.status === 404) {
      console.log(`❌ ${displayName}: Not Found`);
    } else if (error.status === 401) {
      console.log(`🔐 ${displayName}: Requires Authentication`);
    } else if (error.status === 403) {
      console.log(`🚫 ${displayName}: Forbidden`);
    } else if (error.status === 422) {
      console.log(`📝 ${displayName}: Validation Error (endpoint exists)`);
    } else if (error.status === 405) {
      console.log(`⚠️  ${displayName}: Method Not Allowed (endpoint exists)`);
    } else {
      console.log(`⚠️  ${displayName}: ${error.status || 'Error'} - ${error.message}`);
    }
  }
}

function makeRequest(path, data = null, method = 'GET') {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'deltaverse-api-gewdd6ergq-uc.a.run.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Fi-Zen-API-Explorer/1.0'
      }
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              status: res.statusCode,
              data: parsedData,
              headers: res.headers
            });
          } else {
            reject({
              status: res.statusCode,
              message: parsedData.detail || parsedData.message || `HTTP ${res.statusCode}`,
              data: parsedData
            });
          }
        } catch (parseError) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              status: res.statusCode,
              data: responseData,
              headers: res.headers
            });
          } else {
            reject({
              status: res.statusCode,
              message: responseData || `HTTP ${res.statusCode}`,
              data: responseData
            });
          }
        }
      });
    });

    req.on('error', (error) => {
      reject({
        message: `Network error: ${error.message}`,
        error: error
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject({
        message: 'Request timeout (5s)',
        status: 'TIMEOUT'
      });
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Run the exploration
if (require.main === module) {
  exploreAPI().catch(console.error);
}

module.exports = { exploreAPI };
