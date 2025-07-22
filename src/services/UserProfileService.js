// Enhanced user profile service with names and locations
class UserProfileService {
  constructor() {
    // Test user profiles with Indian names and cities
    this.userProfiles = {
      '1010101010': { 
        name: 'Arjun Sharma', 
        location: 'Mumbai, Maharashtra',
        balance: 125000.50, 
        netWorth: -50000, 
        avatar: 1,
        profession: 'Software Engineer',
        age: 28
      },
      '1111111111': { 
        name: 'Priya Patel', 
        location: 'Ahmedabad, Gujarat',
        balance: 89750.25, 
        netWorth: 45000, 
        avatar: 2,
        profession: 'Marketing Manager',
        age: 26
      },
      '1212121212': { 
        name: 'Rajesh Kumar', 
        location: 'Delhi, NCR',
        balance: 234500.75, 
        netWorth: 180000, 
        avatar: 3,
        profession: 'Business Analyst',
        age: 32
      },
      '1313131313': { 
        name: 'Sneha Reddy', 
        location: 'Hyderabad, Telangana',
        balance: 67890.00, 
        netWorth: -25000, 
        avatar: 4,
        profession: 'Graphic Designer',
        age: 24
      },
      '1414141414': { 
        name: 'Vikram Singh', 
        location: 'Jaipur, Rajasthan',
        balance: 156780.90, 
        netWorth: 95000, 
        avatar: 5,
        profession: 'Sales Executive',
        age: 30
      },
      '2020202020': { 
        name: 'Anita Gupta', 
        location: 'Pune, Maharashtra',
        balance: 98765.43, 
        netWorth: 12000, 
        avatar: 6,
        profession: 'HR Specialist',
        age: 27
      },
      '2121212121': { 
        name: 'Karthik Nair', 
        location: 'Kochi, Kerala',
        balance: 345678.21, 
        netWorth: 250000, 
        avatar: 7,
        profession: 'Product Manager',
        age: 35
      },
      '2222222222': { 
        name: 'Meera Joshi', 
        location: 'Indore, Madhya Pradesh',
        balance: 54321.67, 
        netWorth: -15000, 
        avatar: 8,
        profession: 'Content Writer',
        age: 25
      },
      '2525252525': { 
        name: 'Rohit Agarwal', 
        location: 'Kolkata, West Bengal',
        balance: 187654.32, 
        netWorth: 125000, 
        avatar: 9,
        profession: 'Financial Advisor',
        age: 31
      },
      '3333333333': { 
        name: 'Kavya Iyer', 
        location: 'Chennai, Tamil Nadu',
        balance: 76543.89, 
        netWorth: 35000, 
        avatar: 10,
        profession: 'UX Designer',
        age: 26
      },
      '4444444444': { 
        name: 'Amit Verma', 
        location: 'Gurgaon, Haryana',
        balance: 298765.12, 
        netWorth: 200000, 
        avatar: 11,
        profession: 'Data Scientist',
        age: 33
      },
      '5555555555': { 
        name: 'Ritu Malhotra', 
        location: 'Chandigarh, Punjab',
        balance: 43210.98, 
        netWorth: -8000, 
        avatar: 12,
        profession: 'Teacher',
        age: 29
      },
      '6666666666': { 
        name: 'Suresh Pillai', 
        location: 'Thiruvananthapuram, Kerala',
        balance: 165432.76, 
        netWorth: 85000, 
        avatar: 13,
        profession: 'Civil Engineer',
        age: 34
      },
      '7777777777': { 
        name: 'Deepika Rao', 
        location: 'Mangalore, Karnataka',
        balance: 87654.21, 
        netWorth: 25000, 
        avatar: 14,
        profession: 'Doctor',
        age: 28
      },
      '8888888888': { 
        name: 'Manish Tiwari', 
        location: 'Lucknow, Uttar Pradesh',
        balance: 234567.89, 
        netWorth: 175000, 
        avatar: 15,
        profession: 'Architect',
        age: 36
      },
      '9999999999': { 
        name: 'Pooja Bhatt', 
        location: 'Surat, Gujarat',
        balance: 123456.78, 
        netWorth: 65000, 
        avatar: 16,
        profession: 'Pharmacist',
        age: 27
      }
    };

    this.availableUsers = Object.keys(this.userProfiles);
    this.currentUserId = null;
  }

  // Get all user profiles for selection screen
  getAllUserProfiles() {
    return this.userProfiles;
  }

  // Get user profile by ID
  getUserProfile(userId) {
    return this.userProfiles[userId] || null;
  }

  // Get available user IDs
  getAvailableUsers() {
    return this.availableUsers;
  }

  // Set current user
  setCurrentUser(userId) {
    if (this.userProfiles[userId]) {
      this.currentUserId = userId;
      return true;
    }
    return false;
  }

  // Get current user ID
  getCurrentUser() {
    return this.currentUserId;
  }

  // Get current user profile
  getCurrentUserProfile() {
    return this.currentUserId ? this.userProfiles[this.currentUserId] : null;
  }

  // Get user balance
  async getUserBalance(userId = this.currentUserId) {
    try {
      const profile = this.userProfiles[userId];
      return profile ? profile.balance : 0;
    } catch (error) {
      console.error('Error getting user balance:', error);
      return 0;
    }
  }

  // Get user net worth
  async getUserNetWorth(userId = this.currentUserId) {
    try {
      const profile = this.userProfiles[userId];
      return profile ? profile.netWorth : 0;
    } catch (error) {
      console.error('Error getting user net worth:', error);
      return 0;
    }
  }

  // Get user avatar number
  getUserAvatar(userId = this.currentUserId) {
    const profile = this.userProfiles[userId];
    return profile ? profile.avatar : 1;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUserId !== null;
  }

  // Logout user
  logout() {
    this.currentUserId = null;
  }
}

module.exports = new UserProfileService();
