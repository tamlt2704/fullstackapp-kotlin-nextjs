'use client';

import { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

interface TimelineImage {
  id: string;
  url: string;
  caption: string;
  timestamp: Date;
  comments: Comment[];
}

const mockImages: TimelineImage[] = [
  {
    id: '1',
    url: 'https://picsum.photos/600/400?random=1',
    caption: 'Beautiful sunset at the beach',
    timestamp: new Date('2024-12-13T18:30:00'),
    comments: [
      { id: '1', author: 'John', text: 'Amazing view!', timestamp: new Date('2024-12-13T19:00:00') },
      { id: '2', author: 'Sarah', text: 'Love the colors', timestamp: new Date('2024-12-13T19:15:00') }
    ]
  },
  {
    id: '2',
    url: 'https://picsum.photos/600/400?random=2',
    caption: 'Mountain hiking adventure',
    timestamp: new Date('2024-12-12T14:20:00'),
    comments: [
      { id: '3', author: 'Mike', text: 'Where is this?', timestamp: new Date('2024-12-12T15:00:00') }
    ]
  },
  {
    id: '3',
    url: 'https://picsum.photos/600/400?random=3',
    caption: 'City lights at night',
    timestamp: new Date('2024-12-11T21:00:00'),
    comments: []
  }
];

export default function TimelinePage() {
  const [images, setImages] = useState<TimelineImage[]>(mockImages);
  const [newComments, setNewComments] = useState<Record<string, string>>({});

  const addComment = (imageId: string) => {
    const text = newComments[imageId]?.trim();
    if (!text) return;

    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? {
            ...img,
            comments: [
              ...img.comments,
              {
                id: Date.now().toString(),
                author: 'You',
                text,
                timestamp: new Date()
              }
            ]
          }
        : img
    ));

    setNewComments(prev => ({ ...prev, [imageId]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Timeline</h1>
        
        <div className="space-y-6">
          {images.map(image => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={image.url} 
                alt={image.caption}
                className="w-full h-96 object-cover"
              />
              
              <div className="p-4">
                <p className="font-semibold mb-1">{image.caption}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {image.timestamp.toLocaleString()}
                </p>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">
                    Comments ({image.comments.length})
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    {image.comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {comment.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComments[image.id] || ''}
                      onChange={(e) => setNewComments(prev => ({ 
                        ...prev, 
                        [image.id]: e.target.value 
                      }))}
                      onKeyPress={(e) => e.key === 'Enter' && addComment(image.id)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => addComment(image.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
