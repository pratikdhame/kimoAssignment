import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChapterDetail = () => {
  const { courseName, chapterName } = useParams();
  const [chapter, setChapter] = useState(null);
  const [rating, setRating] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const fetchChapter = async () => {
      const response = await axios.get(`http://localhost:8000/courses/${courseName}/chapters/${chapterName}`);
      setChapter(response.data);
    };

    fetchChapter();
  }, [courseName, chapterName]);

  const submitRating = async () => {
    if (rating === '') {
      setConfirmationMessage('Please select a rating.');
      return;
    }
    try {
      await axios.post(`http://localhost:8000/courses/${courseName}/chapters/${chapterName}/rate`, { rating });
      setConfirmationMessage('Rating submitted successfully.');
      setRating(''); // Reset rating after submission
    } catch (error) {
      setConfirmationMessage('Failed to submit rating.');
    }
  };

  if (!chapter) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{chapter.name}</h1>
      <p>{chapter.text}</p>
      <div className="mt-4">
        <label className="block mb-2">Rate this Chapter:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="p-2 border rounded">
          <option value="">Select</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
        </select>
        <button onClick={submitRating} className="ml-2 p-2 bg-blue-500 text-white rounded">Submit</button>
      </div>
      {confirmationMessage && (
        <div className="mt-4 p-2 border rounded bg-green-100 text-green-700">
          {confirmationMessage}
        </div>
      )}
    </div>
  );
};

export default ChapterDetail;
