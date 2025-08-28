import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
interface ImageData {
  id: string;
  url: string;
  alt: string;
}
interface ImageLightboxProps {
  images: ImageData[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}
export const ImageLightbox = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange
}: ImageLightboxProps) => {
  const [imageIndex, setImageIndex] = useState(currentIndex);
  useEffect(() => {
    setImageIndex(currentIndex);
  }, [currentIndex]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, imageIndex]);
  const handlePrevious = () => {
    const newIndex = imageIndex > 0 ? imageIndex - 1 : images.length - 1;
    setImageIndex(newIndex);
    onIndexChange(newIndex);
  };
  const handleNext = () => {
    const newIndex = imageIndex < images.length - 1 ? imageIndex + 1 : 0;
    setImageIndex(newIndex);
    onIndexChange(newIndex);
  };
  if (!images.length) return null;
  const currentImage = images[imageIndex];
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-full max-h-[95vh] p-0 bg-white/95 backdrop-blur-sm border-0">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          

          {/* Navigation buttons */}
          {images.length > 1 && <>
              <Button variant="ghost" className="absolute left-6 z-50 text-red-600 hover:bg-red-100/50 hover:text-red-700 w-20 h-20 shadow-lg" onClick={handlePrevious}>
                <ChevronLeft className="h-16 w-16" />
              </Button>
              
              <Button variant="ghost" className="absolute right-6 z-50 text-red-600 hover:bg-red-100/50 hover:text-red-700 w-20 h-20 shadow-lg" onClick={handleNext}>
                <ChevronRight className="h-16 w-16" />
              </Button>
            </>}

          {/* Main image */}
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <img src={currentImage?.url} alt={currentImage?.alt} className="max-w-full max-h-full object-contain rounded-2xl" />
          </div>

          {/* Image counter */}
          {images.length > 1 && <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm">
                {imageIndex + 1} / {images.length}
              </div>
            </div>}

          {/* Thumbnail navigation */}
          {images.length > 1 && <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50">
              <div className="flex gap-2 p-2 max-w-xs overflow-x-auto">
                {images.map((image, index) => <button key={image.id} onClick={() => {
              setImageIndex(index);
              onIndexChange(index);
            }} className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${index === imageIndex ? 'border-white' : 'border-transparent hover:border-white/50'}`}>
                    <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                  </button>)}
              </div>
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
};