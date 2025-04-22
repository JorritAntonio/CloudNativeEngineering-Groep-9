import { User } from "../domain/user";
import { Container, CosmosClient } from "@azure/cosmos";

// Dit is het model van de User CosmosObject
// Deze krijg je als je een object oproept vanuit de databank
// Vergelijkbaar met een prisma object
interface CosmosUserDocument {
    id: string,
    username: string,
    email: string,
    password: string,
    creationDate: Date,
    role: Role,
    reputation: Level;
}

export class UserRepository {
    
    private static instance: UserRepository;
    private readonly container: Container;

    constructor(container: Container) {

        if (!container) {
            throw new Error("User Repository Cosmos Container required");
        }

        this.container = container;
    }

    // Met deze functie maak je een instantie aan van de container
    // UserRepository.getInstance() kan gebruikt worden om een instantie van de repository te maken in andere repositories.
    static getInstance = async() => {
        const key = process.env.COSMOS_KEY;
        const endpoint = process.env.COSMOS_ENDPOINT;
        const databaseName = process.env.COSMOS_DATABASE_NAME;
        const containerName = "users";
        const partitionKeyPath = ["/partition"];

        if (!key || !endpoint) {
            throw new Error("Cosmos key and endpoint should be specified.")
        }

        const cosmosClient = new CosmosClient({key: key, endpoint: endpoint});

        const {database} = await cosmosClient.databases.createIfNotExists({id: databaseName});
        const { container } = await database.containers.createIfNotExists({
            id: containerName,
            partitionKey: {
                paths: partitionKeyPath
            }
        })

        this.instance = new UserRepository(container);

        return this.instance;
    };

    // Deze functie gaat een Cosmos object naar een user object veranderen
    // Jij kan het vergelijken met de User.from() functie van bij prisma.
    toUser = (userDocument: CosmosUserDocument): User => {
        return new User({
            id: parseInt(userDocument.id),
            username: userDocument.username,
            email: userDocument.email,
            password: userDocument.password,
            creationDate: userDocument.creationDate,
            role: userDocument.role,
            reputation: userDocument.reputation
        })
    }

    // Ik maak gebruik van een SQL query die alle users uit de container pakt
    // Dan fetch ik alle users met de .fetchAll() functie
    // Als laatste transformeer ik alle CosmosUserObjecten naar normale user objecten.
    getAllUsers = async(): Promise<User[]> => {
        // De 'c' is voor de container -> Bij de repositories maken wij een container dus het gaat in de container kijken.
        const query = {
            query: "SELECT * FROM c"
        };

        const {resources} = await this.container.items.query(query).fetchAll();
        return resources.map((resource) => this.toUser(resource));
    }

    // Query: Zoekt elke user die matcht de gegeven ID
    // De .fetchAll() geeft een lijst terug (Ookal is het maar 1 item).
    // Als de lijst meer dan 0 items heeft, dan word te cosmosObject getransformeerd naar een user object en wordt teruggegeven
    findUserById = async(id: number): Promise<User> => {
        const query = {
            query: "SELECT * FROM c WHERE c.id = @id",
            parameters: [{ name: "@id", value: id }]
        }
        
        const {resources} = await this.container.items.query(query).fetchAll();
        if (resources.length > 0) {
            return this.toUser(resources[0]);
        } else {
            throw new Error("User does not exist by id");
        }
    }


    //Hetzelfde als de findUserById maar met email
    findUserByEmail = async(email: string): Promise<User> => {
        const query = {
            query: "SELECT * FROM c WHERE c.email = @email",
            parameters: [{ name: "@email", value: email }]
        };

        const { resources } = await this.container.items.query(query).fetchAll();
        if (resources.length > 0) {
            return this.toUser(resources[0]);
        } else {
            throw new Error("User not found.")
        }
    }

    // Hetzelfde als de findUserById maar met username
    findUserByUsername = async(username: string): Promise<User> => {
        const query = {
            query: "SELECT * FROM c WHERE c.username = @username",
            parameters: [{ name: "@username", value: username }]
        };

        const {resources} = await this.container.items.query(query).fetchAll();
        if (resources.length > 0) {
            return this.toUser(resources[0]);
        } else {
            throw new Error("User not found.")
        }
    }

    createUser = async(user: User): Promise<User> => {
        // Omdat er geen auto-increment is fetch ik alle users en dan doe ik de lengte van deze lijst + 1.
        const id: number = (await this.getAllUsers()).length + 1;
        
        // De user wordt hier aangemaakt met de items.create({}) functie
        const result = await this.container.items.create({
            id: id.toString(),
            username: user.getUsername(),
            email: user.getEmail(),
            password: user.getPassword(),
            creationDate: user.getCreationDate(),
            role: user.getRole(),
            reputation: user.getReputation()
        });

        if (result && result.statusCode == 200) {
            return this.findUserByEmail(user.getEmail());
        } else {
            throw new Error("Could not create user.")
        }

    }

    //Doet hetzelfde als de findUserById functie, alleen returnt het een boolean.
    userExists = async(email: string): Promise<boolean> => {
        const query = {
            query: "SELECT * FROM c WHERE c.email = @email",
            parameters: [{ name: "@email", value: email }]
        };

        const { resources } = await this.container.items.query(query).fetchAll();
        if (resources.length > 0) {
            return true;
        } else {
            return false;
        }
    }

}