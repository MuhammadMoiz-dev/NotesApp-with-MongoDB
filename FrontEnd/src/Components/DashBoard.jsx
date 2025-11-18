import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Save, X, Calendar } from 'lucide-react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [noteContent, setNoteContent] = useState('');
    const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
    const navigate = useNavigate();

    // Check authentication
    const checkAuth = async () => {
        try {
            const response = await fetch(`${serverURL}/me`, {
                credentials: 'include'
            });
            if (!response.ok) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            navigate('/login');
        }
    };

    // Fetch all notes
    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${serverURL}/notes`, {
                credentials: 'include'
            });

            if (response.status === 401) {
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            setNotes(data.notes || []);
            setFilteredNotes(data.notes || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
            if (error.message !== 'Failed to fetch notes') {
                alert('Please login to access your notes');
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Search functionality
    useEffect(() => {
        const filtered = notes.filter(note =>
            note.Note.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredNotes(filtered);
    }, [searchTerm, notes]);

    // Create new note
    const createNote = async () => {
        if (!noteContent.trim()) {
            alert('Please enter note content');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${serverURL}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    Note: noteContent
                })
            });

            if (response.status === 401) {
                navigate('/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create note');
            }

            await fetchNotes();
            setNoteContent('');
        } catch (error) {
            console.error('Error creating note:', error);
            alert(error.message || 'Error creating note');
        } finally {
            setIsLoading(false);
        }
    };

    // Update note
    const updateNote = async () => {
        if (!noteContent.trim()) {
            alert('Please enter note content');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${serverURL}/notes/${currentNote._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    Note: noteContent
                })
            });

            if (response.status === 401) {
                navigate('/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update note');
            }

            await fetchNotes();
            resetForm();
        } catch (error) {
            console.error('Error updating note:', error);
            alert(error.message || 'Error updating note');
        } finally {
            setIsLoading(false);
        }
    };

    // Delete note
    const deleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${serverURL}/notes/${noteId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.status === 401) {
                navigate('/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete note');
            }

            await fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
            alert(error.message || 'Error deleting note');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateNote();
        } else {
            createNote();
        }
    };

    // Reset form
    const resetForm = () => {
        setNoteContent('');
        setIsEditing(false);
        setCurrentNote(null);
    };

    // Edit note
    const handleEdit = (note) => {
        setNoteContent(note.Note);
        setIsEditing(true);
        setCurrentNote(note);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Load notes on component mount
    useEffect(() => {
        checkAuth();
        fetchNotes();
    }, []);

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
                        <p className="text-gray-600 mt-2">Organize your thoughts and ideas</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Sidebar - Note Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                                    {isEditing ? 'Edit Note' : 'Create New Note'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Note Content */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Note
                                        </label>
                                        <textarea
                                            value={noteContent}
                                            onChange={(e) => setNoteContent(e.target.value)}
                                            rows="8"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Write your note here..."
                                            required
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                                        >
                                            {isLoading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {isEditing ? 'Update' : 'Create'}
                                                </>
                                            )}
                                        </button>

                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Side - Notes List */}
                        <div className="lg:col-span-2">
                            {/* Search Bar */}
                            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        placeholder="Search notes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Notes Grid */}
                            {isLoading ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : filteredNotes.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <Plus className="h-12 w-12 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
                                    <p className="text-gray-500">
                                        {searchTerm ? 'Try adjusting your search terms' : 'Create your first note to get started'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredNotes.map((note) => (
                                        <div
                                            key={note._id}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
                                        >
                                            {/* Note Header */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="inline-flex items-center text-xs text-gray-500">
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            {formatDate(note.createdAt)}
                                                        </span>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleEdit(note)}
                                                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteNote(note._id)}
                                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Note Content */}
                                                    <p className="text-gray-800 whitespace-pre-wrap">
                                                        {note.Note}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;