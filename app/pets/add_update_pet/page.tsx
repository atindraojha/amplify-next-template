'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Link from 'next/link'

import { getUrl, remove, uploadData } from "aws-amplify/storage";
// file uplaod

const client = generateClient<Schema>();

export default function PetAddPage() {
    const [pet_name, setPetName] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | null>(null);
    const [age, setAge] = useState<number>(0)
    const [nickname, setNickname] = useState('');
    const [profile_photo, setProfilePhoto] = useState<File | null>(null);  
    const [profile_bio, setProfileBio] = useState('');
    const [added_date, setAddedDate] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];  // The `?` is used to handle cases where `files` may be null
    if (file) {
        console.log(file);
        setProfilePhoto(file);
    }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');  // Reset the error state
        setSuccess(false);  // Reset success state

        // Simple validation before calling the backend
        if (!pet_name) {
            setError('Please fill out all fields.');
            return;
        }

        if (!profile_photo) {
            setError('Please select an image to upload');
            return;
          }

        console.log(profile_photo)

        try {

            const fileName = `users/${pet_name}_${Date.now()}_${profile_photo?.name}`;
            console.log(fileName)

            const upload_result = await uploadData({
                path: `storage_files/${profile_photo?.name}`,
                data: profile_photo,
              }).result;


           
            // Create a new Pet instance in DataStore
            client.models.Pets.create({
                pet_name: pet_name,
                species: species,
                breed: breed,
                gender: gender,
                age: age,
                nickname: nickname,
                profile_photo: upload_result.path,
                profile_bio: profile_bio,
                added_date: added_date
            });

            // Save the pets to the DataStore

            // If successful, show success message
            setSuccess(true);

            // Optionally redirect after successful pets creation
            router.push('/pets');
        } 
        catch (error) {
            console.error(error);
            setError('Error creating pets. Please try again.');
        }
    };


    return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
       <div className="p-4  flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold mb-4">Add Pet</h1>
        </div>
      <div>
          <Link href="/pets">
            <button className="px-4 py-2 bg-blue-500 text-white font-semibold">
                Back
            </button>
          </Link>
            </div>
      </div>
      
      {/* Error Message */}
      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

      {/* Pet Add Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="pet_name" className="block text-sm font-medium text-gray-700">Pet Name</label>
          <input
            type="text"
            id="pet_name"
            name="pet_name"
            value={pet_name}
            
            onChange={(e) => setPetName(e.target.value)}
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
            value={species}
            required
            onChange={(e) => setSpecies(e.target.value)}
            
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700">breed</label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={breed}
            required
            onChange={(e) => setBreed(e.target.value)}
            
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
        <select 
        id="gender" 
        name="gender" 
        value={gender ?? ''} 
        onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other' | null)}  
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
            value={age}
            required
            onChange={(e) => setAge(parseInt(e.target.value, 0))}
            
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">nickname</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            required
            onChange={(e) => setNickname(e.target.value)}
            
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
            required
            onChange={handleFileChange}
            // onInput={setProfilePhoto(e.target.value)}
            
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          {/* other uploader */}
          {/* <FileUploader
            acceptedFileTypes={['image/*']}
            path="public/"
            maxFileCount={1}
            isResumable
            /> */}
            {/* other uploader */}

        </div>
        <div>
          <label htmlFor="profile_bio" className="block text-sm font-medium text-gray-700">profile_bio</label>
          <input
            type="text"
            id="profile_bio"
            name="profile_bio"
            value={profile_bio}
            required
            onChange={(e) => setProfileBio(e.target.value)}
            
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
          <label htmlFor="added_date" className="block text-sm font-medium text-gray-700">added_date</label>
          <input
            type="date"
            id="added_date"
            name="added_date"
            value={added_date}
            required
            onChange={(e) => setAddedDate(e.target.value)}
            
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        

        <div className="mt-6">
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Pet
          </button>
        </div>
      </form>
    </div>
  );
}
