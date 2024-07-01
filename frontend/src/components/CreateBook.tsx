import { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

interface CreateBookProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onBookCreated: () => void;
}

const CreateBook: React.FC<CreateBookProps> = ({ isOpen, onRequestClose, onBookCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/books/', { title, description, cover, author, year });
    onBookCreated(); 
    onRequestClose(); 
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create Book Modal"
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <div className="relative p-4 border rounded bg-white max-w-lg w-full">
        <button onClick={onRequestClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Create a New Book</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            placeholder="Cover Image URL"
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="number"
            value={year === '' ? '' : year.toString()}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="w-full p-2 border rounded mb-2"
          />
          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">Create</button>
        </form>
      </div>
    </Modal>
  );
};

export default CreateBook;
