import Link from "next/link";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation'; // For redirecting after sign-out

import '../../styles/global.css'; 

import { FaHome, FaUser, FaCog, FaUserCircle } from "react-icons/fa";


const Sidebar = () => {
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
        <div className="flex flex-col w-64 bg-gray-800 text-white h-screen">
        <div className="p-5">
            <h2 className="text-2xl font-bold">My App</h2>
        </div>
        <div className="flex flex-col flex-grow">
            <ul className="space-y-2 p-4">
            <li>
                <Link href="/dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded-md">
                
                    <FaHome className="mr-3" /> Dashboard
                
                </Link>
            </li>
            <li>
                <Link href="/users" className="flex items-center p-2 hover:bg-gray-700 rounded-md">
                
                    <FaUser className="mr-3" /> Users
                
                </Link>
            </li>
            <li>
                <Link href="/pets" className="flex items-center p-2 hover:bg-gray-700 rounded-md">
                
                    <FaCog className="mr-3" /> Pets
                
                </Link>
            </li>
            <li>
                <Link href="/profile" className="flex items-center p-2 hover:bg-gray-700 rounded-md" onClick={handleSignOut} >
                
                    <FaUserCircle className="mr-3" /> Signout
                
                </Link>
            </li>
            </ul>
        </div>
        </div>
    );
};

export default Sidebar;
