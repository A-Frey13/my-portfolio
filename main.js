/**
 * Data Science Portfolio Website
 * JavaScript Implementation
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initThreeJS();
  initParallaxEffects();
  animateNeuralNetworks();
  initPortfolioInteractions();
  setupContactForm();
  initializeSkillsAnimation();
  initPortfolioFilters();
  initializePorfolioCharts();
  initThemeToggle();
  initCVDownload();
  new VRMViewer();
});

/**
 * Initialize Three.js background with particle system
 */
function initThreeJS() {
  // Create scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;
  
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Add renderer to DOM
  const container = document.getElementById('canvas-container');
  if (container) {
    container.appendChild(renderer.domElement);
  }
  
  // Create particle system for background
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 1500;
  
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  // Set random positions and colors for particles
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
    colors[i] = Math.random();
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Create material with custom properties
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.5,
    sizeAttenuation: true,
    transparent: true,
    // Use a circle texture for particles
    alphaMap: createCircleTexture(),
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });
  
  // Create points from geometry and material
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);
  
  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    
    // Slowly rotate the particle system
    particles.rotation.x += 0.0001;
    particles.rotation.y += 0.0002;
    
    renderer.render(scene, camera);
  };
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Make particles react to mouse movement
  window.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    gsap.to(particles.rotation, {
      x: mouseY * 0.1,
      y: mouseX * 0.1,
      duration: 2
    });
  });
  
  // Helper function to create a circle texture for particles
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 3;
    
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}

/**
 * Initialize parallax scrolling effects
 */
function initParallaxEffects() {
  const parallaxGroups = document.querySelectorAll('.parallax-group');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    parallaxGroups.forEach(group => {
      // Get layers within each group
      const baseLayers = group.querySelectorAll('.base-layer');
      const midLayers = group.querySelectorAll('.mid-layer');
      const topLayers = group.querySelectorAll('.top-layer');
      
      // Apply different scroll speeds to each layer
      baseLayers.forEach(layer => {
        layer.style.transform = `translateY(${scrollY * 0.1}px)`;
      });
      
      midLayers.forEach(layer => {
        layer.style.transform = `translateY(${scrollY * 0.05}px)`;
      });
      
      // Top layer stays fixed relative to scroll
    });
  });
  
  // Add reveal animations for sections
  const sections = document.querySelectorAll('section');
  
  const revealSection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };
  
  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15
  });
  
  sections.forEach(section => {
    section.classList.add('section-hidden');
    sectionObserver.observe(section);
  });
}

/**
 * Animate the neural network visualizations
 */
function animateNeuralNetworks() {
  // Supervised model
  const supervisedModel = document.querySelector('.supervised-model');
  if (supervisedModel) {
    const nodes = supervisedModel.querySelectorAll('.node');
    const connections = supervisedModel.querySelectorAll('.connection');
    
    // Pulsating animation for nodes
    nodes.forEach(node => {
      gsap.to(node, {
        boxShadow: '0 0 15px var(--light-blue)',
        scale: 1.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2
      });
    });
    
    // Data flow animation for connections
    connections.forEach(connection => {
      gsap.to(connection, {
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: Math.random()
      });
    });
    
    // Signal propagation animation
    supervisedModel.addEventListener('mouseenter', () => {
      // Sequential activation of nodes to simulate forward propagation
      const inputNodes = supervisedModel.querySelectorAll('.input-node');
      const hiddenNodes1 = supervisedModel.querySelectorAll('.hidden-node:nth-child(n+6):nth-child(-n+8)');
      const hiddenNodes2 = supervisedModel.querySelectorAll('.hidden-node:nth-child(n+9):nth-child(-n+10)');
      const outputNodes = supervisedModel.querySelectorAll('.output-node');
      
      // Reset all nodes
      nodes.forEach(node => {
        gsap.to(node, { 
          backgroundColor: 'currentColor',
          scale: 1,
          boxShadow: '0 0 10px rgba(100, 255, 218, 0.5)',
          duration: 0.3
        });
      });
      
      // Activate layers sequentially
      const timeline = gsap.timeline();
      
      timeline.to(inputNodes, {
        backgroundColor: '#64ffda',
        scale: 1.4,
        boxShadow: '0 0 20px #64ffda',
        duration: 0.5,
        stagger: 0.1
      });
      
      timeline.to(hiddenNodes1, {
        backgroundColor: '#bd00ff',
        scale: 1.4, 
        boxShadow: '0 0 20px #bd00ff',
        duration: 0.5,
        stagger: 0.1
      }, "+=0.3");
      
      timeline.to(hiddenNodes2, {
        backgroundColor: '#bd00ff',
        scale: 1.4,
        boxShadow: '0 0 20px #bd00ff',
        duration: 0.5,
        stagger: 0.1
      }, "+=0.3");
      
      timeline.to(outputNodes, {
        backgroundColor: '#64ffda',
        scale: 1.4,
        boxShadow: '0 0 20px #64ffda',
        duration: 0.5
      }, "+=0.3");
    });
  }
  
  // Unsupervised model (K-means clustering)
  const unsupervisedModel = document.querySelector('.unsupervised-model');
  if (unsupervisedModel) {
    const dataPoints = unsupervisedModel.querySelectorAll('.data-point');
    const clusterCenters = unsupervisedModel.querySelectorAll('.cluster-center');
    const clusterBoundaries = unsupervisedModel.querySelectorAll('.cluster-boundary');
    
    // Initialize cluster animation
    unsupervisedModel.addEventListener('mouseenter', () => {
      // Show cluster centers
      gsap.to(clusterCenters, {
        opacity: 1,
        scale: 1.2,
        duration: 0.5,
        stagger: 0.1
      });
      
      // Show cluster boundaries
      gsap.to(clusterBoundaries, {
        opacity: 0.4,
        duration: 0.5,
        delay: 0.5,
        stagger: 0.1
      });
      
      // Move data points to their clusters
      dataPoints.forEach((point) => {
        // Get point position
        const left = parseFloat(point.style.left);
        const top = parseFloat(point.style.top);
        
        // Find closest cluster center
        let closestCluster = 0;
        let minDistance = 999999;
        
        clusterCenters.forEach((center, index) => {
          const centerLeft = parseFloat(center.style.left);
          const centerTop = parseFloat(center.style.top);
          
          const distance = Math.sqrt(
            Math.pow(left - centerLeft, 2) + 
            Math.pow(top - centerTop, 2)
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            closestCluster = index;
          }
        });
        
        // Get target cluster position
        const targetLeft = parseFloat(clusterCenters[closestCluster].style.left);
        const targetTop = parseFloat(clusterCenters[closestCluster].style.top);
        
        // Random offset within cluster
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;
        
        // Animate point to cluster
        gsap.to(point, {
          left: targetLeft + offsetX + '%',
          top: targetTop + offsetY + '%',
          duration: 1,
          delay: 0.5 + Math.random() * 0.5,
          ease: "back.out(1.7)"
        });
      });
    });
    
    // Reset animation when mouse leaves
    unsupervisedModel.addEventListener('mouseleave', () => {
      // Reset all data points to their original positions
      dataPoints.forEach((point) => {
        const originalLeft = point.getAttribute('data-original-left') || point.style.left;
        const originalTop = point.getAttribute('data-original-top') || point.style.top;
        
        // Store original position if not already stored
        if (!point.getAttribute('data-original-left')) {
          point.setAttribute('data-original-left', point.style.left);
          point.setAttribute('data-original-top', point.style.top);
        }
        
        // Animate back to original position
        gsap.to(point, {
          left: originalLeft,
          top: originalTop,
          duration: 1,
          delay: Math.random() * 0.3,
          ease: "power2.inOut"
        });
      });
      
      // Hide cluster centers and boundaries
      gsap.to(clusterCenters, {
        opacity: 0,
        scale: 1,
        duration: 0.5
      });
      
      gsap.to(clusterBoundaries, {
        opacity: 0,
        duration: 0.5
      });
    });
  }
}

/**
 * Initialize portfolio card interactions
 */
function initPortfolioInteractions() {
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  
  portfolioCards.forEach(card => {
    // 3D tilt effect
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      // Calculate mouse position relative to card center
      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;
      
      // Calculate rotation
      const rotateY = (mouseX / (cardRect.width / 2)) * 10;
      const rotateX = -(mouseY / (cardRect.height / 2)) * 10;
      
      // Apply transformation
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.transition = 'transform 0.5s ease';
    });
    
    // Remove transition on mouse enter
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/**
 * Setup contact form validation and submission
 */
function setupContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form
      let isValid = true;
      
      // Get form fields
      const nameInput = contactForm.querySelector('input[name="name"]');
      const emailInput = contactForm.querySelector('input[name="email"]');
      const subjectInput = contactForm.querySelector('input[name="subject"]');
      const messageInput = contactForm.querySelector('textarea[name="message"]');
      
      // Validate name
      if (!nameInput.value.trim()) {
        markInvalid(nameInput, 'Please enter your name');
        isValid = false;
      }
      
      // Validate email
      if (!validateEmail(emailInput.value)) {
        markInvalid(emailInput, 'Please enter a valid email address');
        isValid = false;
      }
      
      // Validate message
      if (!messageInput.value.trim()) {
        markInvalid(messageInput, 'Please enter a message');
        isValid = false;
      }
      
      // Submit form if valid
      if (isValid) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
          // Prepare email data
          const emailData = {
            to: 'freyssinieralexandro@gmail.com', // Your email address
            from: emailInput.value,
            name: nameInput.value,
            subject: subjectInput.value || 'New Contact Form Submission',
            message: messageInput.value
          };

          // Here you would typically make an API call to your backend
          // For now, we'll show a success message
          // Note: You'll need to set up a backend service to actually send emails
          
          // Simulate successful submission
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Show success message
          contactForm.reset();
          submitButton.textContent = 'Message Sent!';
          submitButton.classList.add('success');
          
          // Reset button after delay
          setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('success');
          }, 3000);
          
        } catch (error) {
          console.error('Error sending message:', error);
          submitButton.textContent = 'Error Sending';
          submitButton.classList.add('error');
          
          // Reset button after delay
          setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('error');
          }, 3000);
        }
      }
    });
    
    // Add input event listeners to clear validation messages
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearInvalid(input);
      });
    });
  }
  
  // Helper function to mark invalid fields
  function markInvalid(field, message) {
    field.classList.add('invalid');
    
    // Create or update error message
    let errorMessage = field.parentElement.querySelector('.error-message');
    if (!errorMessage) {
      errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      field.parentElement.appendChild(errorMessage);
    }
    
    errorMessage.textContent = message;
  }
  
  // Helper function to clear invalid state
  function clearInvalid(field) {
    field.classList.remove('invalid');
    
    // Remove error message
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }
  
  // Helper function to validate email
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

/**
 * Initialize skill section animations
 */
function initializeSkillsAnimation() {
  const skillItems = document.querySelectorAll('.skill-item');
  
  skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const icon = item.querySelector('.skill-icon');
      const proficiencyBar = item.querySelector('.proficiency-bar-fill');
      
      // Rotate icon
      gsap.to(icon, {
        rotationY: 180,
        duration: 0.6,
        ease: "back.out(1.7)"
      });
      
      // Animate proficiency bar if it exists
      if (proficiencyBar) {
        const proficiencyValue = parseInt(item.getAttribute('data-proficiency') || "0");
        
        gsap.to(proficiencyBar, {
          width: `${proficiencyValue}%`,
          duration: 1,
          ease: "power2.out"
        });
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const icon = item.querySelector('.skill-icon');
      
      // Rotate back
      gsap.to(icon, {
        rotationY: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      });
    });
  });
  
  // Add intersection observer for skill items
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('skill-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  skillItems.forEach(item => {
    observer.observe(item);
  });
}

/**
 * Initialize portfolio filtering functionality
 */
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-card');
  
  // Add click event to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter portfolio items
      portfolioItems.forEach(item => {
        // Show all items if filter is 'all'
        if (filterValue === 'all') {
          gsap.to(item, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            clearProps: "all"
          });
          item.style.display = 'block';
        } 
        // Show items matching the filter, hide others
        else {
          if (item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            gsap.fromTo(item, 
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out", clearProps: "all" }
            );
          } else {
            gsap.to(item, {
              scale: 0.8,
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
              onComplete: () => { item.style.display = 'none'; }
            });
          }
        }
      });
    });
  });
}

/**
 * Initialize charts in portfolio projects
 */
function initializePorfolioCharts() {
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = createCharts;
    document.head.appendChild(script);
  } else {
    createCharts();
  }
  
  function createCharts() {
    const chartContainers = document.querySelectorAll('.chart-container');
    
    // Define chart data and configurations for each project
    const chartConfigs = [
      // Customer Churn Prediction
      {
        type: 'bar',
        data: {
          labels: ['Random Forest', 'XGBoost', 'Logistic Reg.', 'Neural Network', 'Our Model'],
          datasets: [{
            label: 'Model Accuracy',
            data: [0.84, 0.87, 0.79, 0.85, 0.92],
            backgroundColor: [
              'rgba(100, 255, 218, 0.5)',
              'rgba(100, 255, 218, 0.5)',
              'rgba(100, 255, 218, 0.5)',
              'rgba(100, 255, 218, 0.5)',
              'rgba(189, 0, 255, 0.5)'
            ],
            borderColor: [
              'rgba(100, 255, 218, 1)',
              'rgba(100, 255, 218, 1)',
              'rgba(100, 255, 218, 1)',
              'rgba(100, 255, 218, 1)',
              'rgba(189, 0, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 1.0
            }
          },
          responsive: true,
          maintainAspectRatio: false,
        }
      },
      // Sentiment Analysis Pipeline
      {
        type: 'line',
        data: {
          labels: ['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
          datasets: [{
            label: 'Generic Model',
            data: [0.45, 0.52, 0.58, 0.62, 0.65, 0.68, 0.71, 0.72, 0.73, 0.73],
            fill: false,
            borderColor: 'rgba(100, 255, 218, 1)',
            tension: 0.1
          }, {
            label: 'Fine-tuned Model',
            data: [0.50, 0.58, 0.65, 0.70, 0.75, 0.78, 0.82, 0.84, 0.86, 0.87],
            fill: false,
            borderColor: 'rgba(189, 0, 255, 1)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 1.0,
              title: {
                display: true,
                text: 'Accuracy'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Training Data Used'
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
        }
      },
      // Interactive Sales Dashboard
      {
        type: 'radar',
        data: {
          labels: ['Data Integration', 'UI/UX', 'Performance', 'Customization', 'Real-time Updates', 'Mobile Support'],
          datasets: [{
            label: 'Before',
            data: [3, 2, 2, 1, 1, 1],
            fill: true,
            backgroundColor: 'rgba(100, 255, 218, 0.2)',
            borderColor: 'rgba(100, 255, 218, 1)',
            pointBackgroundColor: 'rgba(100, 255, 218, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(100, 255, 218, 1)'
          }, {
            label: 'After',
            data: [5, 4, 5, 4, 5, 4],
            fill: true,
            backgroundColor: 'rgba(189, 0, 255, 0.2)',
            borderColor: 'rgba(189, 0, 255, 1)',
            pointBackgroundColor: 'rgba(189, 0, 255, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(189, 0, 255, 1)'
          }]
        },
        options: {
          elements: {
            line: {
              borderWidth: 3
            }
          },
          scale: {
            min: 0,
            max: 5
          },
          responsive: true,
          maintainAspectRatio: false,
        }
      },
      // Supply Chain Optimization
      {
        type: 'bar',
        data: {
          labels: ['Inventory', 'Transportation', 'Storage', 'Processing', 'Administration'],
          datasets: [{
            label: 'Cost Reduction (thousands $)',
            data: [450, 320, 180, 150, 100],
            backgroundColor: [
              'rgba(189, 0, 255, 0.7)',
              'rgba(169, 20, 235, 0.7)',
              'rgba(149, 40, 215, 0.7)',
              'rgba(129, 60, 195, 0.7)',
              'rgba(109, 80, 175, 0.7)'
            ],
            borderColor: [
              'rgba(189, 0, 255, 1)',
              'rgba(169, 20, 235, 1)',
              'rgba(149, 40, 215, 1)',
              'rgba(129, 60, 195, 1)',
              'rgba(109, 80, 175, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
        }
      },
      // Recommendation System
      {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
          datasets: [{
            label: 'Click-through Rate',
            data: [0.05, 0.08, 0.15, 0.22, 0.25, 0.28, 0.32, 0.35],
            fill: false,
            borderColor: 'rgba(100, 255, 218, 1)',
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: 'rgba(100, 255, 218, 1)'
          }, {
            label: 'Conversion Rate',
            data: [0.01, 0.015, 0.025, 0.04, 0.045, 0.05, 0.055, 0.06],
            fill: false,
            borderColor: 'rgba(189, 0, 255, 1)',
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: 'rgba(189, 0, 255, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Rate'
              }
            }
          }
        }
      },
      // Document Classification
      {
        type: 'doughnut',
        data: {
          labels: ['Technical Issues', 'Billing Questions', 'Product Info', 'Returns', 'Other'],
          datasets: [{
            label: 'Ticket Distribution',
            data: [30, 25, 20, 15, 10],
            backgroundColor: [
              'rgba(100, 255, 218, 0.7)',
              'rgba(189, 0, 255, 0.7)',
              'rgba(149, 40, 215, 0.7)',
              'rgba(129, 60, 195, 0.7)',
              'rgba(109, 80, 175, 0.7)'
            ],
            borderColor: [
              'rgba(100, 255, 218, 1)',
              'rgba(189, 0, 255, 1)',
              'rgba(149, 40, 215, 1)',
              'rgba(129, 60, 195, 1)',
              'rgba(109, 80, 175, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      }
    ];
    
    // Create charts for each container
    chartContainers.forEach((container, index) => {
      // Only create chart if configuration exists
      if (index < chartConfigs.length) {
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        
        // Apply config to create chart
        new Chart(canvas, chartConfigs[index]);
      }
    });
  }
}

/**
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      // Update icon based on theme
      if (document.body.classList.contains('light-theme')) {
        themeToggle.textContent = '☀️';
      } else {
        themeToggle.textContent = '🌙';
      }
    });
  }
}

/**
 * Initialize CV download functionality
 */
function initCVDownload() {
  const downloadBtn = document.getElementById('descargarCV');
  
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Show loading state
      const btnText = downloadBtn.querySelector('.btn-text');
      const btnIcon = downloadBtn.querySelector('.btn-icon');
      const originalText = btnText.textContent;
      
      btnText.textContent = 'Preparing...';
      downloadBtn.classList.add('loading');
      
      // Create and trigger download
      const link = document.createElement('a');
      link.href = downloadBtn.href;
      link.download = 'Data-Science-Javier-Alejandro-Davalos-Freyssinier-2025.pdf';
      
      // Convert Windows path to URL format
      const filePath = downloadBtn.href.replace(/\\/g, '/');
      
      try {
        // Try to fetch the file first to handle any potential errors
        fetch(filePath)
          .then(response => {
            if (!response.ok) {
              throw new Error('File not found');
            }
            return response.blob();
          })
          .then(blob => {
            // Create object URL for the file
            const objectUrl = window.URL.createObjectURL(blob);
            link.href = objectUrl;
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            window.URL.revokeObjectURL(objectUrl);
            document.body.removeChild(link);
            
            // Show success state
            btnText.textContent = 'Downloaded!';
            btnIcon.textContent = '✓';
            downloadBtn.classList.add('success');
            
            // Reset button after delay
            setTimeout(() => {
              btnText.textContent = originalText;
              btnIcon.textContent = '📄';
              downloadBtn.classList.remove('loading', 'success');
            }, 2000);
          })
          .catch(error => {
            console.error('Error downloading file:', error);
            btnText.textContent = 'Error';
            btnIcon.textContent = '❌';
            downloadBtn.classList.add('error');
            
            // Reset button after delay
            setTimeout(() => {
              btnText.textContent = originalText;
              btnIcon.textContent = '📄';
              downloadBtn.classList.remove('loading', 'error');
            }, 2000);
          });
      } catch (error) {
        console.error('Error initiating download:', error);
        btnText.textContent = 'Error';
        btnIcon.textContent = '❌';
        downloadBtn.classList.add('error');
        
        // Reset button after delay
        setTimeout(() => {
          btnText.textContent = originalText;
          btnIcon.textContent = '📄';
          downloadBtn.classList.remove('loading', 'error');
        }, 2000);
      }
    });
  }
}

// VRM Model Viewer
class VRMViewer {
  constructor() {
    this.canvas = document.getElementById('vrm-canvas');
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30.0, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 20.0);
    this.camera.position.set(0.0, 1.4, 3.5);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Lighting
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    
    // Controls
    this.rotationY = 0;
    this.model = null;
    
    document.getElementById('rotate-left').addEventListener('click', () => {
      this.rotationY += Math.PI / 4;
    });
    
    document.getElementById('rotate-right').addEventListener('click', () => {
      this.rotationY -= Math.PI / 4;
    });
    
    // Load VRM model
    const loader = new THREE.GLTFLoader();
    loader.crossOrigin = 'anonymous';
    
    loader.load(
      'vrverse_avater_model_138884.vrm',
      (gltf) => {
        THREE.VRM.from(gltf).then((vrm) => {
          this.model = vrm;
          this.scene.add(this.model.scene);
          
          // Adjust model position
          this.model.scene.position.set(0, 0.5, 0);
          
          // Start animation loop
          this.animate();
        });
      },
      (progress) => console.log('Loading model...', (progress.loaded / progress.total * 100) + '%'),
      (error) => console.error('Error loading model:', error)
    );
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }
  
  onWindowResize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    if (this.model) {
      // Smoothly rotate the model
      this.model.scene.rotation.y += (this.rotationY - this.model.scene.rotation.y) * 0.1;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
} 

/**
 * Author Alex Freyssinier 15/03/2025
 */