(() => {
  const config = window.WEDDING_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const cover = $("cover");
  const audio = $("bgMusic");
  let opened = false;
  let burstPlayed = false;

  const setText = (id, value) => { const el = $(id); if (el && value != null) el.textContent = value; };
  const first = config.couple?.firstName || "Jayanth";
  const second = config.couple?.secondName || "Monica";
  document.title = `${first} & ${second} — Wedding Invitation`;

  // Keep the approved cover's displayed names intact; apply editable names to later pages.
  document.querySelectorAll(".couple-name").forEach(el => {
    el.innerHTML = `${first} <i>&amp;</i> ${second}`;
  });
  document.querySelectorAll(".gold-heading").forEach(el => {
    if (el.textContent.includes("Jayanth")) el.innerHTML = `${first} <i>&amp;</i> ${second}`;
  });
  document.querySelectorAll(".final-monogram").forEach(el => {
    el.innerHTML = `${first.charAt(0)} <i>♥</i> ${second.charAt(0)}`;
  });

  const venue = config.sharedVenue || {};
  setText("sharedVenueAddress", venue.address || "Add the full venue address in js/config.js.");
  const venueHeading = document.querySelector(".shared-map-card h3");
  if (venueHeading && venue.name) venueHeading.textContent = venue.name;
  const sharedMap = $("sharedMapLink");
  if (sharedMap && venue.mapsUrl && /^https:\/\/(maps\.app\.goo\.gl\/|((www\.)?google\.[^/]+\/maps\/))/i.test(venue.mapsUrl)) {
    sharedMap.href = venue.mapsUrl;
    sharedMap.setAttribute("aria-disabled", "false");
  } else if (sharedMap) {
    sharedMap.href = "#";
    sharedMap.setAttribute("aria-disabled", "true");
    sharedMap.title = "Add the shared Google Maps link in js/config.js";
  }

  // Flower and sparkle burst: triggered on first opening and again on page entry.
  function createCelebration(section) {
    if (!section) return;
    const petals = section.querySelector(".petal-layer");
    const sparkles = section.querySelector(".sparkle-layer");
    if (!petals || !sparkles) return;
    petals.replaceChildren(); sparkles.replaceChildren();
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("span");
      p.className = "petal" + (i % 8 === 0 ? " gold" : "");
      p.style.setProperty("--x", `${Math.random() * 100}%`);
      p.style.setProperty("--w", `${8 + Math.random() * 13}px`);
      p.style.setProperty("--rot", `${Math.random() * 360}deg`);
      p.style.setProperty("--dur", `${6 + Math.random() * 4}s`);
      p.style.setProperty("--delay", `${Math.random() * 1.4}s`);
      p.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
      petals.appendChild(p);
    }
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.style.setProperty("--x", `${Math.random() * 100}%`);
      s.style.setProperty("--y", `${8 + Math.random() * 82}%`);
      s.style.setProperty("--s", `${5 + Math.random() * 10}px`);
      s.style.setProperty("--dur", `${1.2 + Math.random() * 1.8}s`);
      s.style.setProperty("--delay", `${Math.random() * 1.5}s`);
      sparkles.appendChild(s);
    }
    window.setTimeout(() => { petals.replaceChildren(); sparkles.replaceChildren(); }, 11000);
  }

  function sealBurst() {
    const wrap = document.querySelector(".envelope-wrap");
    if (!wrap) return;
    const layer = document.createElement("div");
    layer.className = "seal-burst";
    wrap.appendChild(layer);
    const petals = ["✿","❀","✽","✧","✦"];
    for (let i=0;i<54;i++) {
      const bit=document.createElement("span");
      bit.className = i%4===0 ? "burst-spark" : "burst-petal";
      bit.textContent = i%4===0 ? "✦" : petals[i%3];
      const angle=(Math.PI*2*i)/54 + Math.random()*.16;
      const distance=75+Math.random()*155;
      bit.style.setProperty("--dx", `${Math.cos(angle)*distance}px`);
      bit.style.setProperty("--dy", `${Math.sin(angle)*distance}px`);
      bit.style.setProperty("--rot", `${Math.random()*360}deg`);
      bit.style.setProperty("--delay", `${Math.random()*110}ms`);
      layer.appendChild(bit);
    }
    window.setTimeout(()=>layer.remove(),1500);
  }

  function openInvitation() {
    if (opened) return;
    opened = true;
    sealBurst();
    cover.classList.add("opening");
    createCelebration($("family"));
    window.setTimeout(() => $("family").scrollIntoView({behavior:"smooth", block:"start"}), 720);
    if (audio && config.musicFile) {
      audio.src = config.musicFile;
      audio.volume = 0.72;
      audio.play().then(() => {
        if (soundButton) soundButton.querySelector(".sound-label").textContent = "Sound on";
      }).catch(() => {
        if (soundButton) soundButton.querySelector(".sound-label").textContent = "Tap for sound";
      });
    }
  }
  $("openInvite")?.addEventListener("click", openInvitation);
  $("openPrompt")?.addEventListener("click", openInvitation);

  const soundButton = $("soundToggle");
  if (soundButton && audio && config.musicFile) {
    soundButton.addEventListener("click", async () => {
      if (audio.paused) { try { await audio.play(); soundButton.querySelector(".sound-label").textContent = "Sound on"; } catch {} }
      else { audio.pause(); soundButton.querySelector(".sound-label").textContent = "Sound off"; }
    });
  }

  // Scroll reveal reverses on upward scroll by removing .visible when leaving view.
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle("visible", entry.isIntersecting));
  }, {threshold:0.08, rootMargin:"0px 0px -2% 0px"});
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Re-run delicate flower showers when the guest arrives at each event page.
  const celebrationObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
        const section = entry.target;
        if (section.dataset.celebrationPlayed === "yes") return;
        section.dataset.celebrationPlayed = "yes";
        if (section.id === "family" || section.id === "reception" || section.id === "wedding" || section.id === "countdown") {
          createCelebration(section);
        }
      }
    });
  }, {threshold:[0.25,0.5]});
  ["family","reception","wedding","countdown"].forEach(id => {
    const el = $(id); if (el) celebrationObserver.observe(el);
  });

  // Live countdown to the start of the Muhurtham (09:20 IST).
  const target = new Date(config.weddingDateTime || "2026-11-20T09:20:00+05:30").getTime();
  function updateCountdown() {
    let remaining = Math.max(0, target - Date.now());
    const days = Math.floor(remaining / 86400000); remaining %= 86400000;
    const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
    const minutes = Math.floor(remaining / 60000); remaining %= 60000;
    const seconds = Math.floor(remaining / 1000);
    setText("days", String(days).padStart(3,"0"));
    setText("hours", String(hours).padStart(2,"0"));
    setText("minutes", String(minutes).padStart(2,"0"));
    setText("seconds", String(seconds).padStart(2,"0"));
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Scratch-to-reveal canvas. Supports mouse, pen and touch; no external library needed.
  const canvas = $("scratchCanvas");
  const card = $("scratchCard");
  const message = $("scratchMessage");
  const hint = $("scratchHint");
  if (canvas && card && message) {
    message.textContent = config.hiddenMessage || "Your love and blessings are the most precious gifts. With love, Jayanth & Monica.";
    const ctx = canvas.getContext("2d", {willReadFrequently:true});
    let drawing = false, revealed = false, lastCheck = 0;

    function paintScratchSurface() {
      const rect = card.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round((rect.width - 14) * dpr);
      canvas.height = Math.round((rect.height - 14) * dpr);
      canvas.style.width = `${rect.width - 14}px`;
      canvas.style.height = `${rect.height - 14}px`;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const w = rect.width - 14, h = rect.height - 14;
      const grad = ctx.createLinearGradient(0,0,w,h);
      grad.addColorStop(0,"#e9d49b"); grad.addColorStop(.48,"#b88d4e"); grad.addColorStop(1,"#f2dfad");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
      ctx.strokeStyle = "rgba(255,248,220,.6)"; ctx.lineWidth = 1;
      for(let y=9;y<h;y+=13){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
      ctx.fillStyle = "#fff3d3"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "19px Georgia"; ctx.fillText("✧",w/2, h/2-22);
      ctx.font = "500 10px Cinzel, Georgia, serif"; ctx.letterSpacing = "2px";
      ctx.fillText("SCRATCH TO REVEAL",w/2,h/2+2);
      ctx.font = "16px Georgia"; ctx.fillText("❧",w/2,h/2+25);
      ctx.globalCompositeOperation = "destination-out";
    }
    let lastPoint = null;
    function pointFrom(e) {
      const r=canvas.getBoundingClientRect();
      return {x:e.clientX-r.left,y:e.clientY-r.top};
    }
    function scratchAt(e) {
      const point=pointFrom(e);
      ctx.save(); ctx.globalCompositeOperation="destination-out";
      ctx.lineCap="round"; ctx.lineJoin="round"; ctx.lineWidth=42;
      ctx.beginPath();
      if(lastPoint){ctx.moveTo(lastPoint.x,lastPoint.y);ctx.lineTo(point.x,point.y);}
      else {ctx.moveTo(point.x,point.y);ctx.lineTo(point.x+.1,point.y+.1);}
      ctx.stroke(); ctx.restore(); lastPoint=point;
    }
    function revealIfEnough(force=false) {
      const now=Date.now();
      if((!force && now-lastCheck<650) || revealed) return;
      lastCheck=now;
      // Sample every 16th pixel to avoid a full-resolution readback on every move.
      const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let clear=0,total=0;
      for(let i=3;i<pixels.length;i+=64){total++;if(pixels[i]<80)clear++;}
      if(clear/total>.34){
        revealed=true; card.classList.add("scratched");
        canvas.style.transition="opacity .45s ease"; canvas.style.opacity="0";
        window.setTimeout(()=>ctx.clearRect(0,0,canvas.width,canvas.height),480);
        if(hint) hint.textContent="MESSAGE REVEALED";
      }
    }
    canvas.addEventListener("pointerdown",e=>{
      if(revealed)return;
      drawing=true;lastPoint=pointFrom(e);canvas.setPointerCapture(e.pointerId);scratchAt(e);
    });
    canvas.addEventListener("pointermove",e=>{
      if(!drawing||revealed)return;
      scratchAt(e);revealIfEnough();
    });
    ["pointerup","pointercancel","lostpointercapture"].forEach(ev=>canvas.addEventListener(ev,()=>{drawing=false;lastPoint=null;revealIfEnough(true);}));
    paintScratchSurface();
    window.addEventListener("resize", () => { if(!revealed) paintScratchSurface(); });
  }

  // Restore the cover's original closed appearance when scrolling all the way back.
  const coverObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > .55) cover.classList.remove("opening");
    });
  }, {threshold:[.55]});
  coverObserver.observe(cover);
})();
