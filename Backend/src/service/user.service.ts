import { hash } from "../domain/hash";
import { User } from "../domain/user";
import { UserRepository } from "../repository/user.db";

export class UserService {

  private static instance: UserService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserService();
    }
    return this.instance;
  }

  private async getRepo() {
    return UserRepository.getInstance();
  }

  async addUser(username:string, email: string, password: string) {
    if (!email || email.length < 3) {
      throw new Error('Email is invalid.');
    }

    if (!password || password.length < 8 || password.length > 64) {
      throw new Error('Password must be between 8 and 64 characters.');
    }

    if (await (await this.getRepo()).userExists(email)) {
      throw new Error('A user with this email address already exists.');
    }

    if (await (await this.getRepo()).userExists(username)) {
      throw new Error('A user with this username already exists.');
    }

    const hashedPassword = await hash(password);
    const user = new User({username, email, password: hashedPassword, creationDate: new Date(), role: 'user', reputation: 'Beginner'});
    return (await this.getRepo()).createUser(user);
  }

  async findUserByEmail(email: string) {
    if (!email) {
      throw new Error('Email is invalid.');
    }

    return (await this.getRepo()).findUserByEmail(email);
  }
}