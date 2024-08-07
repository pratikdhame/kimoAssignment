import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CourseList from './components/CourseList';
import CourseOverview from './components/CourseOverview';
import ChapterDetail from './components/ChapterDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/:courseName" element={<CourseOverview />} />
        <Route path="/courses/:courseName/chapters/:chapterName" element={<ChapterDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
// In the App component, we have set up the routes for the CourseList, CourseOverview, and ChapterDetail components using the Routes and Route components from react-router-dom. The Route component takes two props: path and element. The path prop specifies the URL path for the route, and the element prop specifies the component to render when the path matches.
