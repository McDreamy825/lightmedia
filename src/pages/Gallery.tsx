import { useState, useEffect } from 'react';
import { storage, db, auth } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, query, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { Upload, Share2, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Gallery() {
  const [images, setImages] = useState<Array<{ id: string; url: string; name: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      
      await addDoc(collection(db, 'images'), {
        path: storageRef.fullPath,
        name: file.name,
        uploadedAt: new Date(),
        uploadedBy: auth.currentUser?.email
      });

      await loadImages();
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, path: string) => {
    try {
      await deleteDoc(doc(db, 'images', id));
      await deleteObject(ref(storage, path));
      await loadImages();
      toast.success('Image deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleShare = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Image URL copied to clipboard!');
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        <div className="mb-8">
          <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-indigo-600 focus:outline-none">
            <span className="flex items-center space-x-2">
              <Upload className={`w-6 h-6 ${uploading ? 'animate-bounce' : ''} text-gray-600`} />
              <span className="font-medium text-gray-600">
                {uploading ? 'Uploading...' : 'Drop files to upload or click to browse'}
              </span>
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-1 aspect-h-1">
                <img src={image.url} alt={image.name} className="w-full h-64 object-cover" />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-900 truncate">{image.name}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleShare(image.url)}
                    className="p-2 text-gray-600 hover:text-indigo-600"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id, image.url)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
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