import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [sortMode, setSortMode] = useState('alphabetical');
  const [domainFilter, setDomainFilter] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axios.get('http://localhost:8000/courses', {
        params: {
          sort_by: sortMode,
          domain: domainFilter
        }
      });
      setCourses(response.data);
    };

    fetchCourses();
  }, [sortMode, domainFilter]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <div className="mb-4">
        <label className="block mb-2">Sort By:</label>
        <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} className="p-2 border rounded">
          <option value="alphabetical">Alphabetical</option>
          <option value="date">Date</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Filter by Domain:</label>
        <input
          type="text"
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <ul>
        {courses.map((course) => (
          <li key={course.name} className="mb-2 p-2 border rounded">
            <a href={`/courses/${course.name}`} className="text-blue-500">
              {course.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
