const fetchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function cachedFetch(url, options = {}) {
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  const cached = fetchCache.get(cacheKey);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.response.clone();
  }
  
  const response = await fetch(url, {
    ...options,
    cache: options.cache || 'default'
  });
  
  if (response.ok) {
    fetchCache.set(cacheKey, {
      response: response.clone(),
      timestamp: now
    });
  }
  
  return response;
}

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('.downloads-grid');
  const loading = document.querySelector('.loading-state');

  try {
    loading.style.display = 'flex';

    const deviceInfoRes = await cachedFetch('https://raw.githubusercontent.com/AxionAOSP/official_devices/refs/heads/main/dinfo.json', {
      cache: 'default'
    });
    
    if (!deviceInfoRes.ok) {
      throw new Error(`Failed to fetch device info: ${deviceInfoRes.status} ${deviceInfoRes.statusText}`);
    }
    
    const deviceData = await deviceInfoRes.json();
    const processedDevices = processDevices(deviceData.devices);
    
    // Use requestIdleCallback for non-critical operations on supported browsers
    const loadDevices = async () => {
      const deviceElements = await createDeviceElements(processedDevices);
      
      grid.innerHTML = '';
      const fragment = document.createDocumentFragment();
      deviceElements.forEach(element => {
        element.style.display = 'block';
        fragment.appendChild(element);
      });
      grid.appendChild(fragment);

      initFilters();
      initSearch();
      initModalLogic();
      loading.style.display = 'none';
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadDevices, { timeout: 2000 });
    } else {
      setTimeout(loadDevices, 0);
    }
  } catch (error) {
    console.error('Error loading devices:', error);
    grid.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load devices: ${error.message}</p>
        <p>Please check the console for details or visit the 
           <a href="https://github.com/AxionAOSP/official_devices" target="_blank">official repository</a>.
        </p>
      </div>
    `;
    loading.style.display = 'none';
  }
});

function processDevices(devices) {
  const GITHUB_IMAGE_BASE = 'https://raw.githubusercontent.com/AxionAOSP/official_devices/refs/heads/main/OTA/Banners/devices';
  
  return devices.map(device => {
    const brandName = getDeviceBrand(device.device_name);
    const originalCodename = device.codename;
    const lowerCodename = originalCodename.toLowerCase();
    const localImageUrl = `${GITHUB_IMAGE_BASE}/${originalCodename}.webp`;
    const localImageUrlLower = `${GITHUB_IMAGE_BASE}/${lowerCodename}.webp`;
    const originalImageUrl = device.image_url || 'img/fallback.png';
    
    const statusValue = device.status || 'Active';
    const statusLower = String(statusValue).toLowerCase();
    const isActive = statusLower === 'active';
    
    return {
      name: device.device_name,
      codename: device.codename,
      brand: brandName,
      maintainer: device.maintainer,
      github_username: device.github_username || device.maintainer.split(' ')[0],
      support_group: device.support_group || '',
      image_url: localImageUrl,
      image_url_lower: localImageUrlLower,
      original_image_url: originalImageUrl,
      status: isActive ? 'active' : 'inactive'
    };
  });
}

function createDeviceElements(devices) {
  const usedCodenames = new Set();

  return Promise.all(
    devices.map(async (device) => {
      try {
        if (usedCodenames.has(device.codename)) {
          return null;
        }
        usedCodenames.add(device.codename);

        const element = document.createElement('div');
        element.className = 'device-card';
        element.dataset.brand = device.brand;

        const [gms, vanilla] = await Promise.all([
          fetchFlavorData(device.codename, 'GMS'),
          fetchFlavorData(device.codename, 'VANILLA'),
        ]);
        
        const imageUrl = device.image_url || 'img/fallback.png';
        const imageUrlLower = device.image_url_lower || 'img/fallback.png';
        const fallbackImageUrl = device.original_image_url || 'img/fallback.png';

        element.dataset.deviceName = device.name;
        element.dataset.codename = device.codename;
        element.dataset.maintainer = device.maintainer;
        element.dataset.githubUsername = device.github_username;
        element.dataset.imageUrl = imageUrl;
        element.dataset.imageUrlLower = imageUrlLower;
        element.dataset.fallbackImageUrl = fallbackImageUrl;
        element.dataset.supportGroup = device.support_group || '';
        element.dataset.status = device.status || 'active';
        element.dataset.gmsData = gms ? JSON.stringify(gms) : '';
        element.dataset.vanillaData = vanilla ? JSON.stringify(vanilla) : '';
        
        if (device.status === 'inactive') {
          element.classList.add('device-inactive');
        }

        const maintainerUsername = device.github_username;
        const maintainerAvatar = `https://github.com/${maintainerUsername}.png?size=40`;
        const maintainerGithub = `https://github.com/${maintainerUsername}`;

        const latestVersion = gms?.version || vanilla?.version || null;

        element.innerHTML = `
          <div class="device-header">
            <div class="device-image-wrapper">
              <div class="device-image-blur" style="background-image: url('${imageUrl}')"></div>
              <img 
                src="${imageUrl}"
                class="device-thumb"
                alt="${device.name}"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                onerror="handleDeviceImageError(this, '${imageUrlLower}', '${fallbackImageUrl}')"
                onload="handleWhiteBackground(this)"
              />
              ${latestVersion ? `
                <div class="device-version-badge">
                  <span class="version-badge-text">v${latestVersion}</span>
                </div>
              ` : ''}
            </div>
            <div class="device-info">
              <div class="device-name-wrapper">
                <div class="device-name">${device.name}</div>
                <div class="device-status-badge ${device.status === 'inactive' ? 'status-inactive' : 'status-active'}">
                  <i class="fas ${device.status === 'inactive' ? 'fa-pause-circle' : 'fa-check-circle'}"></i>
                  <span>${device.status === 'inactive' ? 'Inactive' : 'Active'}</span>
                </div>
              </div>
              <div class="device-codename">${device.codename}</div>
              <a href="${maintainerGithub}" target="_blank" rel="noopener noreferrer" class="maintainer-info">
                <img src="${maintainerAvatar}" alt="${device.maintainer}" class="maintainer-avatar" onerror="this.src='img/fallback.png';" />
                <div class="maintainer-text">
                  <span class="maintainer-label">Maintained by</span>
                  <span class="maintainer-name">${device.maintainer}</span>
                </div>
              </a>
            </div>
            <div class="view-builds-btn">
              <span>View Builds</span>
              <i class="fas fa-download"></i>
            </div>
          </div>
        `;

        element.dataset.hasBuilds = (!!gms || !!vanilla).toString();

        return element;
      } catch (error) {
        console.error(`Error creating element for ${device.codename}:`, error);
        return null;
      }
    })
  ).then(elements => {
    return elements.filter(Boolean);
  });
}

async function fetchFlavorData(codename, type) {
  try {
    const url = `https://raw.githubusercontent.com/AxionAOSP/official_devices/main/OTA/${type}/${codename}.json`;
    const res = await cachedFetch(url, { cache: 'default' });
    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!data.response || !data.response[0]) {
      return null;
    }
    
    return data.response[0];
  } catch (error) {
    return null;
  }
}

function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function renderBuildCard(type, build) {
  if (!build) return '';

  const sizeFormatted = formatBytes(build.size);
  const buildDate = formatDate(build.datetime);
  const md5Hash = build.id || 'N/A';

  return `
    <div class="build-card">
      <div class="build-header">
        <h3 class="build-type">
          ${type === 'GMS' ? 'GApps' : 'Vanilla'}
          <span class="version-badge">v${build.version}</span>
        </h3>
        <p class="build-date">
          <i class="fas fa-calendar"></i> ${buildDate}
        </p>
      </div>
      <div class="build-details">
        <p class="build-filename">
          <i class="fas fa-file"></i> <span>${build.filename}</span>
        </p>
        <div class="build-md5">
          <span class="md5-label"><i class="fas fa-hashtag"></i> MD5:</span>
          <span class="md5-value" id="md5-${type}-${build.id}">${md5Hash}</span>
          <button class="copy-md5-btn" data-md5="${md5Hash}" title="Copy MD5">
            <i class="fas fa-copy"></i>
          </button>
        </div>
      </div>
      <a href="${build.url}" target="_blank" rel="noopener noreferrer" class="download-build-btn">
        <i class="fas fa-download"></i> Download (${sizeFormatted})
      </a>
    </div>
  `;
}

async function fetchDeviceChangelog(codename) {
  try {
    const url = `https://raw.githubusercontent.com/AxionAOSP/official_devices/main/OTA/CHANGELOG/${codename}.txt`;
    const res = await cachedFetch(url, { cache: 'default' });
    if (!res.ok) return null;
    return await res.text();
  } catch (error) {
    console.error(`Error fetching changelog for ${codename}:`, error);
    return null;
  }
}

function initModalLogic() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModalBtn');

  document.querySelector('.downloads-grid').addEventListener('click', async (event) => {
    const deviceCard = event.target.closest('.device-card');
    if (!deviceCard) return;

    const deviceHeader = event.target.closest('.device-header');
    if (!deviceHeader) return;

    const codename = deviceCard.dataset.codename;
    const deviceName = deviceCard.dataset.deviceName;
    const maintainer = deviceCard.dataset.maintainer;
    const githubUsername = deviceCard.dataset.githubUsername || maintainer.split(' ')[0];
    const imageUrl = deviceCard.dataset.imageUrl;
    const supportGroup = deviceCard.dataset.supportGroup;
    
    const gmsData = deviceCard.dataset.gmsData ? JSON.parse(deviceCard.dataset.gmsData) : null;
    const vanillaData = deviceCard.dataset.vanillaData ? JSON.parse(deviceCard.dataset.vanillaData) : null;

    if (!gmsData && !vanillaData) {
      showSnackbar("No builds available for this device yet.");
      return;
    }

    const changelog = await fetchDeviceChangelog(codename);
    const maintainerAvatar = `https://github.com/${githubUsername}.png?size=56`;
    const maintainerGithub = `https://github.com/${githubUsername}`;

    let activeTab = 'gms';
    if (!gmsData && vanillaData) activeTab = 'vanilla';
    else if (gmsData) activeTab = 'gms';

    const availableBuilds = (gmsData ? 1 : 0) + (vanillaData ? 1 : 0);

    modalBody.innerHTML = `
      <div class="device-modal-content">
        <div class="device-info-card">
          <h3 class="device-modal-name">${deviceName}</h3>
          <p class="device-modal-codename">${codename}</p>
          <div class="device-maintainer-card">
            <a href="${maintainerGithub}" target="_blank" rel="noopener noreferrer" class="maintainer-link">
              <img src="${maintainerAvatar}" alt="${maintainer}" class="maintainer-modal-avatar" onerror="this.src='img/fallback.png';" />
              <div class="maintainer-modal-info">
                <p class="maintainer-modal-label">Maintained by</p>
                <p class="maintainer-modal-name">${maintainer}</p>
              </div>
            </a>
          </div>
        </div>

        <div class="builds-section">
          ${availableBuilds > 1 ? `
            <div class="build-tabs">
              <button class="tab-btn ${activeTab === 'gms' ? 'active' : ''}" data-tab="gms" ${!gmsData ? 'disabled' : ''}>
                GApps
              </button>
              <button class="tab-btn ${activeTab === 'vanilla' ? 'active' : ''}" data-tab="vanilla" ${!vanillaData ? 'disabled' : ''}>
                Vanilla
              </button>
            </div>
          ` : ''}
          
          <div class="tab-content">
            ${gmsData ? `
              <div class="tab-pane ${activeTab === 'gms' ? 'active' : ''}" data-tab="gms">
                ${renderBuildCard('GMS', gmsData)}
              </div>
            ` : ''}
            ${vanillaData ? `
              <div class="tab-pane ${activeTab === 'vanilla' ? 'active' : ''}" data-tab="vanilla">
                ${renderBuildCard('Vanilla', vanillaData)}
              </div>
            ` : ''}
          </div>
        </div>

        ${changelog ? `
          <div class="changelog-section">
            <button class="changelog-toggle">
              <i class="fas fa-file-alt"></i> Device Changelog
              <i class="fas fa-chevron-down"></i>
            </button>
            <div class="changelog-content">
              <pre>${changelog}</pre>
            </div>
          </div>
        ` : ''}

        ${supportGroup ? `
          <a href="${supportGroup}" target="_blank" rel="noopener noreferrer" class="support-group-btn">
            <i class="fas fa-users"></i> Support Group
          </a>
        ` : ''}
      </div>
    `;

    const tabButtons = modalBody.querySelectorAll('.tab-btn');
    const tabPanes = modalBody.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        modalBody.querySelector(`.tab-pane[data-tab="${targetTab}"]`)?.classList.add('active');
      });
    });

    const changelogToggle = modalBody.querySelector('.changelog-toggle');
    const changelogContent = modalBody.querySelector('.changelog-content');
    if (changelogToggle && changelogContent) {
      changelogToggle.addEventListener('click', () => {
        changelogContent.classList.toggle('active');
        const chevron = changelogToggle.querySelector('.fa-chevron-down');
        if (chevron) {
          chevron.classList.toggle('rotated');
        }
      });
    }

    modalBody.querySelectorAll('.copy-md5-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const md5 = btn.dataset.md5;
        try {
          await navigator.clipboard.writeText(md5);
          btn.innerHTML = '<i class="fas fa-check"></i>';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i>';
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy MD5:', err);
          showSnackbar('Failed to copy MD5');
        }
      });
    });

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

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function doSearch() {
  const searchInput = document.getElementById('deviceSearch');
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();
  const deviceCards = document.querySelectorAll('.device-card');
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter;

  requestAnimationFrame(() => {
    deviceCards.forEach(card => {
      const name = card.querySelector('.device-name')?.textContent.toLowerCase() || '';
      const maintainer = card.querySelector('.maintainer')?.textContent.toLowerCase() || '';

      const matchesSearch = query === '' || name.includes(query) || maintainer.includes(query);
      const matchesFilter = !activeFilter || activeFilter === 'all' || card.dataset.brand === activeFilter;

      card.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById('deviceSearch');
  if (!searchInput) return;

  const debouncedSearch = debounce(doSearch, 150);
  searchInput.addEventListener('input', debouncedSearch);
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

function initFilters() {
  const filterContainer = document.querySelector('.filter-container');
  if (!filterContainer) return;
  
  const brands = new Set();
  document.querySelectorAll('.device-card').forEach(card => {
    if (card.dataset.brand) {
      brands.add(card.dataset.brand);
    }
  });
  
  if (brands.size > 0) {
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.dataset.filter = 'all';
    allBtn.textContent = 'All';
    filterContainer.appendChild(allBtn);
    
    Array.from(brands).sort().forEach(brand => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = brand;
      btn.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
      filterContainer.appendChild(btn);
    });
  }
  
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
    
    const searchInput = document.getElementById('deviceSearch');
    if (searchInput) {
      searchInput.value = '';
    }
  });
}

function handleDeviceImageError(img, lowerCaseUrl, fallbackUrl) {
  if (img.src.includes('img/fallback.png')) {
    return;
  }
  
  const blurDiv = img.closest('.device-image-wrapper')?.querySelector('.device-image-blur');
  const githubImageBase = 'https://raw.githubusercontent.com/AxionAOSP/official_devices/refs/heads/main/OTA/Banners/devices';
  
  if (img.src.includes(githubImageBase) || img.src.includes('img/devices/')) {
    if (lowerCaseUrl && lowerCaseUrl !== 'img/fallback.png' && img.src !== lowerCaseUrl) {
      img.onerror = function() {
        if (fallbackUrl && fallbackUrl !== 'img/fallback.png') {
          this.onerror = function() {
            this.onerror = null;
            this.src = 'img/fallback.png';
            if (blurDiv) {
              blurDiv.style.backgroundImage = "url('img/fallback.png')";
            }
          };
          this.src = fallbackUrl;
          if (blurDiv) {
            blurDiv.style.backgroundImage = `url('${fallbackUrl}')`;
          }
        } else {
          this.onerror = null;
          this.src = 'img/fallback.png';
          if (blurDiv) {
            blurDiv.style.backgroundImage = "url('img/fallback.png')";
          }
        }
      };
      img.src = lowerCaseUrl;
      if (blurDiv) {
        blurDiv.style.backgroundImage = `url('${lowerCaseUrl}')`;
      }
    } else if (fallbackUrl && fallbackUrl !== 'img/fallback.png') {
      img.onerror = function() {
        this.onerror = null;
        this.src = 'img/fallback.png';
        if (blurDiv) {
          blurDiv.style.backgroundImage = "url('img/fallback.png')";
        }
      };
      img.src = fallbackUrl;
      if (blurDiv) {
        blurDiv.style.backgroundImage = `url('${fallbackUrl}')`;
      }
    } else {
      img.onerror = null;
      img.src = 'img/fallback.png';
      if (blurDiv) {
        blurDiv.style.backgroundImage = "url('img/fallback.png')";
      }
    }
  } else {
    img.onerror = null;
    img.src = 'img/fallback.png';
    if (blurDiv) {
      blurDiv.style.backgroundImage = "url('img/fallback.png')";
    }
  }
}

function handleWhiteBackground(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = Math.min(img.naturalWidth || 100, 100);
  canvas.height = Math.min(img.naturalHeight || 100, 100);
  
  try {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const samplePoints = [
      [0, 0],
      [canvas.width - 1, 0],
      [0, canvas.height - 1],
      [canvas.width - 1, canvas.height - 1],
      [Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)]
    ];
    
    let whitePixelCount = 0;
    const whiteThreshold = 240;
    
    samplePoints.forEach(([x, y]) => {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      
      if (r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) {
        whitePixelCount++;
      }
    });
    
    if (whitePixelCount >= 3) {
      img.setAttribute('data-white-bg', 'true');
      img.style.backgroundColor = 'rgba(20, 20, 30, 0.3)';
      img.style.borderRadius = '8px';
      const wrapper = img.closest('.device-image-wrapper');
      if (wrapper) {
        wrapper.classList.add('white-bg');
      }
    }
  } catch (error) {
    img.setAttribute('data-white-bg', 'true');
    img.style.backgroundColor = 'rgba(20, 20, 30, 0.35)';
    img.style.borderRadius = '8px';
  }
}

function getDeviceBrand(deviceName) {
  const brands = {
    google: /Google Pixel/i,
    samsung: /Galaxy|Samsung/i,
    poco: /POCO/i,
    realme: /Realme/i,
    xiaomi: /Xiaomi|Redmi|Mi/i,
    tecno: /TECNO/i,
    motorola: /Motorola|Moto/i,
    nothing: /Nothing|CMF/i,
    oneplus: /Oneplus|OnePlus/i,
    itel: /Itel|itel/i,
  };

  const brand = Object.entries(brands).find(([_, regex]) =>
    regex.test(deviceName)
  )?.[0] || 'other';

  return brand;
}
