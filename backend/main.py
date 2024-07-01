from fastapi import FastAPI, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from bson import ObjectId
from typing import List, Optional
from uuid import uuid4

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)

db = client["bookstore"]
collection = db["books"]

class Book(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    title: str
    description: str
    cover: str
    author: str
    year: int

    class Config:
        populate_by_name = True
        from_attributes = True

class BookCreate(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    title: str
    description: str
    cover: str
    author: str
    year: int

@app.post("/books/", response_model=Book)
async def create_book(book: BookCreate):
    book_dict = book.dict()
    book_dict["_id"] = str(uuid4())
    result = await db["books"].insert_one(book_dict)
    book_dict["id"] = str(result.inserted_id)
    return Book(**book_dict)


@app.get("/books/{book_id}", response_model=Book)
async def get_book(book_id: str):
    book = await collection.find_one({"_id": ObjectId(book_id)})
    if book:
        book["_id"] = str(book["_id"])
        if "year" not in book:
            book["year"] = 0
        return Book(**book)
    else:
        raise HTTPException(status_code=404, detail="Book not found")

@app.get("/books/", response_model=dict)
async def get_books(skip: int = Query(0, ge=0), limit: int = Query(10, le=100)):
    total_books = await collection.count_documents({})
    books_cursor = collection.find().skip(skip).limit(limit)
    books = await books_cursor.to_list(length=limit)
    return {
        "books": [
            Book(
                id=str(book["_id"]),
                title=book.get("title", "Unknown Title"),
                description=book.get("description", "No description"),
                cover=book.get("cover", ""),
                author=book.get("author", "Unknown Author"),
                year=book.get("year", 0)
            )
            for book in books
        ],
        "totalPages": (total_books // limit) + (1 if total_books % limit != 0 else 0)
    }