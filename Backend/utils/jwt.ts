
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const generateJwtToken = (username: string) => {
    const options = { expiresIn: parseInt(process.env.JWT_EXPIRES_HOURS || "0") * 3600, issuer: `famList_app`};

    try {
        return jwt.sign({username}, `${process.env.JWT_SECRET || "default"}`, options);
    } catch (error) {
        console.log(error);
        throw new Error("Error generating JWT token, see server logs for more details.")
    }
}

export default generateJwtToken;