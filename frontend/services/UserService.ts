import { AuthenticationResponse, User } from "@/types/types"

const signUp = async(user: User): Promise<AuthenticationResponse | undefined> => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error creating a user:', error);
    }
    
}

export default {
    signUp
}