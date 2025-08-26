import { User, UserType, GuestUser, StoredUserData } from '@/types';

export class AuthService {
  private static readonly STORAGE_KEY = 'prompt-trainer-user';
  private static readonly USERS_KEY = 'prompt-trainer-users';
  private static readonly SESSION_KEY = 'prompt-trainer-session';

  static async signup(username: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Validate input
      if (!username || !email || !password) {
        return { success: false, error: 'All fields are required' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Check if user already exists
      const existingUsers = this.getAllUsers();
      if (existingUsers.some(user => user.username === username)) {
        return { success: false, error: 'Username already exists' };
      }

      if (existingUsers.some(user => user.email === email)) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const newUser: User = {
        id: this.generateId(),
        username,
        email,
        createdAt: new Date(),
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        bestStreak: 0,
        achievements: [],
        promptHistory: []
      };

      // Store user
      const hashedPassword = await this.hashPassword(password);
      this.storeUserCredentials(username, hashedPassword);
      this.storeUser(newUser);

      return { success: true, user: newUser };
    } catch {
      return { success: false, error: 'An error occurred during signup' };
    }
  }

  static async login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Validate input
      if (!username || !password) {
        return { success: false, error: 'Username and password are required' };
      }

      // Check credentials
      const hashedPassword = await this.hashPassword(password);
      const storedCredentials = this.getStoredCredentials();
      
      if (!storedCredentials[username] || storedCredentials[username] !== hashedPassword) {
        return { success: false, error: 'Invalid username or password' };
      }

      // Get user data
      const users = this.getAllUsers();
      const user = users.find(u => u.username === username);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Update last login
      this.updateLastLogin(user.id);

      return { success: true, user };
    } catch {
      return { success: false, error: 'An error occurred during login' };
    }
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  }

  static getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEY);
      if (!userData) return null;

      const storedData: StoredUserData = JSON.parse(userData);
      return storedData.user;
    } catch {
      return null;
    }
  }

  static createGuestUser(): GuestUser {
    const guestUser: GuestUser = {
      isGuest: true,
      sessionId: this.generateId(),
      tempPromptHistory: []
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(guestUser));
    return guestUser;
  }

  static getGuestUser(): GuestUser | null {
    try {
      const guestData = localStorage.getItem(this.SESSION_KEY);
      if (!guestData) return null;

      return JSON.parse(guestData) as GuestUser;
    } catch {
      return null;
    }
  }

  static updateUser(user: User): void {
    const storedData: StoredUserData = {
      user,
      lastLogin: new Date(),
      preferences: {
        theme: 'dark',
        animations: true,
        soundEffects: true,
        notifications: true,
        autoAnalyze: false
      }
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedData));

    // Update in users list
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  static updateGuestUser(guestUser: GuestUser): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(guestUser));
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static isGuest(): boolean {
    return this.getGuestUser() !== null && !this.isAuthenticated();
  }

  static getUserType(): UserType | null {
    const user = this.getCurrentUser();
    if (user) return user;

    const guestUser = this.getGuestUser();
    if (guestUser) return guestUser;

    return null;
  }

  // Private helper methods
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static async hashPassword(password: string): Promise<string> {
    // Simple hash for demo purposes - in production, use proper bcrypt or similar
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private static getStoredCredentials(): Record<string, string> {
    try {
      const credentials = localStorage.getItem('prompt-trainer-credentials');
      return credentials ? JSON.parse(credentials) : {};
    } catch {
      return {};
    }
  }

  private static storeUserCredentials(username: string, hashedPassword: string): void {
    const credentials = this.getStoredCredentials();
    credentials[username] = hashedPassword;
    localStorage.setItem('prompt-trainer-credentials', JSON.stringify(credentials));
  }

  private static getAllUsers(): User[] {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  private static storeUser(user: User): void {
    const users = this.getAllUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    // Also set as current user
    const storedData: StoredUserData = {
      user,
      lastLogin: new Date(),
      preferences: {
        theme: 'dark',
        animations: true,
        soundEffects: true,
        notifications: true,
        autoAnalyze: false
      }
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedData));
  }

  private static updateLastLogin(userId: string): void {
    // In a real app, this would update the server
    // For now, we'll just track it locally
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      this.updateUser(user);
    }
  }

  // Utility method for data migration if needed
  static migrateGuestToUser(guestUser: GuestUser, user: User): User {
    // Transfer guest data to new user account
    const updatedUser: User = {
      ...user,
      promptHistory: [...user.promptHistory, ...guestUser.tempPromptHistory]
    };

    // Clear guest data
    localStorage.removeItem(this.SESSION_KEY);
    
    return updatedUser;
  }
}