'use client'
import { useState } from 'react';
import axios from 'axios';


export default function Home() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post('/api/geminiaicall', {
                prompt,
            });

            setResponse(res.data.text);
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            setResponse('Something went wrong.');
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <h1>Gemini AI Agent</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    cols={50}
                />
                <br />
                <button type="submit" className='bg-cyan-500 px-2 rounded-2xl cursor-pointer '>Send</button>
            </form>
            <h3>Response:</h3>
            <p>{response}</p>
        </div>
    );
}
