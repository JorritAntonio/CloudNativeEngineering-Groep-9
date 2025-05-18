import { useState } from "react";

const LoginForm: React.FC = () => {
    // Fields
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Status messages
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState<string>("");

    const validate = (): boolean => {
        let result = true;
        if (!email.trim() || !password.trim()) {
            setErrors([... "All fields must be filled"])
            result = false;
        }

        return result;
    }


    return (
    <>
    <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-sm w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h1 className="text-xl font-semibold mb-6">Log in to your account</h1>
            <form className="space-y-4">
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
            </form>
        </div>
    </div>
    </>
  );
};

export default LoginForm;
