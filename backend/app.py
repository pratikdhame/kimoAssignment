from fastapi import FastAPI, HTTPException, Query, Path, Body
from pymongo import MongoClient
from typing import List, Optional
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this as necessary
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Atlas connection URL
MONGODB_URL = os.getenv("MONGODB_URL")

client = MongoClient(MONGODB_URL)
db = client.coursesDB1
courses_collection = db.courses

# Pydantic models
class Chapter(BaseModel):
    name: str
    text: str

class Course(BaseModel):
    name: str
    date: int
    description: str
    domain: List[str]
    chapters: List[Chapter]
    total_rating: Optional[int] = 0

class CourseOverview(BaseModel):
    name: str
    date: int
    description: str
    domain: List[str]
    total_rating: Optional[int] = 0

class Rating(BaseModel):
    rating: str

# Helper function to sort courses
def sort_courses(courses, sort_by):
    if sort_by == 'alphabetical':
        return sorted(courses, key=lambda x: x['name'])
    elif sort_by == 'date':
        return sorted(courses, key=lambda x: x['date'], reverse=True)
    elif sort_by == 'rating':
        return sorted(courses, key=lambda x: x.get('total_rating', 0), reverse=True)
    return courses

@app.get('/')
def hello_world():
    return "Hello,World"

@app.get("/courses", response_model=List[CourseOverview])
async def get_courses(
    sort_by: str = Query('alphabetical', enum=['alphabetical', 'date', 'rating']),
    domain: Optional[str] = None
):
    query = {}
    if domain:
        query['domain'] = domain
    courses = list(courses_collection.find(query))
    sorted_courses = sort_courses(courses, sort_by)
    return [CourseOverview(**course) for course in sorted_courses]

@app.get("/courses/{course_name}", response_model=Course)
async def get_course_overview(course_name: str = Path(..., description="The name of the course")):
    course = courses_collection.find_one({"name": course_name})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return Course(**course)

@app.get("/courses/{course_name}/chapters/{chapter_name}", response_model=Chapter)
async def get_chapter_info(course_name: str, chapter_name: str):
    course = courses_collection.find_one({"name": course_name})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    chapter = next((ch for ch in course['chapters'] if ch['name'] == chapter_name), None)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return Chapter(**chapter)

@app.post("/courses/{course_name}/chapters/{chapter_name}/rate")
async def rate_chapter(course_name: str, chapter_name: str, rating: Rating):
    course = courses_collection.find_one({"name": course_name})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    chapter = next((ch for ch in course['chapters'] if ch['name'] == chapter_name), None)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    if rating.rating not in ['positive', 'negative']:
        raise HTTPException(status_code=400, detail="Invalid rating value. Must be 'positive' or 'negative'.")

    if 'ratings' not in course:
        course['ratings'] = {}
    if chapter_name not in course['ratings']:
        course['ratings'][chapter_name] = {'positive': 0, 'negative': 0}

    if rating.rating == 'positive':
        course['ratings'][chapter_name]['positive'] += 1
    else:
        course['ratings'][chapter_name]['negative'] += 1

    # Aggregate ratings for the course
    positive_ratings = sum(r['positive'] for r in course['ratings'].values())
    negative_ratings = sum(r['negative'] for r in course['ratings'].values())
    course['total_rating'] = positive_ratings - negative_ratings

    courses_collection.update_one({"name": course_name}, {"$set": course})
    return {"message": "Rating submitted successfully"}
