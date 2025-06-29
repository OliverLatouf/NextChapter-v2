import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Save, 
  X, 
  Upload,
  FileText,
  Clock,
  Users,
  DollarSign,
  Star
} from 'lucide-react';

const StoryManagement = ({ onLogAction }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with real Supabase queries
  const mockStories = [
    {
      id: '1',
      title: 'The Digital Detective',
      author: 'Sarah Chen',
      description: 'A cyberpunk mystery set in 2045 where AI and humans collide in unexpected ways.',
      status: 'published',
      featured: true,
      total_chapters: 15,
      current_chapter: 8,
      price: 1.00,
      subscribers: 234,
      revenue: 234,
      created_at: '2024-12-15',
      cover_image: '/api/placeholder/200/300'
    },
    {
      id: '2',
      title: 'Moonbase Chronicles',
      author: 'Dr. Marcus Webb',
      description: 'Life on the first permanent lunar colony faces unexpected challenges.',
      status: 'published',
      featured: false,
      total_chapters: 20,
      current_chapter: 12,
      price: 1.00,
      subscribers: 189,
      revenue: 189,
      created_at: '2024-12-10',
      cover_image: '/api/placeholder/200/300'
    },
    {
      id: '3',
      title: 'The Last Library',
      author: 'Emma Rodriguez',
      description: 'In a post-apocalyptic world, one librarian protects humanity\'s knowledge.',
      status: 'draft',
      featured: false,
      total_chapters: 12,
      current_chapter: 0,
      price: 1.00,
      subscribers: 0,
      revenue: 0,
      created_at: '2024-12-20',
      cover_image: '/api/placeholder/200/300'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStories(mockStories);
      setLoading(false);
    }, 1000);
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: 1.00,
    total_chapters: 1,
    status: 'draft',
    featured: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingStory) {
        // Update existing story
        const updatedStories = stories.map(story => 
          story.id === editingStory.id 
            ? { ...story, ...formData, updated_at: new Date().toISOString() }
            : story
        );
        setStories(updatedStories);
        onLogAction?.('update_story', 'story', editingStory.id, formData);
      } else {
        // Create new story
        const newStory = {
          id: Date.now().toString(),
          ...formData,
          subscribers: 0,
          revenue: 0,
          current_chapter: 0,
          created_at: new Date().toISOString(),
          cover_image: '/api/placeholder/200/300'
        };
        setStories(prev => [...prev, newStory]);
        onLogAction?.('create_story', 'story', newStory.id, formData);
      }
      
      setShowModal(false);
      setEditingStory(null);
      setFormData({
        title: '',
        author: '',
        description: '',
        price: 1.00,
        total_chapters: 1,
        status: 'draft',
        featured: false
      });
    } catch (error) {
      console.error('Error saving story:', error);
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      author: story.author,
      description: story.description,
      price: story.price,
      total_chapters: story.total_chapters,
      status: story.status,
      featured: story.featured
    });
    setShowModal(true);
  };

  const handleDelete = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      setStories(prev => prev.filter(story => story.id !== storyId));
      onLogAction?.('delete_story', 'story', storyId);
    }
  };

  const toggleFeatured = async (storyId) => {
    const updatedStories = stories.map(story => 
      story.id === storyId 
        ? { ...story, featured: !story.featured }
        : story
    );
    setStories(updatedStories);
    onLogAction?.('toggle_featured', 'story', storyId);
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Story Management</h2>
          <p className="text-gray-600">Manage your story catalog and chapters</p>
        </div>
        <button
          onClick={() => {
            setEditingStory(null);
            setFormData({
              title: '',
              author: '',
              description: '',
              price: 1.00,
              total_chapters: 1,
              status: 'draft',
              featured: false
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add New Story
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <input
          type="text"
          placeholder="Search stories by title or author..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <div key={story.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <img
                src={story.cover_image}
                alt={story.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
                  {story.status}
                </span>
                {story.featured && (
                  <button
                    onClick={() => toggleFeatured(story.id)}
                    className="bg-yellow-100 text-yellow-800 p-1 rounded-full"
                  >
                    <Star className="w-3 h-3 fill-current" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-lg">{story.title}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(story)}
                    className="p-1 text-gray-600 hover:text-blue-600"
                    title="Edit story"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="p-1 text-gray-600 hover:text-red-600"
                    title="Delete story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">by {story.author}</p>
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{story.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>{story.current_chapter}/{story.total_chapters} chapters</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{story.subscribers} subscribers</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>${story.revenue}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{new Date(story.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => toggleFeatured(story.id)}
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium ${
                    story.featured
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {story.featured ? 'Featured' : 'Feature'}
                </button>
                <button
                  className="flex-1 py-2 px-3 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200"
                  onClick={() => window.open(`/admin/stories/${story.id}/chapters`, '_blank')}
                >
                  Manage Chapters
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first story.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Your First Story
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingStory ? 'Edit Story' : 'Create New Story'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Chapters
                  </label>
                  <input
                    type="number"
                    name="total_chapters"
                    value={formData.total_chapters}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Featured story
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingStory ? 'Update Story' : 'Create Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryManagement;
