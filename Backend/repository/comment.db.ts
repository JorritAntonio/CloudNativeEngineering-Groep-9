import { Container, CosmosClient } from "@azure/cosmos";
import { Comment } from "../domain/comment";
import { UserRepository } from "./user.db";
import { ThreadRepository } from "./thread.db";
import * as dotenv from "dotenv";

dotenv.config();

// Dit is het model van de Comment CosmosObject
// Deze krijg je als je een object oproept vanuit de databank
// Vergelijkbaar met een prisma object
interface CosmosCommentDocument {
  id: string;
  content: string;
  creationDate: Date;
  user: string; // Dit is een string omdat ik een ID opsla ipv het volledig user Object
  thread: string; // Dit is een string omdat ik een ID opsla ipv het volledig thread Object
}

export class CommentRepository {
  private static instance: CommentRepository;
  private readonly container: Container;

  constructor(container: Container) {
    if (!container) {
      throw new Error("Container Repository Cosmos Container Required");
    }

    this.container = container;
  }
  // Met deze functie maak je een instantie aan van de container
  // CommentRepository.getInstance() kan gebruikt worden om een instantie van de repository te maken in andere repositories.
  static getInstance = async () => {
    const key = process.env.COSMOS_KEY;
    const endpoint = process.env.COSMOS_ENDPOINT;
    const databaseName = process.env.COSMOS_DATABASE_NAME;
    const containerName = "threads";
    const partitionKeyPath = ["/partition"];

    if (!key || !endpoint) {
      throw new Error("Cosmos key and endpoint should be specified.");
    }

    const cosmosClient = new CosmosClient({ key: key, endpoint: endpoint });

    const { database } = await cosmosClient.databases.createIfNotExists({
      id: databaseName,
    });
    const { container } = await database.containers.createIfNotExists({
      id: containerName,
      partitionKey: {
        paths: partitionKeyPath,
      },
    });

    this.instance = new CommentRepository(container);

    return this.instance;
  };

  // Deze functie gaat een Cosmos object naar een comment object veranderen
  // Jij kan het vergelijken met de User.from() functie van bij prisma.
  toComment = async (
    commentDocument: CosmosCommentDocument,
  ): Promise<Comment> => {
    // Ik nest geen objecten tijdens de create functie:
    // Ipv een volledig user object opnieuw op te slaan als ik een thread aanmaak, ga ik gewoon de threadId geven
    // Ik heb de user en thread nodig dus ik maak een instantie van de beide repositories.
    const userRepository = await UserRepository.getInstance();
    const threadRepository = await ThreadRepository.getInstance();

    // Hier fetch ik de user en thread door hun ID te geven
    const user = await userRepository.findUserById(
      parseInt(commentDocument.user),
    );
    const thread = await threadRepository.findThreadById(
      commentDocument.thread,
    );

    if (!user) {
      throw new Error(
        "Cannot change commentDocument to Comment due to missing user",
      );
    }

    if (!thread) {
      throw new Error(
        "Cannot change commentDocument to Comment due to missing thread",
      );
    }

    return new Comment({
      id: parseInt(commentDocument.id),
      content: commentDocument.content,
      creationDate: commentDocument.creationDate,
      user: user,
      thread: thread,
    });
  };

  // Ik maak gebruik van een SQL query die alle comments uit de container pakt
  // Dan fetch ik alle comments met de .fetchAll() functie
  // Als laatste transformeer ik alle CosmosCommentObjecten naar normale comment objecten.
  getAllComments = async (): Promise<Comment[]> => {
    const query = {
      query: "SELECT * FROM c",
    };

    const { resources } = await this.container.items.query(query).fetchAll();
    if (resources.length > 0) {
      return Promise.all(resources.map((resource) => this.toComment(resource)));
    } else {
      throw new Error("Comment not found.");
    }
  };
  // Query: Zoekt elke comment die matcht de gegeven ID
  // De .fetchAll() geeft een lijst terug (Ookal is het maar 1 item).
  // Als de lijst meer dan 0 items heeft, dan word te cosmosObject getransformeerd naar een comment object en wordt teruggegeven
  findCommentById = async (id: string): Promise<Comment> => {
    const query = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: id }],
    };

    const { resources } = await this.container.items.query(query).fetchAll();
    if (resources.length > 0) {
      return this.toComment(resources[0]);
    } else {
      throw new Error("Comment not found.");
    }
  };

  findCommentsByUserUsername = async (username: string): Promise<Comment[]> => {
    // Wij hebben de userID opgeslagen ipv een volledig user object bij het aanmaken van een comment.
    // Dat betekent dat wij de user eerst moeten fetchen met de username, dan kunnen wij zijn ID krijgen
    // Hier maak ik een instantie aan van de userRepository
    const userRepository = await UserRepository.getInstance();
    const user = await userRepository.findUserByUsername(username);

    if (!user) {
      throw new Error("Could not find user.");
    }

    // Query fetch alle comments met de userID van de user
    const query = {
      query: "SELECT * FROM c WHERE c.user = @id",
      parameters: [{ name: "@id", value: user.getId() ?? null }],
    };

    const { resources } = await this.container.items.query(query).fetchAll();
    if (resources.length > 0) {
      return Promise.all(resources.map((resource) => this.toComment(resource)));
    } else {
      throw new Error("Comments not found.");
    }
  };

  createComment = async (comment: Comment): Promise<Comment> => {
    // Omdat er geen auto-increment is fetch ik alle comments en dan doe ik de lengte van deze lijst + 1.
    const id = (await this.getAllComments()).length + 1;

    // Bij user en thread geef ik de ID, niet de volledige object
    // Dit zorgt er voor dat er referentie is naar de al bestaande objecten in db.
    const result = await this.container.items.create({
      id: id.toString(),
      content: comment.getContent(),
      creationDate: comment.getCreationDate(),
      user: comment.getUser().getId(),
      thread: comment.getThread().getId(),
    });

    if (result && result.statusCode >= 200 && result.statusCode < 400) {
      return this.findCommentById(id.toString());
    } else {
      throw new Error("Could not create comment.");
    }
  };
}
