import React, { useState } from 'react';
import axios from 'axios';

const SummarizeText = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const token = localStorage.getItem("token"); 
    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const handleSummarize = async () => {
        if (!text) {
            alert('Please enter some text to summarize.');
            return;
        }

        if (!token) {
            alert('You are not authenticated. Please log in.');
            return;
        }

        setLoading(true);
        setError('');
        setSummary('');

        try {
            console.log('Text to summarize:', text); // Log the text being sent for summarization

            // Send the request to your Spring Boot API with the Authorization token
            const response = await axios.post('http://localhost:8080/notes/summarize', 
                { text },  // Send text as part of an object
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`  // Add the Bearer token here
                    }
                }
            );

            if (response.data) {
                setSummary(response.data);
            } else {
                setError('Received empty response from server');
            }
        } catch (error) {
            console.error('There was an error summarizing the text!', error);
            setError('There was an error summarizing the text. Please try again.');
        } finally {
            setLoading(false);
        }
    };





    return (
        <div>
            <h2>Text Summarizer</h2>
            <textarea
                value={text}
                onChange={handleInputChange}
                rows="6"
                cols="50"
                placeholder="Enter your text here..."
            />
            <br />
            <button onClick={handleSummarize} disabled={loading}>
                {loading ? 'Summarizing...' : 'Summarize'}
            </button>
            {summary && (
                <div>
                    <h3>Summary:</h3>
                    <p>{summary}</p>
                </div>
            )}
            {error && (
                <div style={{ color: 'red' }}>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default SummarizeText;
