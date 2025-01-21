(() => {
    // Configuration Variables
    const weatherProxyUrl = 'https://weather-moon-api.onrender.com/api/weather';
    const moonPhaseProxyUrl = 'https://weather-moon-api.onrender.com/api/moon-phase';
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
      const popup = document.getElementById('newsletter-popup');
      const overlay = document.getElementById('popup-overlay');
      const closeButton = document.getElementById('close-popup');
  
      if (guestbookButton && !initializedElements.has(guestbookButton)) {
        initializedElements.add(guestbookButton);
        guestbookButton.addEventListener('click', () => {
          popup.style.display = 'block';
          overlay.style.display = 'block';
        });
  
        closeButton.addEventListener('click', () => {
          popup.style.display = 'none';
          overlay.style.display = 'none';
        });
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
  
            // Expand the clicked item
            if (!isActive) {
              title.classList.add('active');
              content.style.display = 'block';
            }
          });
        }
      });
    }
  
    // Fetch Weather Data
    function fetchWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=imperial`;
  
            fetch(weatherUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Weather API Error: ${response.status}`);
              }
              return response.json();
            })
              .then((data) => {
                const weatherWidget = document.getElementById('weather-widget');
                const location = data.name;
                const temperature = data.main.temp;
                const condition = data.weather[0].description;
                const iconCode = data.weather[0].icon;
  
                weatherWidget.innerHTML = `
                  <img
                    src="https://openweathermap.org/img/wn/${iconCode}@2x.png"
                    alt="${condition}"
                    class="weather-icon"
                  />
                  <div class="weather-details">
                    <div class="weather-location">${location}</div>
                    <div class="weather-temp">${temperature.toFixed(0)}°F</div>
                    <div class="weather-condition">${condition.charAt(0).toUpperCase() + condition.slice(1)}</div>
                  </div>
                `;
              })
              .catch((error) => {
                console.error('Error fetching weather data:', error);
                const weatherWidget = document.getElementById('weather-widget');
                weatherWidget.innerText = 'Failed to load weather data.';
              });
          },
          (error) => {
            console.error('Error getting location:', error);
            const weatherWidget = document.getElementById('weather-widget');
            weatherWidget.innerText = 'Location access denied.';
          }
        );
      } else {
        const weatherWidget = document.getElementById('weather-widget');
        weatherWidget.innerText = 'Geolocation is not supported by this browser.';
      }
    }
  
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
          <div class="weather-icon">${emoji}</div>
          <div class="weather-widget">
            <div class="weather-location">Age days: ${ageDays}</div>
            <div class="weather-temp">Phase: ${phaseName}</div>
            <div class="weather-condition">Zodiac: ${zodiac}</div>
          </div>
        `;
      })
        .catch((error) => {
          console.error('Error fetching moon data:', error);
          const moonPhaseWidget = document.getElementById('moon-phase-widget');
          moonPhaseWidget.innerText = 'Failed to load moon data.';
        });
    }
  
    // Monitor for Dynamic DOM Changes
    const observer = new MutationObserver(() => {
      initializeWidgets();
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  
    // Initialize Widgets on Initial Load
    document.addEventListener('DOMContentLoaded', () => {
      initializeWidgets();
    });
  })();