import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import CreateBook from './CreateBook';

interface Book {
  _id: string;
  title: string;
  description: string;
  cover: string;
  author: string;
  year: number;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для открытия и закрытия модального окна

  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/books/?skip=${(page - 1) * 10}&limit=10`);
      console.log('Response data:', response.data);
      setBooks(response.data.books || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (error) {
      setError('Error fetching books: ' + (error as Error).message);
      console.error('Error fetching books:', error);
    }
  }, [page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const paginatedButtons = useMemo(() => (
    Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setPage(i + 1)}
        className={`px-4 py-2 mx-1 border ${i + 1 === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
      >
        {i + 1}
      </button>
    ))
  ), [totalPages, page]);

  return (
    <div className="p-4">
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={() => setIsModalOpen(true)} className="mb-4 py-2 px-4 bg-green-500 text-white rounded">Add New Book</button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="bg-white p-4 shadow-lg rounded-lg transition transform hover:scale-105 hover:shadow-2xl">
              <img src={book.cover} alt={book.title} className="w-full h-64 object-contain rounded-t-lg" />
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-800">{book.title}</h2>
                <p className="mt-2 text-gray-600">{book.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No books found.</p>
        )}
      </div>
      <div className="flex justify-center mt-4">
        {paginatedButtons}
      </div>
      <CreateBook isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} onBookCreated={fetchBooks} />
    </div>
  );
};

export default BookList;
