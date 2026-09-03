/**
 * Admin Authentication Testing Examples
 * Use these examples to test the admin authentication system locally
 */

// ============================================
// Using Fetch API (Browser/Node.js)
// ============================================

/**
 * Example 1: Test with X-Dev-Admin-Token header
 */
async function testWithDevAdminToken() {
  const token = 'your_secure_dev_token_here';
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats', {
      method: 'GET',
      headers: {
        'X-Dev-Admin-Token': token,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 2: Test with X-Admin-Token header (fallback)
 */
async function testWithAdminToken() {
  const token = 'your_secure_dev_token_here';
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats', {
      method: 'GET',
      headers: {
        'X-Admin-Token': token,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 3: Test with Authorization Bearer token
 */
async function testWithBearerToken() {
  const token = 'your_secure_dev_token_here';
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 4: Test without token (should fail with 401)
 */
async function testWithoutToken() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Error Response:', data);
    // Should return 401 Unauthorized
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 5: Test POST request with admin action
 */
async function testPostWithToken() {
  const token = 'your_secure_dev_token_here';
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats', {
      method: 'POST',
      headers: {
        'X-Dev-Admin-Token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'suspend_group',
        groupId: '12345',
        reason: 'Violating platform policies',
      }),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 6: Test public health endpoint (no auth required)
 */
async function testPublicHealthEndpoint() {
  try {
    const response = await fetch('http://localhost:3000/api/health', {
      method: 'GET',
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// ============================================
// Using Axios (if installed)
// ============================================

/**
 * Example 7: Using Axios with interceptors
 */
// Uncomment if axios is installed: npm install axios
/*
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

// Add token to all requests
const token = 'your_secure_dev_token_here';
apiClient.defaults.headers.common['X-Dev-Admin-Token'] = token;

async function testWithAxios() {
  try {
    const response = await apiClient.get('/api/admin/stats');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}
*/

// ============================================
// Using cURL (Command Line)
// ============================================

/*
# Test with X-Dev-Admin-Token
curl -H "X-Dev-Admin-Token: your_secure_dev_token_here" \
  http://localhost:3000/api/admin/stats

# Test with X-Admin-Token
curl -H "X-Admin-Token: your_secure_dev_token_here" \
  http://localhost:3000/api/admin/stats

# Test with Bearer token
curl -H "Authorization: Bearer your_secure_dev_token_here" \
  http://localhost:3000/api/admin/stats

# Test without token (should return 401)
curl http://localhost:3000/api/admin/stats

# Test POST request
curl -X POST \
  -H "X-Dev-Admin-Token: your_secure_dev_token_here" \
  -H "Content-Type: application/json" \
  -d '{"action":"suspend_group","groupId":"12345"}' \
  http://localhost:3000/api/admin/stats

# Test public endpoint
curl http://localhost:3000/api/health
*/

// ============================================
// Testing Checklist
// ============================================

/*
Before deploying, test these scenarios:

✅ Public endpoint without token
  - GET /api/health should return 200

✅ Protected endpoint without token
  - GET /api/admin/stats should return 401

✅ Protected endpoint with X-Dev-Admin-Token
  - GET /api/admin/stats with valid token should return 200

✅ Protected endpoint with X-Admin-Token
  - GET /api/admin/stats with valid token should return 200

✅ Protected endpoint with Bearer token
  - GET /api/admin/stats with valid Bearer token should return 200

✅ Protected endpoint with invalid token
  - GET /api/admin/stats with wrong token should return 401

✅ POST request with authentication
  - POST /api/admin/stats with valid token and body should return 200

✅ Wrong header name
  - GET /api/admin/stats with "X-Token: value" should return 401

✅ Case insensitivity
  - Headers should work regardless of case
*/

export {
  testWithDevAdminToken,
  testWithAdminToken,
  testWithBearerToken,
  testWithoutToken,
  testPostWithToken,
  testPublicHealthEndpoint,
};
