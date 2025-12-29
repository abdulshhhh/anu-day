import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Gallery.css";

function Gallery({ isActive }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photosRevealed, setPhotosRevealed] = useState(false);

  const photosRef = useRef([]);
  const lightboxImgRef = useRef(null);

  // ...existing code...
  // Special gallery with all uploaded images and videos
  const galleryItems = [
    { src: "/images/WhatsApp Image 2025-12-29 at 9.32.37 PM (1).jpeg", alt: "Birthday Memory 1", type: "image" },
    { src: "/images/WhatsApp Image 2025-12-29 at 9.32.37 PM.jpeg", alt: "Birthday Memory 2", type: "image" },
    { src: "/images/WhatsApp Image 2025-12-29 at 9.32.30 PM (1).jpeg", alt: "Birthday Memory 3", type: "image" },
    { src: "/images/WhatsApp Image 2025-12-29 at 9.32.30 PM.jpeg", alt: "Birthday Memory 4", type: "image" },
    { src: "/images/WhatsApp Image 2025-12-29 at 9.32.34 PM.jpeg", alt: "Birthday Memory 5", type: "image" },
    { src: "/images/WhatsApp Image 2025-12-29 at 9.32.35 PM (1).jpeg", alt: "Birthday Memory 6", type: "image" },
    { src: "/images/WhatsApp Image 2025-12-29 at 9.32.35 PM (2).jpeg", alt: "Birthday Memory 7", type: "image" },
    { src: "/images/WhatsApp Image 2025-12-29 at 9.32.35 PM.jpeg", alt: "Birthday Memory 8", type: "image" },
    { src: "/images/WhatsApp Image 2025-12-29 at 9.32.36 PM (1).jpeg", alt: "Birthday Memory 9", type: "image" },
    { src: "/images/WhatsApp Image 2025-12-29 at 9.32.36 PM.jpeg", alt: "Birthday Memory 10", type: "image" },
    { src: "/images/WhatsApp Video 2025-12-29 at 9.32.34 PM.mp4", alt: "Birthday Video 1", type: "video" },
    { src: "/images/WhatsApp Video 2025-12-29 at 9.32.35 PM.mp4", alt: "Birthday Video 2", type: "video" },
  ];

  // Reveal photos with GSAP when page becomes active
  useEffect(() => {
    if (isActive && !photosRevealed) {
      setTimeout(() => setPhotosRevealed(true), 10);

      // Stagger animation for photos
      gsap.fromTo(
        photosRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.4)",
          delay: 0.2,
        }
      );
    }
  }, [isActive, photosRevealed]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);

    // Animate lightbox appearance
    if (lightboxImgRef.current) {
      gsap.fromTo(
        lightboxImgRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }
      );
    }
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Handle body overflow in effect
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  const showNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % galleryItems.length;

    // Animate transition
    if (lightboxImgRef.current) {
      gsap.to(lightboxImgRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(newIndex);
          gsap.fromTo(
            lightboxImgRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        },
      });
    }
  }, [currentIndex, galleryItems.length]);

  const showPrev = useCallback(() => {
    const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;

    // Animate transition
    if (lightboxImgRef.current) {
      gsap.to(lightboxImgRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(newIndex);
          gsap.fromTo(
            lightboxImgRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        },
      });
    }
  }, [currentIndex, galleryItems.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      } else if (e.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, showNext, showPrev, closeLightbox]);

  return (
    <>
      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          {galleryItems[currentIndex].type === "image" ? (
            <img
              ref={lightboxImgRef}
              src={galleryItems[currentIndex].src}
              alt={galleryItems[currentIndex].alt}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <video
              ref={lightboxImgRef}
              src={galleryItems[currentIndex].src}
              controls
              autoPlay
              style={{ maxWidth: "90vw", maxHeight: "80vh" }}
              onClick={e => e.stopPropagation()}
            />
          )}
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ✖
          </button>
          <button
            className="nav-btn nav-prev"
            onClick={e => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            className="nav-btn nav-next"
            onClick={e => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
      <section className="gallery">
      <h2>🎉 Our Beautiful Memories</h2>
      <div className="photos">
        {galleryItems.map((item, index) => (
          item.type === "image" ? (
            <img
              key={index}
              ref={el => (photosRef.current[index] = el)}
              src={item.src}
              alt={item.alt}
              onClick={() => openLightbox(index)}
              loading="lazy"
              className="special-photo"
            />
          ) : (
            <div
              key={index}
              ref={el => (photosRef.current[index] = el)}
              className="video-thumb"
              onClick={() => openLightbox(index)}
              style={{ cursor: "pointer" }}
            >
              <video src={item.src} style={{ width: "100%", borderRadius: "12px" }} />
              <span className="video-label">🎬 {item.alt}</span>
            </div>
          )
        ))}
      </div>
      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          {galleryItems[currentIndex].type === "image" ? (
            <img
              ref={lightboxImgRef}
              src={galleryItems[currentIndex].src}
              alt={galleryItems[currentIndex].alt}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <video
              ref={lightboxImgRef}
              src={galleryItems[currentIndex].src}
              controls
              autoPlay
              style={{ maxWidth: "90vw", maxHeight: "80vh" }}
              onClick={e => e.stopPropagation()}
            />
          )}
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ✖
          </button>
          <button
            className="nav-btn nav-prev"
            onClick={e => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            className="nav-btn nav-next"
            onClick={e => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </section>
    </>
  );
}

export default Gallery;
