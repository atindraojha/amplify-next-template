'use client';


import { useRouter, useParams } from 'next/navigation';
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Link from 'next/link'
import { useState, useEffect } from "react";

import { getUrl, remove, uploadData } from "aws-amplify/storage";
// file uplaod

const client = generateClient<Schema>();

interface Pets {
    id: string;
    pet_name: string;
    species: string;
    breed: string;
    age: number;
    nickname: string;
    profile_photo: string;
    profile_bio: string;
    // added_date: Date;
    gender: 'Male' | 'Female' | 'Other';
}

export default function PetUpdatePage() {

    const { petId } = useParams();  // Get userId from URL (this will be part of the path like /user/[userId]/edit)
    const router = useRouter();
    const [pets, setPet] = useState<Pets | null>(null);
    const [new_profile_photo, setProfilePhoto] = useState<File | null>(null);  
    const [oldFileName, oldPic] = useState<string | null>(null);  
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        pet_name : "",
        breed : "",
        species : "",
        age : 0,
        nickname : "",
        profile_photo : "",
        profile_bio : "",
        gender : ""
    });

    useEffect(() => {
      // Fetch user details using the userId from URL
        const fetchPet = async () => {
            try {
                setLoading(true);
                if (petId) {
                    const petIdString = Array.isArray(petId) ? petId[0] : petId;
                    // Fetch pet by ID
                    const petData:any = await client.models.Pets.get({ id: petIdString });  // Query pet from DataStore by petId
                    if (petData.data?.profile_photo) {
                        oldPic(petData.data.profile_photo || '')
                        try {
                            const imageUrl = await getUrl({ path: petData.data.profile_photo || "" }); 
                            console.log(imageUrl)
                            petData.data.profile_photo = imageUrl.url.href
                        } catch (error) {
                            console.error(`Error fetching image for pet `, error);
                
                        }
                    }
                    setPet(petData.data);

                    setFormData({
                        pet_name : petData.data?.pet_name || "",
                        breed : petData.data?.breed || "",
                        species : petData.data?.species || "",
                        age : petData.data?.age || 0,
                        nickname : petData.data?.nickname || "",
                        profile_photo : petData.data?.profile_photo || "",
                        profile_bio : petData.data?.profile_bio || "",
                        gender : petData.data?.gender || ""

                    });
                }

            } catch (err) {
                console.error("Error fetching pet:", err);
            } finally {
                setLoading(false);
            }
        };
  
        if (petId) {
            fetchPet();
        }
    }, [petId]);

    const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({...prevFormData,[name]: value,}));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];  // The `?` is used to handle cases where `files` may be null
      if (file) {
          setProfilePhoto(file);
      }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pets) return;
        try {
            setLoading(true);
        
            let new_file_path;

            if(new_profile_photo){
                if (oldFileName) {
                    const oldImageUrl = await getUrl({ path: oldFileName || ""}); 
                    if(oldImageUrl){
                        await remove({ 
                            path: oldFileName,
                        });
                    }
                    console.log(`Old file ${oldImageUrl} removed from S3.`);            
                }
                const upload_result = await uploadData({
                    path: `storage_files/${new_profile_photo?.name}`,
                    data: new_profile_photo,
                }).result;
                new_file_path = upload_result.path
  
            }

             // Update the user in DataStore
            await client.models.Pets.update({
                id: pets.id,
                pet_name: formData.pet_name,
                breed: formData.breed,
                species: formData.species,
                age: formData.age,
                nickname: formData.nickname,
                profile_photo: new_file_path,
                profile_bio: formData.profile_bio,
                gender: formData.gender as "Male" | "Female" | "Other" | null,  
            });
    
          
            // Redirect back to user list or wherever you want
            router.push("/pets");  // Adjust the route after successful update
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
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <div className="p-4  flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Update Pet</h1>
                </div>
                <div>
                    <Link href="/pets">
                    <button className="px-4 py-2 bg-blue-500 text-white font-semibold">
                        Back
                    </button>
                    </Link>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="pet_name" className="block text-sm font-medium text-gray-700">Pet Name</label>
                    <input
                        type="text"
                        id="pet_name"
                        name="pet_name"
                        value={formData.pet_name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div>
                    <label htmlFor="species" className="block text-sm font-medium text-gray-700">Species</label>
                    <input
                    type="text"
                    id="species"
                    name="species"
                    value={formData.species}
                    onChange={handleInputChange}
                    required
                    
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                <div>
                    <label htmlFor="breed" className="block text-sm font-medium text-gray-700">breed</label>
                    <input
                    type="text"
                    id="breed"
                    name="breed"
                    required
                    value={formData.breed}
                    onChange={handleInputChange}
                    
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <select 
                    id="gender" 
                    name="gender" 
                    value={formData.gender}
                    onChange={handleInputChange}

                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">age</label>
                    <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div>
                    <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">nickname</label>
                    <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    required
                    value={formData.nickname}
                    onChange={handleInputChange}
                    
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <div>
                    <label htmlFor="profile_photo" className="block text-sm font-medium text-gray-700">profile_photo</label>
                    <input
                    type="file"
                    id="profile_photo"
                    name="profile_photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {formData.profile_photo ? (
                    <img
                        src={formData.profile_photo}
                        alt={formData.pet_name}
        
                        className="w-full object-cover"
                    />
                    ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                        {/* Placeholder for image if not loaded */}
                        <span className="text-gray-500">No Image</span>
                    </div>
                    )}


                </div>
                <div>
                    <label htmlFor="profile_bio" className="block text-sm font-medium text-gray-700">profile_bio</label>
                    <input
                    type="text"
                    id="profile_bio"
                    name="profile_bio"
                    required
                    value={formData.profile_bio}
                    onChange={handleInputChange}
                    
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
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
}
