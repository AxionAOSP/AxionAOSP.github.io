/**
 * Main entry point - runs when DOM is fully loaded
 * Handles device data fetching, processing, and UI rendering : should work fine now i think using the unified .json
 */
document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('.downloads-grid');
  const loading = document.querySelector('.loading-state');

  try {
    loading.style.display = 'flex';
    console.log('Fetching device data...');

    // Direct data fetching without caching
    try {
      // Fetch unified device info from JSON
      const deviceInfoRes = await fetch('https://raw.githubusercontent.com/AxionAOSP/official_devices/refs/heads/main/dinfo.json');
      console.log('Device Info Response:', deviceInfoRes.status, deviceInfoRes.statusText);
      
      if (!deviceInfoRes.ok) {
        throw new Error(`Failed to fetch device info: ${deviceInfoRes.status} ${deviceInfoRes.statusText}`);
      }
      
      // Parse the JSON data
      const deviceData = await deviceInfoRes.json();
      
      console.log(`Loaded ${deviceData.devices.length} devices from devices.json`);
      
      // Process device data
      const processedDevices = processDevices(deviceData.devices);
      console.log(`Processed ${processedDevices.length} devices`);
      
      console.log('Creating device elements...');
      const deviceElements = await createDeviceElements(processedDevices);
      console.log(`Created ${deviceElements.length} device elements`);
      
      // Clear the grid before adding elements
      grid.innerHTML = '';
      
      deviceElements.forEach(element => {
        // Make all cards visible by default for better UX
        element.style.display = 'block';
        grid.appendChild(element);
      });

      initFilters();
      initSearch();
      initModalLogic();
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }

  } catch (error) {
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    grid.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load devices: ${error.message}</p>
        <p>Please check the console for details or visit the 
           <a href="https://github.com/AxionAOSP/official_devices" target="_blank">official repository</a>.
        </p>
      </div>
    `;
  } finally {
    loading.style.display = 'none';
  }
});

/**
 * Processes device data from devices.json
 * @param {Array} devices - Array of devices from devices.json
 * @returns {Array} Processed device list with brand info
 */
function processDevices(devices) {
  return devices.map(device => {
    // Determine brand from device name
    const brandName = getDeviceBrand(device.device_name);
    
    console.log(`Processed device: ${device.codename} (${device.device_name}) - Brand: ${brandName} - Maintainer: ${device.maintainer}`);
    
    return {
      name: device.device_name,
      codename: device.codename,
      brand: brandName,
      maintainer: device.maintainer,
      support_group: device.support_group || '',
      image_url: device.image_url || 'img/fallback.png'
    };
  });
}

/**
 * Creates device card elements with lazy-loaded images
 * @param {Array} devices - Processed device list
 * @returns {Promise<Array>} Array of device card elements
 */
function createDeviceElements(devices) {
  const usedCodenames = new Set();

  return Promise.all(
    devices.map(async (device) => {
      try {
        if (usedCodenames.has(device.codename)) {
          console.warn(`Duplicate codename skipped: ${device.codename}`);
          return null;
        }
        usedCodenames.add(device.codename);

        const element = document.createElement('div');
        element.className = 'device-card';
        element.dataset.brand = device.brand;

        console.log(`Fetching flavor data for ${device.codename}...`);
        const [gms, vanilla] = await Promise.all([
          fetchFlavorData(device.codename, 'GMS'),
          fetchFlavorData(device.codename, 'VANILLA'),
        ]);
        
        console.log(`Flavor data for ${device.codename}: GMS=${!!gms}, Vanilla=${!!vanilla}`);

        const imageUrl = device.image_url || 'img/fallback.png';
        console.log(`Image URL for ${device.codename}: ${imageUrl}`);

        const flavorHtml = `
          ${gms ? renderFlavor('GMS', gms) : ''}
          ${vanilla ? renderFlavor('Vanilla', vanilla) : ''}
        `;

        element.innerHTML = `
          <div class="device-header" data-flavors="${encodeURIComponent(flavorHtml)}">
            <img 
              src="${imageUrl}"
              class="device-thumb"
              alt="${device.name}"
              loading="lazy"
              onerror="this.onerror=null; console.error('Failed to load image for ${device.codename}'); this.src='img/fallback.png';"
            />
            <div class="device-info">
              <div class="device-name">${device.name} (${device.codename})</div>
              <div class="maintainer">by ${device.maintainer}</div>
            </div>
          </div>
        `;

        // Add a flag to indicate if this device has builds available
        element.dataset.hasBuilds = (!!gms || !!vanilla).toString();

        return element;
      } catch (error) {
        console.error(`Error creating element for ${device.codename}:`, error);
        return null;
      }
    })
  ).then(elements => {
    const filteredElements = elements.filter(Boolean);
    console.log(`Created ${filteredElements.length} out of ${devices.length} device elements`);
    return filteredElements;
  });
}

/* ======================
   FLAVOR DATA HANDLING
   ====================== */

/**
 * Fetches flavor data for a device
 * @param {string} codename - Device codename
 * @param {string} type - Flavor type (GMS/VANILLA)
 * @returns {Promise<object|null>} Flavor data or null
 */
async function fetchFlavorData(codename, type) {
  try {
    const url = `https://raw.githubusercontent.com/AxionAOSP/official_devices/main/OTA/${type}/${codename.toLowerCase()}.json`;
    console.log(`Fetching ${type} data from: ${url}`);
    
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`No ${type} build for ${codename}: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    if (!data.response || !data.response[0]) {
      console.log(`Empty ${type} data for ${codename}`);
      return null;
    }
    
    console.log(`Found ${type} build for ${codename}`);
    return data.response[0];
  } catch (error) {
    console.error(`Error fetching ${type} data for ${codename}:`, error);
    return null;
  }
}

/**
 * Generates HTML for a build flavor
 * @param {string} type - Flavor type
 * @param {object} data - Flavor data
 * @returns {string} HTML string
 */
function renderFlavor(type, data) {
  if (!data) return '';

  const sizeMB = data.size ? (data.size / 1024 / 1024).toFixed(1) + 'MB' : 'N/A';
  const buildDate = data.datetime ? new Date(data.datetime * 1000).toLocaleDateString() : 'N/A';
  const hasDownload = data.url && data.url.trim() !== '';

  return `
    <div class="flavor-card">
      <div class="flavor-header">
        <div class="flavor-title">${type}</div>
        ${hasDownload ? `
          <a href="${data.url}" class="download-btn" download target="_blank">
            <i class="fas fa-download"></i> ${sizeMB}
          </a>
        ` : `
          <span class="download-btn disabled">
            <i class="fas fa-ban"></i> N/A
          </span>
        `}
      </div>
      ${hasDownload ? `
        <div class="version-info">
          <div>Version: ${data.version}</div>
          <div>Build Date: ${buildDate}</div>
          <div>File: ${data.filename}</div>
        </div>
      ` : ''}
    </div>
  `;
}

/* ======================
   UI INTERACTIONS
   ====================== */

/**
 * Initializes modal dialog for flavor details
 */
function initModalLogic() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModalBtn');

  document.querySelector('.downloads-grid').addEventListener('click', (event) => {
    const deviceHeader = event.target.closest('.device-header');
    if (!deviceHeader) return;
  
    const flavorsData = deviceHeader.dataset.flavors;
    if (!flavorsData || decodeURIComponent(flavorsData).trim() === '') {
      showSnackbar("No builds available for this device yet.");
      return;
    }
  
    modalBody.innerHTML = decodeURIComponent(flavorsData);
    modalOverlay.classList.add('active');
  });

  closeModalBtn.addEventListener('click', () => closeModal());
  modalOverlay.addEventListener('click', (e) => e.target === modalOverlay && closeModal());

  function closeModal() {
    modalOverlay.classList.remove('active');
    modalBody.innerHTML = '';
  }
}

function showSnackbar(message) {
  let snackbar = document.getElementById('snackbar');

  if (!snackbar) {
    snackbar = document.createElement('div');
    snackbar.id = 'snackbar';
    document.body.appendChild(snackbar);
  }

  snackbar.textContent = message;
  snackbar.className = 'show';

  setTimeout(() => {
    snackbar.className = snackbar.className.replace('show', '');
  }, 3000);
}

/**
 * Initializes search functionality
 */
function doSearch() {
  const searchInput = document.getElementById('deviceSearch');
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();
  const deviceCards = document.querySelectorAll('.device-card');
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter;

  deviceCards.forEach(card => {
    const name = card.querySelector('.device-name')?.textContent.toLowerCase() || '';
    const maintainer = card.querySelector('.maintainer')?.textContent.toLowerCase() || '';

    const matchesSearch = query === '' || name.includes(query) || maintainer.includes(query);
    const matchesFilter = !activeFilter || activeFilter === 'all' || card.dataset.brand === activeFilter;

    card.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
  });
}

function initSearch() {
  const searchInput = document.getElementById('deviceSearch');
  if (!searchInput) {
    console.error('Search input not found');
    return;
  }

  searchInput.addEventListener('input', doSearch);
  searchInput.addEventListener('change', doSearch);

  const storedSearch = localStorage.getItem("deviceSearchText");

  if (storedSearch) {
    setTimeout(() => {
      const input = document.getElementById('deviceSearch');
      if (input) {
        input.value = storedSearch;
        localStorage.removeItem("deviceSearchText");
        input.dispatchEvent(new Event('input', { bubbles: true }));
        doSearch();
      }
    }, 100);
  }
}

/**
 * Initializes brand filtering buttons
 */
function initFilters() {
  const filterContainer = document.querySelector('.filter-container');
  if (!filterContainer) {
    console.error('Filter container not found');
    return;
  }
  
  // Get all unique brands from the device cards
  const brands = new Set();
  document.querySelectorAll('.device-card').forEach(card => {
    if (card.dataset.brand) {
      brands.add(card.dataset.brand);
    }
  });
  
  // Create filter buttons dynamically
  if (brands.size > 0) {
    // Add "All" button
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.dataset.filter = 'all';
    allBtn.textContent = 'All';
    filterContainer.appendChild(allBtn);
    
    // Add brand buttons
    Array.from(brands).sort().forEach(brand => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = brand;
      btn.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
      filterContainer.appendChild(btn);
    });
  }
  
  // Add click event listener
  filterContainer.addEventListener('click', (event) => {
    const btn = event.target.closest('.filter-btn');
    if (!btn) return;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.device-card').forEach(card => {
      if (filter === 'all') {
        card.style.display = 'block';
      } else {
        card.style.display = card.dataset.brand === filter ? 'block' : 'none';
      }
    });
    
    // Clear search when changing filter
    const searchInput = document.getElementById('deviceSearch');
    if (searchInput) {
      searchInput.value = '';
    }
  });
}

/* ======================
   UTILITIES
   ====================== */

/**
 * Determines device brand from name
 * @param {string} deviceName - Full device name
 * @returns {string} Brand identifier
 */
function getDeviceBrand(deviceName) {
  // Brand detection patterns
  const brands = {
    google: /Google Pixel/i,
    samsung: /Galaxy|Samsung/i,
    poco: /POCO/i,
    realme: /Realme/i,
    xiaomi: /Xiaomi|Redmi|Mi/i,
    tecno: /TECNO/i,
    motorola: /Motorola|Moto/i,
    oneplus: /Oneplus|OnePlus/i,
  };

  const brand = Object.entries(brands).find(([_, regex]) =>
    regex.test(deviceName)
  )?.[0] || 'other';

  return brand;
}
