/* eslint-disable no-unused-vars */
import gsap from "gsap";
import { CustomEase } from "gsap/all";
import SplitType from "split-type";
import { projectsData } from "./projects";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(CustomEase);
gsap.registerPlugin(ScrollTrigger);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.querySelector(".projects");
  const locationsContainer = document.querySelector(".locations");
  const gridImages = gsap.utils.toArray(".img");
  const heroImage = document.querySelector(".img.hero-img");
  const navLinks = document.querySelectorAll("nav a");
  const pageContainers = document.querySelectorAll(".page-container");
  const transitionElement = document.querySelector(".page-transition");

  const images = gridImages.filter((img) => img !== heroImage);

  // Split text into characters for more detailed animation
  const introCopy = new SplitType(".intro-copy h3", {
    types: "chars, words",
    absolute: false,
  });

  const heroHeading = new SplitType(".title h1", {
    types: "chars, words",
    absolute: false,
  });
 
  const allImageSources = Array.from(
    { length: 22 },
    (_, i) => `/img${i + 1}.jpg`
  );

  const getRandomImageSet = () => {
    const shuffled = [...allImageSources].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 9);
  };

  function initializeDynamicContent() {
    projectsData.forEach((project) => {
      const projectItem = document.createElement("div");
      projectItem.className = "project-item";

      const projectName = document.createElement("p");
      projectName.textContent = project.name; 

      const directorName = document.createElement("p");
      directorName.textContent = project.director;

      projectItem.appendChild(projectName);
      projectItem.appendChild(directorName);

      projectsContainer.appendChild(projectItem);
    });

    projectsData.forEach((project) => {
      const locationItem = document.createElement("div");
      locationItem.className = "location-item";
      
      const locationName = document.createElement("p");
      locationName.textContent = project.location;

      locationItem.appendChild(locationName);
      locationsContainer.appendChild(locationItem);
    });
  }

  function startImageRotation() {
    const totalCycles = 20;

    for (let cycle = 0; cycle < totalCycles; cycle++) {
      const randomImages = getRandomImageSet();

      gsap.to(
        {},
        {
          duration: 0,
          delay: cycle * 0.15,
          onComplete: () => {
            gridImages.forEach((img, index) => {
              const imgElement = img.querySelector("img");

              if (cycle === totalCycles - 1 && img === heroImage) {
                imgElement.src = "/img5.jpg";
                gsap.set(".hero-img img", { scale: 2 });
              } else {
                imgElement.src = randomImages[index];
              }
            });
          },
        }
      );
    }
  }

  function startBannerImageSequence() {
    // Create sequences for each banner image
    for (let i = 1; i <= 6; i++) {
      const bannerSelector = `.banner-img-${i} img`;
      // Get a subset of images for this banner (different for each)
      const startIndex = (i - 1) * 3 % allImageSources.length;
      const bannerImages = [...allImageSources.slice(startIndex), ...allImageSources.slice(0, startIndex)].slice(0, 10);
      
      // Create a timeline for each banner's sequence
      const sequenceTimeline = gsap.timeline({
        delay: 10 + (i * 0.3), // Start after initial animations, staggered
        repeat: 2,
        yoyo: true,
        onComplete: () => {
          // Return to original image when sequence completes
          const imgElement = document.querySelector(bannerSelector);
          if (imgElement) {
            imgElement.src = `/img${i + 5}.jpg`;
          }
        }
      });
      
      // Add frames to the sequence
      bannerImages.forEach((imgSrc, index) => {
        sequenceTimeline.to(bannerSelector, {
          duration: 0.2,
          onStart: function() {
            const imgElement = document.querySelector(bannerSelector);
            if (imgElement) {
              imgElement.src = imgSrc;
            }
          }
        }, index * 0.2);
      });
    }
  }

  function setupInitialStates() {
    gsap.set("nav", {
      y: "-125%",
    });

    // Set initial states for text animations
    gsap.set(introCopy.chars, {
      y: "110%",
      opacity: 0,
      rotationX: -90,
    });

    gsap.set(heroHeading.chars, {
      y: "110%",
      opacity: 0,
      rotationX: -90,
    });
    
    // Set initial states for all banner images
    gsap.set(".banner-img", {
      scale: 0,
      transformOrigin: "center center"
    });
    
    // Set specific positions for each banner image
    gsap.set(".banner-img-1", { top: "45%", left: "50%" });
    gsap.set(".banner-img-2", { top: "45%", left: "50%" });
    gsap.set(".banner-img-3", { top: "45%", left: "50%" });
    gsap.set(".banner-img-4", { top: "45%", left: "50%" });
    gsap.set(".banner-img-5", { top: "45%", left: "50%" });
    gsap.set(".banner-img-6", { top: "45%", left: "50%" });
  }

  function setupPageNavigation() {
    // Get the current hash or default to home
    const currentHash = window.location.hash || "#home";
    
    // Activate the correct container based on hash
    pageContainers.forEach(container => {
      const containerId = container.id;
      const targetHash = `#${containerId.replace('-container', '')}`;
      
      if (targetHash === currentHash) {
        container.classList.add('active');
      } else {
        container.classList.remove('active');
      }
    });
    
    // Handle navigation clicks
    navLinks.forEach(link => {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        const target = this.getAttribute("href");
        
        // Start transition animation
        document.body.classList.add("transitioning");
        
        gsap.to(".page-transition", {
          height: "100%", 
          duration: 0.5,
          ease: "hop",
          onComplete: () => {
            // Hide all containers
            pageContainers.forEach(container => {
              container.classList.remove('active');
            });
            
            // Show target container
            const targetContainer = document.getElementById(`${target.replace('#', '')}-container`);
            if (targetContainer) {
              targetContainer.classList.add('active');
            }
            
            // Update URL hash
            window.location.hash = target;
            
            // Reverse transition animation
            gsap.to(".page-transition", {
              height: "0%", 
              duration: 0.5,
              ease: "hop",
              onComplete: () => {
                document.body.classList.remove("transitioning");
              }
            });
          }
        });
      });
    });
  }

  function init() {
    initializeDynamicContent();
    setupInitialStates();
    createAnimationTimelines();
    setupPageNavigation();
  }

  init();

  function createAnimationTimelines() {
    const overlayTimeline = gsap.timeline();
    const imagesTimeline = gsap.timeline();
    const textTimeline = gsap.timeline();

    // Enhanced logo animation with diagonal reveal
    overlayTimeline.to(".logo-line-1", {
      backgroundPosition: "0% 0%",
      color: "#fff",
      duration: 1.2,
      ease: "power2.inOut",
      delay: 0.5,
      onComplete: () => {
        // Add a subtle scale effect after reveal
        gsap.to(".logo-line-1", {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut"
        });
        
        gsap.to(".logo-line-2", {
          backgroundPosition: "0% 0%",
          color: "#fff",
          duration: 1.2,
          ease: "power2.inOut",
          onComplete: () => {
            // Add a subtle scale effect after reveal
            gsap.to(".logo-line-2", {
              scale: 1.05,
              duration: 0.2,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut",
              onComplete: () => {
                // Make image grid visible after logo animation
                gsap.to(".image-grid", {
                  opacity: 1,
                  duration: 1,
                  ease: "hop"
                });
              }
            });
          }
        });
      },
    });

    overlayTimeline.to([".projects-header", ".project-item"], {
      opacity: 1,
      duration: 0.15,
      stagger: 0.075,
      delay: 1,
    });

    overlayTimeline.to(
      [".locations-header", ".location-item"],
      {
        opacity: 1,
        duration: 0.15,
        stagger: 0.075,
      },
      "<" // syncs this animation with the start of the previous one
    );

    overlayTimeline.to(".project-item", {
      color: "#fff",
      duration: 0.15,
      stagger: 0.075,
    });

    overlayTimeline.to(
      ".location-item",
      {
        color: "#fff",
        duration: 0.15,
        stagger: 0.075,
      },
      "<"
    );

    overlayTimeline.to([".projects-header", ".project-item"], {
      opacity: 0,
      duration: 0.15,
      stagger: 0.075,
    });

    overlayTimeline.to(
      [".locations-header", ".location-item"],
      {
        opacity: 0,
        duration: 0.15,
        stagger: 0.075,
      },
      "<" 
    );

    overlayTimeline.to(".overlay", {
      opacity: 0,
      duration: 0.5,
      delay: 1.5,
    });

    imagesTimeline.to(".img", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      delay: 2.5,
      stagger: 0.05,
      ease: "hop",
      onStart: () => {
        setTimeout(() => {
          startImageRotation();
          gsap.to(".loader", { opacity: 0, duration: 0.3 });
        }, 1000);
      },
    });

    imagesTimeline.to(images, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      delay: 2.5,
      stagger: 0.05,
      ease: "hop",
    });

    imagesTimeline.to(".hero-img", {
      y: -50,
      duration: 1,
      ease: "hop",
    });

    imagesTimeline.to(".hero-img", {
      scale: 4,
      clipPath: "polygon(20% 10%, 80% 10%, 80% 90%, 20% 90%)",
      duration: 1.5,
      ease: "hop",
      onStart: () => {
        gsap.to(".hero-img img", {
          scale: 1,
          duration: 1.5,
          ease: "hop",
        });

        // Animate all banner images to scale up with stagger
        gsap.to(".banner-img", { 
          scale: 1, 
          delay: 0.5, 
          duration: 0.5,
          stagger: 0.1 // Add stagger for sequential appearance
        });
        
        gsap.to("nav", { y: "0%", duration: 1, ease: "hop", delay: 0.25 });
      },
    });

    // Animate banner-img-1 and banner-img-2 (existing code)
    imagesTimeline.to(
      ".banner-img-1",
      {
        left: "40%",
        rotate: -20,
        duration: 1.5,
        delay: 0.5,
        ease: "hop",
      },
      "<"
    );

    imagesTimeline.to(
      ".banner-img-2",
      {
        left: "60%",
        rotate: 20,
        duration: 1.5,
        ease: "hop",
      },
      "<"
    );

    // Add animations for banner-img-3
    imagesTimeline.to(
      ".banner-img-3",
      {
        left: "25%",
        top: "65%",
        rotate: -15,
        duration: 1.5,
        ease: "hop",
        zIndex: -20,
        filter: "blur(2px)",
        scale: 0.8,
      },
      "<0.2" // Slight delay from previous animations
    );

    // Add animations for banner-img-4
    imagesTimeline.to(
      ".banner-img-4",
      {
        left: "75%",
        top: "65%",
        rotate: 15,
        duration: 1.5,
        ease: "hop",
        zIndex: -20,
        filter: "blur(2px)",
        scale: 0.8,
      },
      "<0.1"
    );

    // Add animations for banner-img-5
    imagesTimeline.to(
      ".banner-img-5",
      {
        left: "20%",
        top: "75%",
        rotate: 10,
        duration: 1.5,
        ease: "hop",
        zIndex: -30,
        filter: "blur(4px)",
        scale: 0.6,
      },
      "<0.15"
    );

    // Add animations for banner-img-6
    imagesTimeline.to(
      ".banner-img-6",
      {
        left: "80%",
        top: "75%",
        rotate: -10,
        duration: 1.5,
        ease: "hop",
        zIndex: -30,
        filter: "blur(4px)",
        scale: 0.6,
        onComplete: () => {
          // Start the image sequence for all banner images
          startBannerImageSequence();
        }
      },
      "<0.1"
    );

    // Enhanced text animation with diagonal reveal and 3D effects
    textTimeline.to(heroHeading.chars, {
      y: "0%",
      backgroundColor: "#e3e3db",
      opacity: 0.5,
      rotationX: 0,
      duration: 0.8,
      stagger: {
        each: 0.03,
        from: "end", // Animate from end (top right) to start (bottom left)
        grid: [1, 10], // Creates a more diagonal pattern
        ease: "power2.out"
      },
      delay: 9.5,
      ease: "back.out(1.7)",
      onComplete: () => {
        gsap.to(heroHeading.chars, {
          duration: 0.3,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
          color: "#333",
          stagger: {
            each: 0.02,
            from: "random"
          }
        });
        
        // Then do the color flash effect separately
        gsap.to(heroHeading.chars, {
          color: "#333",
          duration: 0.2,
          stagger: {
            each: 0.02,
            from: "random"
          },
          yoyo: true,
          repeat: 1
        });
      }
    });

    // Enhanced intro copy animation with similar effects
    textTimeline.to(
      introCopy.chars,
      {
        y: "0%",
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        stagger: {
          each: 0.03,
          from: "end",
          grid: [1, 10],
          ease: "power2.out"
        },
        delay: 0.25,
        ease: "back.out(1.7)",
        onComplete: () => {
          // Add a subtle color flash effect
          gsap.to(introCopy.chars, {
            color: "#333",
            duration: 0.2,
            stagger: {
              each: 0.02,
              from: "random"
            },
            yoyo: true,
            repeat: 1
          });
        }
      },
      "<"
    );
  }

  if(window.innerWidth > 900) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.5 * t),
      smooth: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }
});
