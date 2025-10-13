window.posts = [
  {
    "id": "changelog-1",
    "title": "AxionOS 2.1 — Dos in Motion",
    "tagline": "Twice the axion",
    "author": {
      "name": "rmp",
      "username": "rmp22",
      "icon": "blog/res/img/rmp22.png"
    },
    "date": "2025-10-13",
    "readTime": "10 min read",
    "summary": "After months of refinement across four beta releases, AxionOS 2.1 Stable is finally here — faster, smoother, and more refined than ever.",
    "banner": "blog/res/img/2.0-banner.png",
    "content": `
      <p>After months of community feedback and rigorous testing across four Beta releases, we’re proud to announce the <strong>Stable release of AxionOS 2.1</strong> — built on <strong>Android 16</strong>. This version represents the most polished, balanced, and powerful AxionOS experience yet, combining new designs, stability, and OEM-inspired features that strike the perfect balance between creativity and familiarity.</p>

      <h2>Two Sides of the Coin</h2>
      <p>The entire UI has undergone a thoughtful visual refresh, blending Axion’s unique identity with a NothingOS-inspired design language. Instead of copying, we’ve taken the “what if” approach — reimagining how both <em>Material You</em> and blur-based themes can coexist in harmony. Whether you prefer vibrant colors or minimalist blur effects, you can have both.</p>
      <ul>
        <li>Reworked Quick Settings and improved brightness slider visibility controls</li>
        <li>Updated Settings dashboard</li>
        <li>Smart Internet tile and redesigned widgets inspired by NothingOS</li>
      </ul>
      <div class="side-by-side">
        <img src="blog/res/img/qs-blur.png" alt="QS Blur" />
        <img src="blog/res/img/qs-material.png" alt="QS Material" />
      </div>
      
        <h2>Your Home, Refined for You</h2>
        <p>Whether you prioritize aesthetics or efficiency, AxionOS 2.1 brings thoughtful launcher enhancements designed to adapt to your preferences and workflow.</p>
        <ul>
          <li><strong>QuickLook Widget:</strong> At-a-glance information for weather, calendar, and music</li>
          <li><strong>Nothing Widgets:</strong> Ports of nothingOS widgets to improve accessibility or aesthetics</li>
          <li><strong>Dynamic Themed Icons:</strong> Seamlessly adapt to your wallpaper and theme for a cohesive look</li>
          <li><strong>Refreshed Visuals:</strong> Subtle yet meaningful UI refinements across the launcher and recents view</li>
        </ul>
        <div class="side-by-side">
          <img src="blog/res/img/widgets.png" alt="Widgets" />
          <img src="blog/res/img/recents.png" alt="Recents" />
        </div>

      <h2><em>In omnia paratus!</em> — Ready for Anything</h2>
      <p>AxionOS 2.1 builds upon the newly rewritten boost framework introduced in AxionOS 1.0, now optimized for even faster response times and smoother animations across the entire system. Memory usage has been further reduced, resulting in snappier and more efficient multitasking.</p>

      <h3>New Components in the Boost Framework</h3>
      <ul>
        <li><strong>Performance Toolkit:</strong> A user-configurable performance management suite</li>
        <li><strong>Enhanced Low Memory Killer Daemon:</strong> Optimized using OEM-level improvements</li>
        <li><strong>Advanced Thermal Mitigation:</strong> Automatically terminates unnecessary processes to reduce CPU load and temperature</li>
        <li><strong>Memory Manager:</strong> Dynamically optimizes memory allocation based on usage patterns</li>
        <li><strong>ODEX Optimizations:</strong> Improves app performance using AOT speed-profile compilation</li>
        <li><strong>Dex Prefetcher:</strong> A rewritten, QCOM-inspired engine that accelerates app launch and loading times</li>
        <li><strong>ScrollOptimizer:</strong> Derived and reengineered from QCOM’s implementation to eliminate scroll jitters while maintaining low CPU usage</li>
        <li><strong>Service Delay:</strong> An optimization that delays non-critical or non-user requested services</li>
      </ul>

      <h2>Game On!</h2>
      <p>The redesigned Game Panel delivers faster access to key features while gaming — no need to switch apps or pull down Quick Settings mid-match.</p>
      <ul>
        <li>New Game Panel tiles for quick access</li>
        <li>In-game brightness slider for instant visibility control</li>
        <li>Real-time FPS meter</li>
      </ul>
      <img src="blog/res/img/game_mode.png" alt="New Game Mode Panel" />

      <h2>Do More, Effortlessly</h2>
      <p>The reworked Freeform mode takes multitasking on AOSP to a whole new level.</p>
      <ul>
        <li>Floating icons for minimized freeform tasks</li>
        <li>Fully redesigned AOSP freeform UI</li>
      </ul>
      <img src="blog/res/img/freeform.png" alt="Freeform" />

      <h2>Feature Highlights</h2>
      <h3>NothingOS Experience</h3>
      <ul>
        <li>NothingOS-style lockscreen clocks and Always-On Display</li>
        <li>Three-finger swipe gesture with improved screenshot interception</li>
        <li>Network Speed Indicator and App Locker</li>
        <li>Partial screenshot support</li>
      </ul>

      <h3>Other AxionOS Exclusives</h3>
      <ul>
        <li><strong>QuickLook:</strong> At-a-glance weather, calendar, and music controls right from your lockscreen</li>
        <li><strong>Sidebar Reimagined:</strong> Rewritten from the ground up for faster access and minimal resource use</li>
        <li><strong>Edge Light & Pulse Visualizer:</strong> Cleaner, smoother lighting effects with improved AOD integration</li>
        <li><strong>HBM (High Brightness Mode) service:</strong> Open-source and battery friendly</li>
        <li><strong>HDR boost toggle:</strong> Option to disable HDR flashbangs when watching videos</li>
        <li><strong>HDR intensity:</strong> Option to change HDR brightness intensity</li>
        <li><strong>Torch intensity:</strong> Option to change Torch brightness intensity</li>
        <li><strong>Volume QS Tile:</strong> Option to change volume levels via QS tile</li>
        <li><strong>Lockscreen QS disable:</strong> Option to disable swiping QS on lockscreen</li>
        <li><strong>Lockscreen Media Art:</strong> Option to display media art on lockscreen</li>
        <li><strong>Mistouch Preventoin:</strong> Option to add mistouch protection in lockscreen</li>
      </ul>

        <h2>Google’s Patch Cadence & The State of AOSP</h2>

        <h3>The ACSP — Android Closed Source Project</h3>
        <p>Over the past few months, Google has not released major source code updates addressing critical QPR0 issues — and QPR1 remains unavailable. This slowdown in the Android Open Source Project (AOSP) has made it increasingly challenging for custom ROM developers to maintain stability and compatibility.</p>

        <p>Without direct access to Google’s proprietary tools and resources, many QPR0-related issues required extensive manual fixes and reverse engineering. These “band-aid” solutions extended our beta period, as we prioritized delivering a daily-driver-ready experience over rushing stability.</p>

        <h3>AxionOS Contributions and Fixes</h3>
        <p>Despite these limitations, we implemented several critical fixes and optimizations to make QPR0 near stable and usable for everyday users.</p>

        <h4>AOSP fixes</h4>
        <ul>
          <li>Resolved VPN connection issues</li>
          <li>Fixed cloned profile bugs</li>
          <li>Restored scheduled dark mode functionality</li>
          <li>Patched SystemUI memory leaks</li>
          <li>Fixed Quick Settings visual glitches (e.g., tiles showing without background)</li>
          <li>Resolved keyguard element disappearance issues</li>
          <li>Fixed secondary click actions on the Internet tile</li>
          <li>Eliminated unlock flickering</li>
          <li>Fixed animation lag on selected MediaTek devices</li>
          <li>Fixed split-shade disappearance issues</li>
          <li>Fixed systemui crashes after applying icon packs</li>
          <li>Fixed task profiles application</li>
        </ul>
        
        <h4>Custom Rom Feature fixes</h4>
        <ul>
          <li>Fixed clock customizations memory leak</li>
          <li>Reduced system font overrides resources usage</li>
          <li>Fixed minor ui inconsistencies with volume row icons</li>
          <li>Biometrics option fixes</li>
          <li>Fixed mediametadata crashes</li>
          <li>Fixed HWUI renderer switcher feature implementation</li>
          <li>Fixed ignore window secure feature</li>
        </ul>

        <p>TL;DR: AxionOS continues to push AOSP forward, ensuring a stable and refined Android experience even amidst limited upstream updates.</p>

      <h2>Looking Ahead</h2>
      <p>AxionOS 2.1 Stable marks a major milestone — but it’s only the beginning. With a stronger foundation, we’re looking forward for better quality releases as time goes by.</p>

      <p>We’d like to thank all our testers, contributors, and community members who helped shape AxionOS 2.1 through each beta phase. Your feedback and participation have been invaluable in creating a release that embodies the AxionOS vision of performance and elegance.</p>

      <p><em>— The AxionOS Team</em></p>
    `
  }
];
