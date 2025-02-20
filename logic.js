(() => {
    // Configuration Variables
    const API_BASE_URL = 'https://weather-moon-api.onrender.com';
    const weatherProxyUrl = `${API_BASE_URL}/api/weather`;
    const moonPhaseProxyUrl = `${API_BASE_URL}/api/moon-phase`;
    const urls = [
      'https://www.google.com',
      'https://www.youtube.com',
      'https://www.gmail.com',
      'https://www.yahoo.com',
    ];
  
    // Track Initialized Elements
    const initializedElements = new Set();
  
    // Initialize Widgets and Interactions
    function initializeWidgets() {
      // Weather Widget Logic
      const weatherWidget = document.getElementById('weather-widget');
      if (weatherWidget && !initializedElements.has(weatherWidget)) {
        initializedElements.add(weatherWidget);
        fetchWeather();
      }
  
      // Moon Phase Widget Logic
      const moonPhaseWidget = document.getElementById('moon-phase-widget');
      if (moonPhaseWidget && !initializedElements.has(moonPhaseWidget)) {
        initializedElements.add(moonPhaseWidget);
        fetchMoonPhase();
      }
  
      // Guestbook Popup Logic
      const guestbookButton = document.getElementById('guestbook');
      const brevoFormContainer = document.getElementById('brevo-form');
      const overlay = document.getElementById('popup-overlay');
      const closeButton = document.getElementById('close-popup');
  
      if (guestbookButton && !initializedElements.has(guestbookButton)) {
        initializedElements.add(guestbookButton);
        guestbookButton.addEventListener('click', () => {
          if (brevoFormContainer){
            brevoFormContainer.style.display = 'block';
            if (overlay) overlay.style.display = 'block';
          }

        });
        if (closeButton){
          closeButton.addEventListener('click', () => {
            if (brevoFormContainer) {
              brevoFormContainer.style.display = 'none';
              if (overlay) overlay.style.display = 'none';
            }
          });
        }

      }
  
      // Odyssey Hyperlink Logic
      const odysseyLink = document.getElementById('odyssey-link');
      if (odysseyLink && !initializedElements.has(odysseyLink)) {
        initializedElements.add(odysseyLink);
        odysseyLink.addEventListener('click', (event) => {
          event.preventDefault();
          const randomUrl = urls[Math.floor(Math.random() * urls.length)];
          window.location.href = randomUrl;
        });
      }
  
      // Accordion Logic
      const accordionItems = document.querySelectorAll('.accordion-item');
      accordionItems.forEach((item) => {
        const title = item.querySelector('.accordion-title');
        const content = item.querySelector('.accordion-content');
  
        if (title && content && !initializedElements.has(title)) {
          initializedElements.add(title);
          title.addEventListener('click', () => {
            const isActive = title.classList.contains('active');
  
            // Collapse all accordion items
            accordionItems.forEach((i) => {
              const otherTitle = i.querySelector('.accordion-title');
              const otherContent = i.querySelector('.accordion-content');
              if (otherTitle && otherContent) {
                otherTitle.classList.remove('active');
                otherContent.style.display = 'none';
              }
            });
  
            if (!isActive) {
              title.classList.add('active');
              content.style.display = 'block';
            }
          });
        }
      });

      //Post-it Note Logic
      initializePostItNote();
    }

    // Debug Geolocation and Reverse Geocoding
    async function testGeolocationAndReverseGeocoding() {
      const debugLocation = document.getElementById("debug-location").querySelector("span");
      const debugPlace = document.getElementById("debug-place").querySelector("span");

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            debugLocation.textContent = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;

            try {
              const reverseGeocodeUrl = `${API_BASE_URL}/api/reverse-geocode?lat=${latitude}&lon=${longitude}`;
              const response = await fetch(reverseGeocodeUrl);

              if (!response.ok) {
                throw new Error(`Reverse Geocoding API Error: ${response.status}`);
              }

              const data = await response.json();

              if (data.city && data.country) {
                debugPlace.textContent = `${data.city}, ${data.country}`;
              } else {
                debugPlace.textContent = "Reverse geocoding failed: No valid city or country returned.";
              }
            } catch (error) {
              console.error("Error fetching reverse geocoding data:", error);
              debugPlace.textContent = `Error: ${error.message}`;
            }
          },
          (error) => {
            console.error("Error fetching geolocation:", error);
            debugLocation.textContent = `Error: ${error.message}`;
            debugPlace.textContent = "Reverse geocoding skipped due to geolocation error.";
          }
        );
      } else {
        debugLocation.textContent = "Geolocation is not supported by this browser.";
        debugPlace.textContent = "Reverse geocoding skipped.";
      }
    }
    // Fetch Weather Data
    function fetchWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
    
            // Construct the weather proxy URL with query parameters
            const urlWithParams = `${weatherProxyUrl}?lat=${latitude}&lon=${longitude}`;
            console.log("Fetching weather data from:", urlWithParams);
    
            try {
              const response = await fetch(urlWithParams);
    
              if (!response.ok) {
                throw new Error(`Weather API Error: ${response.status}`);
              }
    
              const data = await response.json();
              console.log("Weather data received:", data);
    
              const weatherWidget = document.getElementById("weather-widget");
              const location = data.location;
              const temperature = data.temperature;
              const condition = data.condition;
              const icon = data.icon;
    
              weatherWidget.innerHTML = `
                <div class="weather-widget">
                  <img src="${icon}" alt="${condition}" class="weather-icon" />
                  <div class="weather-details">
                    <div class="weather-location">${location}</div>
                    <div class="weather-temp">${temperature}°F</div>
                    <div class="weather-condition">${condition}</div>
                  </div>
                </div>
              `;
            } catch (error) {
              console.error("Error fetching weather data:", error);
              const weatherWidget = document.getElementById("weather-widget");
              weatherWidget.innerText = "Failed to load weather data.";
            }
          },
          (error) => {
            console.error("Error fetching geolocation:", error.message);
            const weatherWidget = document.getElementById("weather-widget");
            weatherWidget.innerText = "Failed to get geolocation.";
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        const weatherWidget = document.getElementById("weather-widget");
        weatherWidget.innerText = "Geolocation is not supported by this browser.";
      }
    }

    // function initializePostItNote() {
    //   const trigger = document.getElementById('note-trigger'); // The trigger for the Post-it Note
    //   const note = document.querySelector('.nostalgic-note'); // The Post-it Note container
    
    //   // Ensure both elements exist before adding logic
    //   if (trigger && note && !trigger.dataset.initialized) {
    //     trigger.dataset.initialized = 'true'; // Mark trigger as initialized to prevent duplicate listeners
    
    //     trigger.addEventListener('click', () => {
    //       const currentDisplay = window.getComputedStyle(note).display;
    
    //       if (currentDisplay === 'none') {
    //         note.style.display = 'flex'; // Show the note
    //       } else {
    //         note.style.display = 'none'; // Hide the note
    //       }
    //     });
    
    //     console.log('Post-it Note initialized successfully.');
    //   } else if (!trigger || !note) {
    //     console.warn('Post-it Note trigger or container not found.');
    //   }
    // }
    // Fetch Moon Phase Data
    function fetchMoonPhase() {
      fetch(moonPhaseProxyUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Moon Phase API Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const moonPhaseWidget = document.getElementById('moon-phase-widget');
        const ageDays = data.moon.age_days;
        const phaseName = data.moon.phase_name;
        const zodiac = data.moon.zodiac.moon_sign;
        const emoji = data.moon.emoji;

        moonPhaseWidget.innerHTML = `
          
          <div class="moon-widget">
            <div class="moon-info">
              <div class="moon-phase">${phaseName}</div>
              <div class="moon-zodiac">Zodiac: ${zodiac}</div>
            </div>
          </div>
        `;
      })
        .catch((error) => {
          console.error('Error fetching moon data:', error);
          const moonPhaseWidget = document.getElementById('moon-phase-widget');
          moonPhaseWidget.innerText = 'Failed to load moon data.';
        });
    }

    async function fetchPlaceFromCoordinates(latitude, longitude) {
      const cachedPlace = localStorage.getItem('userPlace');

      if (cachedPlace) {
        console.log('Using cached geolocation data:', cachedPlace);
        return cachedPlace; // Return cached result
      }
      
      const reverseGeocodeUrl = `${API_BASE_URL}/api/reverse-geocode?lat=${latitude}&lon=${longitude}`;
      
      try {
        const response = await fetch(reverseGeocodeUrl);
        if (!response.ok) {
          throw new Error(`Reverse Geocoding API Error: ${response.status}`);
        }
    
        const data = await response.json();
        if (data.city && data.country) {
          return `${data.city},${data.country}`; // Return the place in "City,Country" format
        } else {
          throw new Error("No valid city or country returned from reverse geocoding.");
        }
      } catch (error) {
        console.error("Error fetching place from coordinates:", error);
        throw error; // Re-throw the error to handle it in the calling function
      }
    }

    //Bloghandy logic
    function initializeBlogHandy() {
      // BlogHandy ID
      const bhId = "609Fe4CuPO0LIrNTA3Nw";
      console.log("Initializing BlogHandy with ID:", bhId);
    
      // Check if BlogHandy script is already loaded
      if (!document.querySelector('script[src="https://www.bloghandy.com/api/bh_blogengine.js"]')) {
        // Dynamically create and load BlogHandy script
        const script = document.createElement('script');
        script.src = "https://www.bloghandy.com/api/bh_blogengine.js";
        script.async = true;
    
        script.onload = () => {
          console.log("BlogHandy script loaded successfully.");
          // Dynamically add #bh-posts container content after loading
          const bhPostsContainer = document.getElementById('bh-posts');
          if (bhPostsContainer) {
            console.log("BlogHandy posts container found.");
            
            bhPostsContainer.innerHTML = `
              <div style="text-align: center; font-size: 14px; color: gray;">
                Loading essays...
              </div>
            `;
          } else {
            console.warn("#bh-posts container not found in the DOM.");
          }
        };
    
        script.onerror = () => {
          console.error("Failed to load BlogHandy script.");
        };
    
        document.head.appendChild(script); 
      } else {
        console.log("BlogHandy script already loaded.");
      }
    }
  
    // Monitor for Dynamic DOM Changes
    const observer = new MutationObserver(() => {
      initializeWidgets();
      initializeBlogHandy();
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  
    // Initialize Widgets on Initial Load
    document.addEventListener('DOMContentLoaded', () => {
      initializeWidgets();
      initializeBlogHandy();
    });
  })();
