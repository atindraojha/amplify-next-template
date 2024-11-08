"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";


import Link from 'next/link'


const client = generateClient<Schema>();


interface Users {
  id: string;
  name: string;
  email: string;
}

const EditUserPage = () => {
    const { userId } = useParams();  // Get userId from URL (this will be part of the path like /user/[userId]/edit)
    const router = useRouter();
    console.log(userId)

    const [users, setUser] = useState<Users | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
      name: "",
      email: ""
    });

    useEffect(() => {
    // Fetch user details using the userId from URL
      const fetchUser = async () => {
        try {
          setLoading(true);
          if (userId) {
            const userIdString = Array.isArray(userId) ? userId[0] : userId;

            // Fetch user by ID
            const userData = await client.models.Users.get({ id: userIdString });  // Query user from DataStore by userId

            // console.log(userData.data)
            
            setUser(userData.data);
            setFormData({
              name: userData.data?.name || "",
              email: userData.data?.email || "",
            });
          }
          // console.log(formData)
        } catch (err) {
          console.error("Error fetching user:", err);
        } finally {
          setLoading(false);
        }
      };

      if (userId) {
        fetchUser();
      }
    }, [userId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!users) return;
      // console.log(users)
      try {
        setLoading(true);
        // Update the user in DataStore
        await client.models.Users.update({
          id: users.id,
          name: formData.name,
          email: formData.email
        });
  
        
        // Redirect back to user list or wherever you want
        router.push("/users");  // Adjust the route after successful update
      } catch (err) {
        console.error("Error updating user:", err);
      } finally {
        setLoading(false);
      }
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }


    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
        <div className="p-4  flex justify-between items-center">
          <div>
              <h1 className="text-2xl font-bold mb-4">Edit User</h1>
          </div>

          <div>
            <Link href="/users">
              <button className="px-4 py-2 bg-blue-500 text-white font-semibold">
                  Back
              </button>
            </Link>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-2 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>  

          <div className="mt-6">
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Changes
            </button>
          </div>

         
        </form>
      </div>
    );
  };

export default EditUserPage;
