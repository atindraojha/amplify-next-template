import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation'; // For redirecting after sign-out
import Link from 'next/link'
import '../../styles/global.css'; 

const Header = () => {
    const { signOut, authStatus } = useAuthenticator(); // Access signOut and authStatus
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut(); // Sign the user out
            router.push('/'); // Redirect to the homepage (or login page)
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };


    return (

        <header className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">MyApp</div>
            <nav className="space-x-4">
                <Link href="/" className="hover:text-gray-400">
                Home
                </Link>
                <Link href="/users">
              
                    User
               
                </Link>
     


                <Link href="/about" className="hover:text-gray-400">
                About
                </Link>
                <Link href="/contact" className="hover:text-gray-400">
                Contact
                </Link>

                {authStatus === 'authenticated' && (
                <button onClick={handleSignOut}>
                    Sign Out
                </button>
            )}
                {/* Add more links here */}
            </nav>
            </div>
        </div>
        </header>
    )
}

export default Header