"use client";

import { useState, useEffect } from "react";
import { Authenticator } from '@aws-amplify/ui-react';

import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "@/amplify/data/resource";
// import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import Link from 'next/link'

import { useRouter } from 'next/navigation'

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {

  const router = useRouter()
  const { signOut , user, authStatus } = useAuthenticator()

  // todo
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  // ===============================================

  // users
  const [users, setUsers] = useState<Array<Schema["Users"]["type"]>>([]);

  function createUsers() {
    client.models.Users.create({
      name: window.prompt("name"),
      email: window.prompt("email"),
      password: window.prompt("password"),
    });
  }

  function listUsers() {
    client.models.Users.observeQuery().subscribe({
      next: (data) => setUsers([...data.items]),
    });
  }


  function deleteUsers(id: string) {
    client.models.Users.delete({ id })
  }

  useEffect(() => {
    listUsers();
  }, []);


  useEffect(() => {
    if (authStatus === "authenticated") {
      router.push("/dashboard");
    }
  }, [authStatus, router]);
  

// console.log(authStatus)
  return (
    <main>
      <h1>Welcome to the App</h1>
      {authStatus === "authenticated" ? (
        <div>
          <h2>My Users</h2>
          <button onClick={createUsers}>+ New User</button>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name} ({user.email})
                <button onClick={() => deleteUsers(user.id)}>Delete</button>
              </li>
            ))}
          </ul>

          {/* You can add more functionality like displaying Todos, etc. */}

          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <Authenticator>
          <div>
            {/* Your login page, handled by Amplify Authenticator */}
          </div>
        </Authenticator>
      )}
    </main>
  );
}

