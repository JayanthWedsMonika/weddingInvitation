(() => {
  "use strict";
  const config = window.WEDDING_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const cover = $("cover");
  const audio = $("bgMusic");
  const soundButton = $("soundToggle");
  let opened = false;
  let musicStarted = false;
  const setText = (id, value) => { const el = $(id); if (el && value != null) el.textContent = value; };
  const first = config.couple?.firstName || "Jayanth";
  const second = config.couple?.secondName || "Monica";
  document.title = `${first} & ${second} — Wedding Invitation`;
  document.querySelectorAll(".couple-name").forEach(el => { el.innerHTML = `${first} <i>&amp;</i> ${second}`; });
  document.querySelectorAll(".gold-heading").forEach(el => { if (el.textContent.includes("Jayanth")) el.innerHTML = `${first} <i>&amp;</i> ${second}`; });
  document.querySelectorAll(".final-monogram").forEach(el => { el.innerHTML = `${first.charAt(0)} <i>♥</i> ${second.charAt(0)}`; });

  // One shared venue for both celebrations.
  const venue = config.sharedVenue || {};
  setText("sharedVenueAddress", venue.address || "Add the full venue address in js/config.js.");
  const venueHeading = document.querySelector(".shared-map-card h3");
  if (venueHeading && venue.name) venueHeading.textContent = venue.name;
  const mapLink = $("sharedMapLink");
  if (mapLink) {
    const validMap = /^https:\/\/(maps\.app\.goo\.gl\/|((www\.)?google\.[^/]+\/maps\/))/i.test(venue.mapsUrl || "");
    mapLink.href = validMap ? venue.mapsUrl : "#";
    mapLink.setAttribute("aria-disabled", String(!validMap));
    mapLink.addEventListener("click", e => { if (!validMap) e.preventDefault(); });
  }

  // A real burst is emitted from the seal centre and remains above the envelope layers.
  function sealBurst() {
    const seal = $("openInvite");
    const wrap = document.querySelector(".envelope-wrap");
    if (!seal || !wrap) return;
    const old = wrap.querySelector(".seal-burst"); if (old) old.remove();
    const layer = document.createElement("div"); layer.className = "seal-burst";
    const sr = seal.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
    layer.style.left = `${sr.left + sr.width/2 - wr.left}px`;
    layer.style.top = `${sr.top + sr.height/2 - wr.top}px`;
    wrap.appendChild(layer);
    const glyphs = ["✿","❀","✽","✧","✦","❁"];
    for (let i=0; i<64; i++) {
      const bit = document.createElement("span");
      const isSpark = i%4===0;
      bit.className = isSpark ? "burst-spark" : "burst-petal";
      bit.textContent = isSpark ? (i%8===0 ? "✦" : "✧") : glyphs[i%3];
      const angle = Math.PI*2*i/64 + (Math.random()-.5)*.16;
      const distance = 95 + Math.random()*165;
      bit.style.setProperty("--dx", `${Math.cos(angle)*distance}px`);
      bit.style.setProperty("--dy", `${Math.sin(angle)*distance}px`);
      bit.style.setProperty("--rot", `${Math.random()*540-270}deg`);
      bit.style.setProperty("--delay", `${Math.random()*130}ms`);
      bit.style.setProperty("--size", `${16+Math.random()*17}px`);
      layer.appendChild(bit);
    }
    window.setTimeout(() => layer.remove(), 1900);
  }

  function createCelebration(section, amount=32) {
    if (!section) return;
    let petals = section.querySelector(".petal-layer");
    let sparkles = section.querySelector(".sparkle-layer");
    if (!petals) { petals=document.createElement("div"); petals.className="petal-layer"; section.appendChild(petals); }
    if (!sparkles) { sparkles=document.createElement("div"); sparkles.className="sparkle-layer"; section.appendChild(sparkles); }
    petals.replaceChildren(); sparkles.replaceChildren();
    for (let i=0; i<amount; i++) {
      const p=document.createElement("span"); p.className="petal"+(i%7===0?" gold":"");
      p.style.setProperty("--x", `${Math.random()*100}%`);
      p.style.setProperty("--w", `${9+Math.random()*12}px`);
      p.style.setProperty("--rot", `${Math.random()*360}deg`);
      p.style.setProperty("--dur", `${5.2+Math.random()*3.2}s`);
      p.style.setProperty("--delay", `${Math.random()*.75}s`);
      p.style.setProperty("--drift", `${-75+Math.random()*150}px`);
      petals.appendChild(p);
    }
    for (let i=0;i<22;i++) {
      const s=document.createElement("span"); s.className="sparkle";
      s.style.setProperty("--x",`${Math.random()*100}%`); s.style.setProperty("--y",`${5+Math.random()*90}%`);
      s.style.setProperty("--s",`${6+Math.random()*10}px`); s.style.setProperty("--dur",`${1.2+Math.random()*1.2}s`);
      s.style.setProperty("--delay",`${Math.random()*.8}s`); sparkles.appendChild(s);
    }
    window.setTimeout(()=>{petals.replaceChildren();sparkles.replaceChildren();},9000);
  }

  async function startMusicFromGesture() {
    if (!audio) return;
    if (!audio.src && config.musicFile) audio.src = config.musicFile;
    audio.volume = 0.52;
    audio.loop = true;
    try {
      // play() is called directly in the seal's click gesture for mobile autoplay policies.
      const promise = audio.play();
      if (promise && typeof promise.then === "function") await promise;
      musicStarted = true;
      if (soundButton) { soundButton.classList.add("is-playing"); setText("soundToggleLabel","Sound on"); }
    } catch (err) {
      if (soundButton) setText("soundToggleLabel","Tap for sound");
      console.warn("Background music could not start:", err);
    }
  }

  function openInvitation() {
    if (opened) return;
    opened = true;
    // Start audio synchronously within the real user gesture, before animations/scroll.
    startMusicFromGesture();
    sealBurst();
    createCelebration(cover, 46);
    cover?.classList.add("opening");
    const family = $("family");
    createCelebration(family, 42);
    window.setTimeout(() => family?.scrollIntoView({behavior:"smooth", block:"start"}), 480);
  }
  $("openInvite")?.addEventListener("click", openInvitation);
  $("openPrompt")?.addEventListener("click", openInvitation);

  if (soundButton && audio) {
    soundButton.addEventListener("click", async () => {
      if (audio.paused) {
        try { await audio.play(); soundButton.classList.add("is-playing"); setText("soundToggleLabel","Sound on"); musicStarted=true; }
        catch(e) { setText("soundToggleLabel","Sound unavailable"); }
      } else { audio.pause(); soundButton.classList.remove("is-playing"); setText("soundToggleLabel","Sound off"); }
    });
    audio.addEventListener("error", () => { console.error("Music file failed to load:", audio.currentSrc); setText("soundToggleLabel","Music unavailable"); });
  }

  // Smooth, reversible reveals. Observe sections as well as their individual text lines.
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle("visible", entry.isIntersecting));
    }, {threshold:0.04, rootMargin:"0px 0px -4% 0px"});
    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
    const celebrationObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > .18) {
          const section=entry.target;
          if (section.dataset.celebrationPlayed === "yes") return;
          section.dataset.celebrationPlayed="yes";
          createCelebration(section, 28);
        }
      });
    }, {threshold:[.18,.35]});
    ["family","reception","wedding","countdown"].forEach(id=>{const el=$(id);if(el)celebrationObserver.observe(el);});
  } else document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));

  // Countdown to the wedding muhurtham.
  const target = new Date(config.weddingDateTime || "2026-11-20T09:20:00+05:30").getTime();
  function updateCountdown() {
    let ms=Math.max(0,target-Date.now());
    const d=Math.floor(ms/86400000); ms%=86400000;
    const h=Math.floor(ms/3600000); ms%=3600000;
    const m=Math.floor(ms/60000); ms%=60000;
    const s=Math.floor(ms/1000);
    setText("days",String(d).padStart(3,"0")); setText("hours",String(h).padStart(2,"0"));
    setText("minutes",String(m).padStart(2,"0")); setText("seconds",String(s).padStart(2,"0"));
  }
  updateCountdown(); window.setInterval(updateCountdown,1000);

  // High-DPI scratch canvas with smooth interpolated strokes and a low-cost reveal check.
  const canvas=$("scratchCanvas"), card=$("scratchCard"), message=$("scratchMessage"), hint=$("scratchHint");
  if (canvas && card && message) {
    message.textContent=config.hiddenMessage || "Your love and blessings are the most precious gifts. With love, Jayanth & Monica.";
    const ctx=canvas.getContext("2d",{willReadFrequently:true});
    let drawing=false, revealed=false, last=null, scratched=0, checkTimer=0;
    function paintScratchSurface() {
      const r=card.getBoundingClientRect(); const w=Math.max(1,r.width-14), h=Math.max(1,r.height-14);
      const dpr=Math.min(window.devicePixelRatio||1,2);
      canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
      canvas.style.width=`${w}px`; canvas.style.height=`${h}px`;
      ctx.setTransform(dpr,0,0,dpr,0,0); ctx.globalCompositeOperation="source-over";
      const grad=ctx.createLinearGradient(0,0,w,h); grad.addColorStop(0,"#f0dfb6");grad.addColorStop(.45,"#b88d4e");grad.addColorStop(1,"#f5e6c5");
      ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
      ctx.strokeStyle="rgba(255,248,220,.48)";ctx.lineWidth=1;
      for(let y=8;y<h;y+=12){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
      ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#fff5dc";
      ctx.font="20px Georgia";ctx.fillText("✧",w/2,h/2-22);
      ctx.font="500 10px Georgia";ctx.fillText("SCRATCH TO REVEAL",w/2,h/2+2);
      ctx.font="17px Georgia";ctx.fillText("❧",w/2,h/2+25);
      ctx.globalCompositeOperation="destination-out";
    }
    function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
    function strokeTo(p){ctx.save();ctx.globalCompositeOperation="destination-out";ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=38;ctx.beginPath();if(last){ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);}else{ctx.arc(p.x,p.y,19,0,Math.PI*2);}ctx.stroke();ctx.restore();last=p;scratched++;}
    function checkReveal(){if(revealed||scratched<3)return;const px=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0,total=0;for(let i=3;i<px.length;i+=128){total++;if(px[i]<70)clear++;}if(clear/total>.30){revealed=true;card.classList.add("scratched");canvas.style.opacity="0";canvas.style.pointerEvents="none";if(hint)hint.textContent="MESSAGE REVEALED";window.setTimeout(()=>{ctx.clearRect(0,0,canvas.width,canvas.height);},420);}}
    canvas.addEventListener("pointerdown",e=>{if(revealed)return;drawing=true;last=null;canvas.setPointerCapture(e.pointerId);strokeTo(point(e));e.preventDefault();});
    canvas.addEventListener("pointermove",e=>{if(!drawing||revealed)return;strokeTo(point(e));if(scratched%8===0){clearTimeout(checkTimer);checkTimer=window.setTimeout(checkReveal,100);}e.preventDefault();});
    ["pointerup","pointercancel","lostpointercapture"].forEach(name=>canvas.addEventListener(name,()=>{drawing=false;last=null;clearTimeout(checkTimer);checkReveal();}));
    paintScratchSurface();
    if("ResizeObserver" in window){new ResizeObserver(()=>{if(!revealed)paintScratchSurface();}).observe(card);}else window.addEventListener("resize",()=>{if(!revealed)paintScratchSurface();});
  }

  // Restore closed cover when the guest scrolls back to the beginning.
  if ("IntersectionObserver" in window && cover) {
    const coverObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>.55){cover.classList.remove("opening");}}),{threshold:[.55]});
    coverObserver.observe(cover);
  }
})();
