export class User {
  private id?: number;
  private username: string;
  private email: string;
  private password: string;
  private creationDate: Date;
  private role: Role;
  private reputation: Level;

  constructor(user: {
    id?: number;
    username: string;
    email: string;
    password: string;
    creationDate: Date;
    role: Role;
    reputation: Level;
  }) {
    this.validate(user);
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.creationDate = user.creationDate;
    this.role = user.role;
    this.reputation = user.reputation;
  }
  validate(user: {
    id?: number;
    username: string;
    email: string;
    password: string;
    creationDate: Date;
    role: Role;
    reputation: Level;
  }) {
    if (!user.username?.trim()) {
      throw new Error("Username is required");
    }
    if (!user.email?.trim()) {
      throw new Error("Email is required");
    }
    if (!this.validateEmail(user.email)) {
      return new Error("Invalid email");
    }
    if (!user.password?.trim()) {
      throw new Error("Password is required");
    }
    if (user.password.length < 8) {
      throw new Error("Password needs minimum 8 charachters");
    }
  }
  validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  getId(): number | undefined {
    return this.id;
  }
  getUsername(): string {
    return this.username;
  }
  getEmail(): string {
    return this.email;
  }
  getPassword(): string {
    return this.password;
  }
  getCreationDate(): Date {
    return this.creationDate;
  }
  getRole(): Role {
    return this.role;
  }
  getReputation(): Level {
    return this.reputation;
  }
}
