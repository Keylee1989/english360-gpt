/**
 * Authentication Service
 *
 * Uses Supabase for:
 * - User registration
 * - Login
 * - Logout
 * - Session management
 * - Profile management
 */

// ============================================================
// Types
// ============================================================

export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  gender?: "male" | "female" | "other";
  location?: string;
  englishLevel?: "zero" | "beginner" | "elementary" | "intermediate";
  goal?: string;
  dailyAvailableMinutes?: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================================
// Supabase Configuration
// ============================================================

// Supabase configuration (for future use)
// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// ============================================================
// Mock Supabase Client (for development)
// ============================================================

class MockSupabaseClient {
  private users: Map<string, { user: User; password: string }> = new Map();
  private currentUser: User | null = null;

  async signUp(email: string, password: string, metadata: Record<string, unknown>) {
    if (this.users.has(email)) {
      return { data: null, error: { message: "User already exists" } };
    }

    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name: (metadata.name as string) || email.split("@")[0],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      ...metadata,
    };

    this.users.set(email, { user, password });
    this.currentUser = user;

    return { data: { user }, error: null };
  }

  async signIn(email: string, password: string) {
    const userData = this.users.get(email);
    if (!userData || userData.password !== password) {
      return { data: null, error: { message: "Invalid email or password" } };
    }

    this.currentUser = userData.user;
    userData.user.lastLoginAt = new Date().toISOString();

    return { data: { user: userData.user }, error: null };
  }

  async signOut() {
    this.currentUser = null;
    return { error: null };
  }

  async getUser() {
    return { data: { user: this.currentUser }, error: null };
  }

  async updateProfile(updates: Partial<User>) {
    if (!this.currentUser) {
      return { data: null, error: { message: "Not authenticated" } };
    }

    this.currentUser = { ...this.currentUser, ...updates };

    // Update in storage
    const userData = this.users.get(this.currentUser.email);
    if (userData) {
      userData.user = this.currentUser;
    }

    return { data: { user: this.currentUser }, error: null };
  }
}

// ============================================================
// Authentication Service
// ============================================================

export class AuthService {
  private client: MockSupabaseClient;
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  };
  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    this.client = new MockSupabaseClient();
    this.init();
  }

  private async init() {
    try {
      const { data } = await this.client.getUser();
      if (data.user) {
        this.state.user = data.user;
        this.state.isAuthenticated = true;
      }
    } catch {
      // Ignore init errors
    } finally {
      this.state.isLoading = false;
      this.notifyListeners();
    }
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }

  /**
   * Register new user
   */
  async register(
    email: string,
    password: string,
    metadata: {
      name: string;
      age?: number;
      gender?: "male" | "female" | "other";
      location?: string;
      englishLevel?: "zero" | "beginner" | "elementary" | "intermediate";
      goal?: string;
      dailyAvailableMinutes?: number;
    }
  ): Promise<{ success: boolean; error?: string }> {
    this.state.isLoading = true;
    this.state.error = null;
    this.notifyListeners();

    const { data, error } = await this.client.signUp(email, password, metadata);

    if (error) {
      this.state.error = error.message;
      this.state.isLoading = false;
      this.notifyListeners();
      return { success: false, error: error.message };
    }

    this.state.user = data.user;
    this.state.isAuthenticated = true;
    this.state.isLoading = false;
    this.notifyListeners();

    return { success: true };
  }

  /**
   * Login
   */
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    this.state.isLoading = true;
    this.state.error = null;
    this.notifyListeners();

    const { data, error } = await this.client.signIn(email, password);

    if (error) {
      this.state.error = error.message;
      this.state.isLoading = false;
      this.notifyListeners();
      return { success: false, error: error.message };
    }

    this.state.user = data.user;
    this.state.isAuthenticated = true;
    this.state.isLoading = false;
    this.notifyListeners();

    return { success: true };
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await this.client.signOut();
    this.state.user = null;
    this.state.isAuthenticated = false;
    this.notifyListeners();
  }

  /**
   * Update profile
   */
  async updateProfile(
    updates: Partial<User>
  ): Promise<{ success: boolean; error?: string }> {
    const { data, error } = await this.client.updateProfile(updates);

    if (error) {
      return { success: false, error: error.message };
    }

    this.state.user = data.user;
    this.notifyListeners();

    return { success: true };
  }

  /**
   * Get current state
   */
  getState(): AuthState {
    return { ...this.state };
  }

  /**
   * Get current user
   */
  getUser(): User | null {
    return this.state.user;
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }
}

// ============================================================
// Singleton
// ============================================================

export const authService = new AuthService();
export default authService;
