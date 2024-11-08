'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Link from 'next/link'
import { getUrl } from "aws-amplify/storage";


const client = generateClient<Schema>();
const PetsList = () => {

    const [pets, setPets] = useState<Array<Schema["Pets"]["type"]>>([]);
	const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(true); // Set loading state to true initially
	
  
    // Function to list pets from the DataStore
    function listPets() {
      	client.models.Pets.observeQuery().subscribe({
			next: async (data) => {

				const petsWithImages = [];

				for (const pet of data.items) {
					if (pet.profile_photo) {
						try {

							const imageUrl = await getUrl({ path: pet.profile_photo || "" }); 
							petsWithImages.push({ ...pet, profile_photo: imageUrl?.url?.href });
						} catch (error) {
							console.error(`Error fetching image for pet ${pet.id}:`, error);
							petsWithImages.push(pet); // Include pet even if image retrieval fails
						}
					} else {
						petsWithImages.push(pet);
					}
				}


				setPets(petsWithImages);  // Set the fetched pets
				setLoading(false);  // Set loading state to false after data is fetched
			},
			error: (error) => {
				console.error('Error fetching pets:', error);
				setLoading(false);  // Set loading to false in case of an error
			}
      	});
    }

    function deletePets(id: string) {
        client.models.Pets.delete({ id })
    }
  
    useEffect(() => {
      listPets(); // Trigger the pets query when the component mounts
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
					<h1 className="text-2xl font-bold mb-4">Pets List</h1>
				</div>
				<div>
					<Link href="/pets/add_update_pet">
							<button className="px-4 py-2 bg-blue-500 text-white font-semibold">
								Add Pet
								</button>
					</Link>
				</div>
			</div>
			<ul className="space-y-4">
				{pets.map((pet) => (
				<li key={pet.id} className="p-4 border rounded shadow flex justify-between items-center" style={{ display: 'flex' }}>
					<div className="flex items-start p-4 space-x-4 ">
						{/* Left side (Image with fixed width) */}
						<div className="flex-shrink-0 w-32 h-32">
							{pet.profile_photo ? (
							<img
								src={pet.profile_photo}
								alt={pet.pet_name}
								className="w-full h-full object-cover rounded-full"
							/>
							) : (
							<div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
								{/* Placeholder for image if not loaded */}
								<span className="text-gray-500">No Image</span>
							</div>
							)}
						</div>

						{/* Right side (Pet Data) */}
						<div className="flex-grow">
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							<span className="text-indigo-600">{pet.pet_name}</span>
							</h2>

							{/* Grid layout for pet data */}
							<div className="grid grid-cols-1 gap-6">

								{/* Pet info - first row (Species, Breed, Gender, Age in the same row) */}
								<div className="flex space-x-8">
									<div className="text-lg text-gray-600">
									Species: <span className="text-gray-800">{pet.species}</span>
									</div>
									<div className="text-lg text-gray-600">
									Breed: <span className="text-gray-800">{pet.breed}</span>
									</div>
									<div className="text-lg text-gray-600">
									Gender: <span className="text-gray-800">{pet.gender}</span>
									</div>
									<div className="text-lg text-gray-600">
									Age: <span className="text-gray-800">{pet.age}</span> years old
									</div>
								</div>

								{/* Pet info - second row */}
								<div className="flex space-x-8">
									<div className="text-lg text-gray-600">
									Nickname: <span className="text-gray-800">{pet.nickname}</span>
									</div>
									<div className="text-lg text-gray-600">
									Profile Bio: <span className="text-gray-800">{pet.profile_bio}</span>
									</div>
									<div className="text-lg text-gray-600">
										Added On: <span className="text-gray-800">{pet.added_date}</span>
									</div>
								</div>
							</div>
						</div>
					</div>



					<div>
						<Link href={`/pets/update_pet/${pet.id}`}>
							<button 
							className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
								Edit
							</button>
						</Link>
						<button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ml-3" onClick={() => deletePets(pet.id)} >
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

export default PetsList;