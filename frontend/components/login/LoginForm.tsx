import UserService from "@/services/UserService";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const LoginForm: React.FC = () => {
    const router = useRouter();
    // Fields
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Status messages
    const [error, setError] = useState<string>();
    const [success, setSuccess] = useState<string>("");

    const validate = (): boolean => {
        let result = true;
        if (!email.trim() || !password.trim()) {
            setError("All fields must be filled");
            result = false;
        }

        return result;
    }

    const login = async(event: FormEvent) => {
        event.preventDefault();

        setError("");

        if (!validate()) return;

        const authResponse = await UserService.logIn({email, password});

        if (authResponse && authResponse.token) {
            localStorage.setItem("loggedInUser", JSON.stringify({
                token: authResponse.token,
                username: authResponse.username
            }));
            setSuccess("Successfully logged in, transferring you to home page in 2 seconds")
            setTimeout(() => {
                setSuccess("Successfully logged in, transferring you to home page in 1 second")
            }, 1000);
            setTimeout(()=> {
                router.push('/');
            }, 2000);
        } else {
            setError("An error has occured...")
        }
    }

    return (
    <>
    <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-sm w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h1 className="text-xl font-semibold mb-6">Log in to your account</h1>
            <form onSubmit={(e) => login(e)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition-colors"
                >
                    Log in
                </button>
                {success && <p className="text-green-400">{success}</p>}
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    </div>
    </>
  );
};

export default LoginForm;
