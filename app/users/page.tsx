'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Link from 'next/link'

const client = generateClient<Schema>();
const UsersList = () => {

    const [users, setUsers] = useState<Array<Schema["Users"]["type"]>>([]);
    const [loading, setLoading] = useState(true); // Set loading state to true initially
  
    // Function to list users from the DataStore
    function listUsers() {
      client.models.Users.observeQuery().subscribe({
        next: (data) => {
          setUsers(data.items);  // Set the fetched users
          setLoading(false);  // Set loading state to false after data is fetched
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          setLoading(false);  // Set loading to false in case of an error
        }
      });
    }

    
    function deleteUsers(id: string) {
        client.models.Users.delete({ id })
    }
  
    useEffect(() => {
      listUsers(); // Trigger the users query when the component mounts
    }, []); // Empty dependency array to run this effect only once on mount
  
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      );
    }
  

  return (
    <div className="container mx-auto p-4">
        <div className="p-4  flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold mb-4">Users List</h1>
            </div>
            <div>
                <Link href="/users/add_user">
                        <button className="px-4 py-2 bg-blue-500 text-white font-semibold">
                            Add User
                            </button>
                </Link>
            </div>
        </div>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="p-4 border rounded shadow flex justify-between items-center" style={{ display: 'flex' }}>
            <div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
            </div>


            <div>
            <Link href={`/users/edit_user/${user.id}`}>
                <button 
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Edit
                </button>
            </Link>
            <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-3" onClick={() => deleteUsers(user.id)} >
                Delete
            </button>
            </div>
            {/* You can add more user details here */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;