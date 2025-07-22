// API Adapter for seamless migration from file-based to API-based data
// Supports hybrid mode with fallback to file system

class APIAdapter {
  constructor(config = {}) {
    this.baseURL = config.baseURL || process.env.API_BASE_URL || 'http://localhost:3001/api';
    this.timeout = config.timeout || 5000;
    this.retries = config.retries || 3;
    this.fallbackToFile = config.fallbackToFile !== false;
    
    // Request interceptors for authentication, logging, etc.
    this.interceptors = {
      request: [],
      response: []
    };
  }

  /**
   * Generic HTTP GET request with retry logic
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} Response data
   */
  async get(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      timeout: this.timeout,
      ...options
    };

    // Apply request interceptors
    for (const interceptor of this.interceptors.request) {
      await interceptor(requestOptions);
    }

    let lastError;
    
    // Retry logic
    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        console.log(`🌐 API Request (attempt ${attempt}): GET ${url}`);
        
        const response = await this.fetchWithTimeout(url, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Apply response interceptors
        for (const interceptor of this.interceptors.response) {
          await interceptor(data, response);
        }

        console.log(`✅ API Success: ${endpoint}`);
        return data;
        
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ API attempt ${attempt} failed:`, error.message);
        
        if (attempt < this.retries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    // All retries failed
    console.error(`❌ API failed after ${this.retries} attempts:`, lastError.message);
    throw new Error(`API request failed: ${lastError.message}`);
  }

  /**
   * HTTP POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise} Response data
   */
  async post(endpoint, data, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      timeout: this.timeout,
      ...options
    };

    const response = await this.fetchWithTimeout(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * HTTP PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise} Response data
   */
  async put(endpoint, data, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      timeout: this.timeout,
      ...options
    };

    const response = await this.fetchWithTimeout(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch with timeout support
   * @private
   */
  async fetchWithTimeout(url, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Sleep utility for retry delays
   * @private
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Add request interceptor
   * @param {Function} interceptor - Function to modify request
   */
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  /**
   * Add response interceptor
   * @param {Function} interceptor - Function to process response
   */
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  /**
   * Health check endpoint
   * @returns {Promise} Health status
   */
  async healthCheck() {
    try {
      const response = await this.get('/health');
      return { status: 'healthy', ...response };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Get API configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return {
      baseURL: this.baseURL,
      timeout: this.timeout,
      retries: this.retries,
      fallbackToFile: this.fallbackToFile
    };
  }
}

module.exports = APIAdapter;
