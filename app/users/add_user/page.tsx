'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Link from 'next/link'

const client = generateClient<Schema>();

export default function UserAddPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');  // Reset the error state
    setSuccess(false);  // Reset success state

    // Simple validation before calling the backend
    if (!name || !email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      // Create a new User instance in DataStore
      client.models.Users.create({
      name: name,
      email: email,
      password: password,
    });

      // Save the user to the DataStore

      // If successful, show success message
      setSuccess(true);

      // Optionally redirect after successful user creation
      router.push('/users');
    } catch (error) {
      console.error(error);
      setError('Error creating user. Please try again.');
    }
  };


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
       <div className="p-4  flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold mb-4">Add User</h1>
        </div>
      <div>
          <Link href="/users">
            <button className="px-4 py-2 bg-blue-500 text-white font-semibold">
                Back
            </button>
          </Link>
            </div>
      </div>
      
      {/* Error Message */}
      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

      {/* User Add Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="mt-6">
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add User
          </button>
        </div>
      </form>
    </div>
  );
}
