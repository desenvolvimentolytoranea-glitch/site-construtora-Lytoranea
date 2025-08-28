import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ImageLightbox } from "@/components/ImageLightbox";

interface Project {
  id: string;
  title: string;
  location: string;
  year: string;
  description: string;
  client: string;
  main_image_url: string;
  category_name: string;
  slug: string;
}

interface ProjectImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
}

const PortfolioDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [nextProject, setNextProject] = useState<{ title: string; slug: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combine main image with gallery images for lightbox
  const allImages = project ? [
    {
      id: 'main',
      url: project.main_image_url,
      alt: project.title
    },
    ...images.map(img => ({
      id: img.id,
      url: img.image_url,
      alt: img.alt_text || `${project.title} - Imagem`
    }))
  ] : [];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;

      try {
        // Fetch project details with category name
        const { data: projectData, error: projectError } = await supabase
          .from('portfolio_projects')
          .select(`
            id,
            title,
            location,
            year,
            description,
            client,
            main_image_url,
            slug,
            portfolio_categories!inner(name)
          `)
          .eq('slug', slug)
          .single();

        if (projectError) {
          console.error('Error fetching project:', projectError);
          return;
        }

        if (projectData) {
          setProject({
            ...projectData,
            category_name: projectData.portfolio_categories.name
          });

          // Fetch project images
          const { data: imagesData, error: imagesError } = await supabase
            .from('portfolio_images')
            .select('id, image_url, alt_text, display_order')
            .eq('project_id', projectData.id)
            .order('display_order');

          if (!imagesError && imagesData) {
            setImages(imagesData);
          }

          // Fetch next project
          const { data: nextProjectData, error: nextError } = await supabase
            .from('portfolio_projects')
            .select('title, slug')
            .neq('slug', slug)
            .limit(1)
            .single();

          if (!nextError && nextProjectData) {
            setNextProject(nextProjectData);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Projeto não encontrado</h1>
          <Link to="/portfolio" className="inline-flex items-center space-x-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao portfólio</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Project content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Project title and info */}
            <div className="text-center space-y-6">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{project.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{project.client}</span>
                </div>
              </div>
              
              <div className="inline-flex px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                {project.category_name}
              </div>
            </div>

            {/* Images gallery with lightbox */}
            <div className="space-y-6">
              {/* Main image - full width */}
              <div 
                className="cursor-pointer group"
                onClick={() => openLightbox(0)}
              >
                <div className="aspect-[16/9] rounded-xl overflow-hidden">
                  <img
                    src={project.main_image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Thumbnails carousel */}
              {allImages.length > 1 && (
                <div className="relative">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: false,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {allImages.map((image, index) => (
                        <CarouselItem key={image.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                          <div 
                            className={`aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group relative transition-all duration-300 ${
                              currentImageIndex === index ? 'ring-2 ring-primary shadow-lg' : 'hover:ring-1 hover:ring-primary/50'
                            }`}
                            onClick={() => openLightbox(index)}
                          >
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            {currentImageIndex === index && (
                              <div className="absolute inset-0 bg-primary/10" />
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {allImages.length > 5 && (
                      <>
                        <CarouselPrevious className="left-0" />
                        <CarouselNext className="right-0" />
                      </>
                    )}
                  </Carousel>
                </div>
              )}
            </div>

            {/* Project description */}
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold mb-4">Sobre o Projeto</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Navigation to next project */}
            {nextProject && (
              <div className="flex justify-center pt-12 border-t">
                <Link 
                  to={`/portfolio/${nextProject.slug}`}
                  className="inline-flex items-center space-x-3 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus-visible"
                >
                  <span>Próximo Projeto: {nextProject.title}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
      <ImageLightbox
        images={allImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setCurrentImageIndex}
      />
    </div>
  );
};

export default PortfolioDetail;