const mobileNav = document.querySelector(".mobile-nav");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
    if (navLinks.classList.contains("mobile-open") && !navLinks.classList.contains("mobile-closing")) {
        // Add closing class while keeping open class - menu stays fully visible
        navLinks.classList.add("mobile-closing");
        mobileNav.classList.remove("active");
        
        // Set transition property and lock in current open state with inline styles
        // This ensures menu never disappears
        navLinks.style.transition = "opacity 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19), transform 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19)";
        navLinks.style.opacity = "1";
        navLinks.style.transform = "scale(1) translateY(0)";
        
        // Force reflow to ensure styles are applied
        navLinks.offsetHeight;
        
        // Now trigger the closing transition by changing inline styles
        // Keep mobile-open class throughout to maintain display: flex
        requestAnimationFrame(() => {
            navLinks.style.opacity = "0";
            navLinks.style.transform = "scale(0.8) translateY(-10px)";
        });
        
        // Wait for transition to complete, THEN remove classes and hide
        setTimeout(() => {
            navLinks.classList.remove("mobile-open", "mobile-closing");
            navLinks.style.display = "none";
            navLinks.style.opacity = "";
            navLinks.style.transform = "";
            navLinks.style.transition = "";
        }, 300);
    }
}

function openMenu() {
    // Remove any closing classes and inline styles first
    navLinks.classList.remove("mobile-closing", "closing-now");
    navLinks.style.opacity = "";
    navLinks.style.transform = "";
    navLinks.style.transition = "";
    navLinks.style.display = "flex";
    // Small delay to ensure display is set before adding animation class
    requestAnimationFrame(() => {
        navLinks.classList.add("mobile-open");
        mobileNav.classList.add("active");
    });
}

mobileNav.addEventListener("click", (e) => {
    e.stopPropagation();
    
    if (navLinks.classList.contains("mobile-open")) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("mobile-open")) {
        if (!navLinks.contains(e.target) && !mobileNav.contains(e.target)) {
            closeMenu();
        }
    }
});

// Close menu when clicking on a link
navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
        closeMenu();
    }
});

// Close menu when scrolling (both parent window and iframe)
function handleScroll() {
    if (navLinks.classList.contains("mobile-open")) {
        closeMenu();
    }
}

window.addEventListener("scroll", handleScroll, { passive: true });

// Also listen to iframe scroll if accessible
function attachIframeScrollListener() {
    const iframe = document.getElementById("contentFrame");
    if (iframe) {
        try {
            const iframeWindow = iframe.contentWindow;
            if (iframeWindow) {
                iframeWindow.addEventListener("scroll", handleScroll, { passive: true });
            }
        } catch (e) {
            // Cross-origin or not accessible, that's okay
        }
    }
}

// Try to attach iframe listener when iframe loads
const iframe = document.getElementById("contentFrame");
if (iframe) {
    iframe.addEventListener("load", attachIframeScrollListener);
    // Also try immediately in case iframe is already loaded
    attachIframeScrollListener();
}