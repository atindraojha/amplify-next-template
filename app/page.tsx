"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import Link from 'next/link'

import { useRouter } from 'next/navigation'

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {

  const { signOut } = useAuthenticator()

  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  const router = useRouter()

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }


  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li 
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>

      <button type="button" onClick={() => router.push('/dashboard')}>
        Dashboard
      </button>

      <Link href="/dashboard">Dashboard</Link>
    </main>
  );
}
