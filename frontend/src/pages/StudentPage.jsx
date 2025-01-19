import React, { useState } from 'react';
import axios from 'axios';
import '../styles/StudentPage.css';
import smiley from '../assets/smiley.png';
import frowny from '../assets/frowny.png';
import surprised from '../assets/surprised.png';
import confused from '../assets/confused.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentPage = () => {
  const [accessCode, setAccessCode] = useState('');
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');

  const emotionImages = { smiley, frowny, surprised, confused };

  const fetchActivity = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/activities/access-code/${accessCode}`);
      setActivity(response.data);
      setError('');
    } catch (error) {
      setError('Invalid access code. Please try again.');
      setActivity(null);
    }
  };
  
  const submitFeedback = async () => {
    if (!selectedEmotion) {
      toast.error('Please select an emotion before submitting.');
      return;
    }
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/feedback`, {
        activityId: activity.id,
        emotion: selectedEmotion,
      });
      toast.success('Feedback submitted successfully!');
      setSelectedEmotion('');
    } catch (error) {
      toast.error('Failed to submit feedback.');
    }
  };
  
  return (
    <div className="student-page">
      <header className="header">
        <h1>Student Feedback Portal</h1>
      </header>

      {!activity && (
        <form onSubmit={fetchActivity} className="access-code-form">
          <h2>Enter Your Access Code</h2>
          <input
            type="text"
            placeholder="Enter Access Code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}

      {activity && (
        <div className="activity-container">
          <h2>Activity Details</h2>
          <div className="activity-details">
            <p><strong>Description:</strong> {activity.description}</p>
            <p><strong>Start Time:</strong> {new Date(activity.startTime).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(activity.endTime).toLocaleString()}</p>
          </div>

          <h3>Submit Your Feedback</h3>
          <div className="emoticons">
            {Object.keys(emotionImages).map((emotion) => (
              <button
                key={emotion}
                className={`emotion-button ${selectedEmotion === emotion ? 'selected' : ''}`}
                onClick={() => submitFeedback(emotion)}
              >
                <img src={emotionImages[emotion]} alt={emotion} />
              </button>
            ))}
          </div>

          <ToastContainer />
        </div>
      )}
    </div>
  );
};

export default StudentPage;