import { useState, useEffect } from 'react';
import { storage, db } from '../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function PublicGallery() {
  const [images, setImages] = useState<Array<{ id: string; url: string; name: string }>>([]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const imagesCollection = collection(db, 'images');
    const imagesSnapshot = await getDocs(query(imagesCollection, orderBy('uploadedAt', 'desc')));
    const imagesList = await Promise.all(
      imagesSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const url = await getDownloadURL(ref(storage, data.path));
        return { id: doc.id, url, name: data.name };
      })
    );
    setImages(imagesList);
  };

  const handleShare = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Image URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Images</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-1 aspect-h-1">
                <img src={image.url} alt={image.name} className="w-full h-64 object-cover" />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-900 truncate">{image.name}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleShare(image.url)}
                    className="p-2 text-gray-600 hover:text-indigo-600"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}