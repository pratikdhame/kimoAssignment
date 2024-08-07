import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CourseOverview = () => {
  const { courseName } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await axios.get(`http://localhost:8000/courses/${courseName}`);
      setCourse(response.data);
    };

    fetchCourse();
  }, [courseName]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{course.name}</h1>
      <p>{course.description}</p>
      <div className="mt-4">
        <strong>Total Rating: </strong>{course.total_rating}
      </div>
      <h2 className="text-xl font-bold mt-4">Chapters</h2>
      <ul>
        {course.chapters.map((chapter) => (
          <li key={chapter.name} className="mb-2 p-2 border rounded">
            <a href={`/courses/${courseName}/chapters/${chapter.name}`} className="text-blue-500">
              {chapter.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseOverview;
