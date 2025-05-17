import { Thread } from "../domain/thread";
import { User } from "../domain/user";
import { Comment } from "../domain/comment";
import { Container, CosmosClient } from "@azure/cosmos";
import { UserRepository } from "./user.db";
import { CommentRepository } from "./comment.db";
import * as dotenv from "dotenv";

dotenv.config();

// Dit is het model van de Thread CosmosObject
// Deze krijg je als je een object oproept vanuit de databank
// Vergelijkbaar met een prisma object
interface CosmosThreadDocument {
  id: string;
  title: string;
  creationDate: Date;
  createdBy: string; // Dit is een string omdat ik een ID opsla ipv het volledig user Object
  comments: string[]; // Dit is een lijst van strings (lijst van ids)
}

export class ThreadRepository {
  private static instance: ThreadRepository;
  private readonly container: Container;

  constructor(container: Container) {
    if (!container) {
      throw new Error("Thread Repository Cosmos Container required");
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

    this.instance = new ThreadRepository(container);

    return this.instance;
  };

  // Deze functie gaat een Cosmos object naar een thread object veranderen
  // Jij kan het vergelijken met de User.from() functie van bij prisma.
  toThread = async (threadDocument: CosmosThreadDocument): Promise<Thread> => {
    // Sinds alleen de UserId en niet de user opgeslagen is in een thread, ga ik deze user fetchen door zijn ID mee te geven
    // Zelfde voor de comments, het is een lijst van commentIds, die moet ik dus allemaal fetchen
    // Hier maak ik instanties aan van de User- en CommentRepositories
    const userRepository = await UserRepository.getInstance();
    const commentRepository = await CommentRepository.getInstance();

    // Ik fetch de user en alle comments
    const user = await userRepository.findUserById(parseInt(threadDocument.id));
    const comments = await Promise.all(
      threadDocument.comments.map((commentId) =>
        commentRepository.findCommentById(commentId),
      ),
    );

    if (!user) {
      throw new Error(
        "Cannot change threadDocument to Thread due to missing user",
      );
    }

    // Ik maak hier dus de thread aan
    return new Thread({
      id: parseInt(threadDocument.id),
      title: threadDocument.title,
      creationDate: threadDocument.creationDate,
      createdBy: user,
      comments: comments,
    });
  };

  // Ik maak gebruik van een SQL query die alle threads uit de container pakt
  // Dan fetch ik alle threads met de .fetchAll() functie
  // Als laatste transformeer ik alle CosmosThreadObjecten naar normale thread objecten.
  getAllThreads = async (): Promise<Thread[]> => {
    const query = {
      query: "SELECT * FROM c",
    };

    const { resources } = await this.container.items.query(query).fetchAll();
    return Promise.all(resources.map((resource) => this.toThread(resource)));
  };

  findThreadsByUserUsername = async (username: string): Promise<Thread[]> => {
    // Wij hebben de userID opgeslagen ipv een volledig user object bij het aanmaken van een comment.
    // Dat betekent dat wij de user eerst moeten fetchen met de username, dan kunnen wij zijn ID krijgen
    // Hier maak ik een instantie aan van de userRepository
    const userRepository = await UserRepository.getInstance();
    const user = await userRepository.findUserByUsername(username);

    if (!user) {
      throw new Error("User does not exist");
    }

    // Query fetch alle threads met de userID van de user
    const query = {
      query: "SELECT * FROM c WHERE c.createdBy = @userId",
      parameters: [{ name: "@userId", value: user.getId() ?? null }],
    };

    const { resources } = await this.container.items.query(query).fetchAll();
    if (resources.length > 0) {
      return Promise.all(resources.map((resource) => this.toThread(resource)));
    } else {
      throw new Error("Threads not found.");
    }
  };

  // Query: Zoekt elke thread die matcht de gegeven ID
  // De .fetchAll() geeft een lijst terug (Ookal is het maar 1 item).
  // Als de lijst meer dan 0 items heeft, dan word te cosmosObject getransformeerd naar een comment object en wordt teruggegeven
  findThreadById = async (id: string): Promise<Thread> => {
    const query = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: id }],
    };

    const { resources } = await this.container.items.query(query).fetchAll();
    if (resources.length > 0) {
      return this.toThread(resources[0]);
    } else {
      throw new Error("Thread not found.");
    }
  };

  createThread = async (thread: Thread): Promise<Thread> => {
    // Omdat er geen auto-increment is fetch ik alle threads en dan doe ik de lengte van deze lijst + 1.
    const id = (await this.getAllThreads()).length + 1;

    // Bij thread en comments geef ik de IDs, niet de volledige object
    // Dit zorgt er voor dat er referentie is naar de al bestaande objecten in db.
    const result = await this.container.items.create({
      id: id.toString(),
      title: thread.getTitle(),
      creationDate: thread.getCreationDate(),
      createdBy: thread.getCreatedBy().getId(),
      comments: thread.getComments().map((comment) => comment.getId()),
    });

    if (result && result.statusCode >= 200 && result.statusCode < 400) {
      return this.findThreadById(id.toString());
    } else {
      throw new Error("Could not create thread.");
    }
  };
}
