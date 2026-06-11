// Core Application Helper - Red Card Live World Cup 2026
import { dbGetDocs, dbGetDoc, dbSetDoc, dbOnSnapshotDoc } from "./firebase-config.js";

// 1. IST Time Helpers
export const formatToIST = (dateString) => {
  const date = new Date(dateString);
  // IST offset is UTC+5.5
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  };
  return new Intl.DateTimeFormat("en-IN", options).format(date) + " IST";
};

export const getCountdown = (kickoffDateString) => {
  const kickoff = new Date(kickoffDateString).getTime();
  const now = new Date().getTime();
  const diff = kickoff - now;

  if (diff <= 0) return "LIVE NOW";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(days).padStart(2, '0')}d : ${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
};

// 2. Global Autocomplete Search
export const initializeSearch = async (searchInputId, resultsContainerId) => {
  const input = document.getElementById(searchInputId);
  const container = document.getElementById(resultsContainerId);
  if (!input || !container) return;

  // Pre-load Search Index
  const matches = await dbGetDocs("matches");
  matches.sort((a, b) => new Date(a.date) - new Date(b.date));
  const teams = await dbGetDocs("teams");
  const stadiums = await dbGetDocs("stadiums");

  const searchIndex = [];

  // Index Teams
  teams.forEach(t => {
    searchIndex.push({
      type: "Team",
      name: `${t.name} (${t.code})`,
      url: `/team?id=${t.id}`,
      keywords: `${t.name} ${t.code}`
    });
  });

  // Index Stadiums
  stadiums.forEach(s => {
    searchIndex.push({
      type: "Stadium",
      name: `🏟️ ${s.name} (${s.city})`,
      url: `/stadium?id=${s.id}`,
      keywords: `${s.name} ${s.city}`
    });
  });

  // Index Matches
  matches.forEach(m => {
    const homeTeam = teams.find(t => t.id === m.homeTeamId) || { name: m.homePlaceholder || "TBD", flag: "" };
    const awayTeam = teams.find(t => t.id === m.awayTeamId) || { name: m.awayPlaceholder || "TBD", flag: "" };
    searchIndex.push({
      type: "Match",
      name: `⚽ ${homeTeam.name} vs ${awayTeam.name} (${m.round})`,
      url: `/match?id=${m.id}`,
      keywords: `${homeTeam.name} ${awayTeam.name} ${m.round}`
    });
  });

  input.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    container.innerHTML = "";
    
    if (!q) {
      container.classList.add("hidden");
      return;
    }

    const filtered = searchIndex.filter(item => item.keywords.toLowerCase().includes(q)).slice(0, 5);

    if (filtered.length === 0) {
      container.innerHTML = `<div class="p-3 text-xs text-gray-500">No results found.</div>`;
    } else {
      filtered.forEach(item => {
        const div = document.createElement("a");
        div.href = item.url;
        div.className = "flex justify-between items-center p-3 text-xs hover:bg-primary-container/20 border-b border-white/5 text-on-surface transition-colors";
        div.innerHTML = `
          <span>${item.name}</span>
          <span class="bg-primary/20 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">${item.type}</span>
        `;
        container.appendChild(div);
      });
    }
    container.classList.remove("hidden");
  });

  // Close search results when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target !== input && e.target !== container) {
      container.classList.add("hidden");
    }
  });
};

// 3. SportsDB score synchronizer (client-side automation)
export const triggerSportsDbSync = async (matchId, force = false) => {
  const match = await dbGetDoc("matches", matchId);
  if (!match || !match.sportsdbEventId) return;

  const now = new Date();
  if (!force) {
    if (match.status !== "Live") return;
    const lastSynced = match.lastSynced ? new Date(match.lastSynced) : new Date(0);
    const elapsed = (now - lastSynced) / 1000;
    // Sync only every 30 seconds
    if (elapsed < 30) return;
  }

  console.log(`Triggering TheSportsDB sync for match ${matchId}...`);
  const settings = await dbGetDoc("settings", "api_keys");
  const apiKey = settings && settings.sportsdb_key ? settings.sportsdb_key : "123"; // Default test key '123'

  try {
    const eventId = match.sportsdbEventId.replace("sdb_", "");
    
    // 1. Fetch Event Results
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/${apiKey}/eventresults.php?id=${eventId}`);
    const data = await response.json();

    if (data && Array.isArray(data.results) && data.results[0]) {
      const result = data.results[0];
      
      const homeScore = (result.intHomeScore !== null && result.intHomeScore !== undefined) ? parseInt(result.intHomeScore) : match.homeScore;
      const awayScore = (result.intAwayScore !== null && result.intAwayScore !== undefined) ? parseInt(result.intAwayScore) : match.awayScore;

      // Generate realistic stats based on scores if not already present
      const stats = match.stats || {
        possessionHome: 50 + (homeScore - awayScore) * 3 + Math.floor(Math.random() * 5) - 2,
        shotsHome: 6 + homeScore * 2 + Math.floor(Math.random() * 3),
        shotsAway: 4 + awayScore * 2 + Math.floor(Math.random() * 3),
        passesHome: 390 + Math.floor(Math.random() * 40),
        passesAway: 350 + Math.floor(Math.random() * 40),
        foulsHome: 9 + Math.floor(Math.random() * 4),
        foulsAway: 11 + Math.floor(Math.random() * 4)
      };
      if (stats.possessionHome > 75) stats.possessionHome = 75;
      if (stats.possessionHome < 25) stats.possessionHome = 25;
      stats.possessionAway = 100 - stats.possessionHome;

      // 2. Fetch Lineups from TheSportsDB
      let lineups = null;
      try {
        const lineupRes = await fetch(`https://www.thesportsdb.com/api/v1/json/${apiKey}/lookuplineup.php?id=${eventId}`);
        const lineupData = await lineupRes.json();
        if (lineupData && Array.isArray(lineupData.lineup) && lineupData.lineup.length > 0) {
          const homeTeam = await dbGetDoc("teams", match.homeTeamId);
          const awayTeam = await dbGetDoc("teams", match.awayTeamId);

          const homePlayers = [];
          const awayPlayers = [];

          lineupData.lineup.forEach((player, idx) => {
            const name = player.strPlayer || "Unknown Player";
            const position = player.strPosition || "Midfielder";
            const number = player.strNumber ? parseInt(player.strNumber) : (idx % 11) + 1;
            
            const playerTeamStr = (player.strTeam || "").toLowerCase();
            const homeNameNorm = (homeTeam?.name || "").toLowerCase();
            const homeCodeNorm = (homeTeam?.code || "").toLowerCase();

            const isHome = playerTeamStr.includes(homeNameNorm) || playerTeamStr.includes(homeCodeNorm);
            const mappedPlayer = { name, position, number };

            if (isHome) {
              homePlayers.push(mappedPlayer);
            } else {
              awayPlayers.push(mappedPlayer);
            }
          });

          if (homePlayers.length > 0 || awayPlayers.length > 0) {
            lineups = {
              home: homePlayers,
              away: awayPlayers
            };
          }
        }
      } catch (err) {
        console.warn("Failed to fetch lineup from TheSportsDB:", err);
      }

      // Generate lineups using team squads if not resolved from API
      if (!lineups) {
        const homeTeam = await dbGetDoc("teams", match.homeTeamId);
        const awayTeam = await dbGetDoc("teams", match.awayTeamId);
        lineups = {
          home: homeTeam && homeTeam.squad ? homeTeam.squad.slice(0, 4) : [],
          away: awayTeam && awayTeam.squad ? awayTeam.squad.slice(0, 4) : []
        };
      }

      // 3. Fetch Event Timeline
      try {
        const timelineRes = await fetch(`https://www.thesportsdb.com/api/v1/json/${apiKey}/lookuptimeline.php?id=${eventId}`);
        const timelineData = await timelineRes.json();
        if (timelineData && Array.isArray(timelineData.timeline) && timelineData.timeline.length > 0) {
          for (const [idx, item] of timelineData.timeline.entries()) {
            const evId = `sdb_ev_${item.idTimeline || idx}`;
            const type = item.strTimeline || "Goal";
            const minute = parseInt(item.intTimelineMinute || item.intTimelineTime) || 90;
            const playerName = item.strPlayer || item.strTimelineDetail || "Unknown Player";
            const detail = item.strTimelineDetail || "";
            const side = (item.strTimelineSide || "").toLowerCase();
            const teamId = side === "home" ? match.homeTeamId : match.awayTeamId;

            const eventData = {
              id: evId,
              type,
              minute,
              playerName,
              teamId,
              detail
            };
            await dbSetDoc(`matches/${matchId}/events`, evId, eventData);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch timeline from TheSportsDB:", err);
      }

      // Update match document with scores, stats, and lineups
      const updatedMatch = {
        ...match,
        homeScore,
        awayScore,
        minute: (result.strProgress !== null && result.strProgress !== undefined) ? parseInt(result.strProgress) : match.minute,
        status: result.strStatus === "FT" ? "Finished" : "Live",
        lastSynced: now.toISOString(),
        stats,
        lineups
      };

      await dbSetDoc("matches", matchId, updatedMatch);
      console.log(`SportsDB Sync: Match score, stats, and lineups updated successfully.`, updatedMatch);
    } else {
      // Fallback: Simulation of Live Match progression if using mock event ID or if API returns invalid/empty results
      console.log(`SportsDB API returned no valid results for ${match.sportsdbEventId}. Checking simulation fallback...`);
      
      // Load lineups
      let lineups = match.lineups;
      if (!lineups) {
        const homeTeam = await dbGetDoc("teams", match.homeTeamId);
        const awayTeam = await dbGetDoc("teams", match.awayTeamId);
        lineups = {
          home: homeTeam && homeTeam.squad ? homeTeam.squad.slice(0, 4) : [],
          away: awayTeam && awayTeam.squad ? awayTeam.squad.slice(0, 4) : []
        };
      }

      // Generate/update stats dynamically during simulation
      const stats = match.stats || {
        possessionHome: 50,
        possessionAway: 50,
        shotsHome: 8,
        shotsAway: 6,
        passesHome: 350,
        passesAway: 320,
        foulsHome: 10,
        foulsAway: 12
      };

      if (match.status === "Live") {
        const homeScoreIncrement = Math.random() > 0.93 ? 1 : 0;
        const awayScoreIncrement = Math.random() > 0.93 ? 1 : 0;
        
        let newMinute = (match.minute || 0) + 1;
        let newStatus = match.status;
        if (newMinute >= 90) {
          newMinute = 90;
          newStatus = "Finished";
        }

        const homeScore = match.homeScore + homeScoreIncrement;
        const awayScore = match.awayScore + awayScoreIncrement;

        if (homeScoreIncrement > 0 || awayScoreIncrement > 0) {
          stats.possessionHome = 50 + (homeScore - awayScore) * 2 + Math.floor(Math.random() * 5) - 2;
          if (stats.possessionHome > 75) stats.possessionHome = 75;
          if (stats.possessionHome < 25) stats.possessionHome = 25;
          stats.possessionAway = 100 - stats.possessionHome;
          stats.shotsHome += homeScoreIncrement * 2 + Math.floor(Math.random() * 2);
          stats.shotsAway += awayScoreIncrement * 2 + Math.floor(Math.random() * 2);
        }

        const updatedMatch = {
          ...match,
          homeScore,
          awayScore,
          minute: newMinute,
          status: newStatus,
          lastSynced: now.toISOString(),
          stats,
          lineups
        };

        // Trigger event injection in mock collection if score increases to fire overlay animations
        if (homeScoreIncrement > 0 || awayScoreIncrement > 0) {
          const evId = `ev_${Date.now()}`;
          let scorer = "Unknown Player";
          let teamId = "";

          if (homeScoreIncrement > 0) {
            teamId = match.homeTeamId;
            const teamDoc = await dbGetDoc("teams", teamId);
            if (teamDoc && Array.isArray(teamDoc.squad) && teamDoc.squad.length > 0) {
              const idx = Math.floor(Math.random() * teamDoc.squad.length);
              scorer = teamDoc.squad[idx].name;
            } else {
              scorer = `${teamDoc?.name || "Home"} Player`;
            }
          } else {
            teamId = match.awayTeamId;
            const teamDoc = await dbGetDoc("teams", teamId);
            if (teamDoc && Array.isArray(teamDoc.squad) && teamDoc.squad.length > 0) {
              const idx = Math.floor(Math.random() * teamDoc.squad.length);
              scorer = teamDoc.squad[idx].name;
            } else {
              scorer = `${teamDoc?.name || "Away"} Player`;
            }
          }

          await dbSetDoc(`matches/${matchId}/events`, evId, {
            id: evId,
            type: "Goal",
            minute: newMinute,
            playerName: scorer,
            teamId: teamId,
            detail: "Spectacular finish!"
          });
        }

        await dbSetDoc("matches", matchId, updatedMatch);
        console.log("Simulated Live Sync Update:", updatedMatch);
      } else {
        // Just ensure stats and lineups are populated for static matches
        const updatedMatch = {
          ...match,
          lastSynced: now.toISOString(),
          stats,
          lineups
        };
        await dbSetDoc("matches", matchId, updatedMatch);
        console.log("Static Match Sync Update (Stats & Lineups Only):", updatedMatch);
      }
    }
  } catch (error) {
    console.error("Failed to sync scores from TheSportsDB:", error);
  }
};

// Start background syncing loop for active live matches
export const startLiveMatchSync = async () => {
  const matches = await dbGetDocs("matches");
  const liveMatches = matches.filter(m => m.status === "Live");

  liveMatches.forEach(async (m) => {
    await triggerSportsDbSync(m.id);
  });

  // Check every 30 seconds
  setInterval(async () => {
    const allMatches = await dbGetDocs("matches");
    const activeLives = allMatches.filter(m => m.status === "Live");
    activeLives.forEach(async (m) => {
      await triggerSportsDbSync(m.id);
    });
  }, 30000);
};

// 4. Sponsor catalog drawer
export const renderRetroJerseys = async (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Render a loading state
  container.innerHTML = `<div class="col-span-1 md:col-span-4 text-center py-8 text-xs text-gray-500 animate-pulse">Loading retro jerseys from Rival In Retro...</div>`;

  try {
    const apiKey = "AIzaSyCVHYTIRY-hBh2XHRYkuy4ShLeT3-rByi8";
    const projectId = "rivalinretro-8a562";
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();

    if (!data || !data.documents) throw new Error("No products returned");

    // Helper to parse Firestore REST document fields
    const parseField = (field) => {
      if (!field) return null;
      if (field.stringValue !== undefined) return field.stringValue;
      if (field.integerValue !== undefined) return parseInt(field.integerValue);
      if (field.doubleValue !== undefined) return parseFloat(field.doubleValue);
      if (field.booleanValue !== undefined) return field.booleanValue;
      if (field.arrayValue && field.arrayValue.values) {
        return field.arrayValue.values.map(v => v.stringValue || v.integerValue || v.doubleValue || v.booleanValue);
      }
      return null;
    };

    const products = data.documents.map(doc => {
      const parsed = {};
      const fields = doc.fields || {};
      for (const [key, val] of Object.entries(fields)) {
        parsed[key] = parseField(val);
      }
      parsed.id = doc.name ? doc.name.split("/").pop() : "";
      return parsed;
    }).filter(p => p.status === "active");

    if (products.length === 0) throw new Error("No active products");

    // Shuffle products
    const shuffled = products.sort(() => 0.5 - Math.random());
    // Get top 4
    const selected = shuffled.slice(0, 4);

    container.innerHTML = "";
    
    // Slug helper matching Rival in Retro's slug logic
    const makeSlug = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    selected.forEach(shirt => {
      const div = document.createElement("div");
      div.className = "bg-brand-charcoal/50 p-4 text-center border border-white/5 hover:border-brand-gold/30 transition-all cursor-pointer rounded-sm group relative overflow-hidden";
      
      // Get first image or fallback
      const imageUrl = (shirt.images && shirt.images.length > 0) ? shirt.images[0] : "";
      const mrpText = shirt.mrp ? `<span class="text-gray-500 line-through mr-1.5 text-[9px] font-mono">₹${shirt.mrp}</span>` : "";

      div.innerHTML = `
        <div class="aspect-[3/4] bg-white/5 mb-4 flex flex-col items-center justify-center relative rounded-sm overflow-hidden">
          ${imageUrl 
            ? `<img src="${imageUrl}" alt="${shirt.name}" class="w-full h-full object-contain p-2 transform group-hover:scale-110 transition-transform duration-300"/>`
            : `<span class="text-6xl transform group-hover:scale-110 transition-transform duration-300">👕</span>`
          }
          <div class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p class="text-[10px] text-brand-gold uppercase tracking-wider font-bold mb-1">Rival In Retro</p>
            <p class="text-[10px] text-white leading-tight">${shirt.desc || "Click to view premium retro jersey."}</p>
          </div>
        </div>
        <div class="text-xs font-black uppercase tracking-tight truncate">${shirt.name}</div>
        <div class="text-brand-gold text-[10px] font-mono mt-1 font-bold">
          ${mrpText}
          <span class="text-white font-extrabold text-xs">₹${shirt.price}</span>
        </div>
      `;
      
      // When clicked, redirect to the product details page
      div.addEventListener("click", () => {
        const slug = makeSlug(shirt.name) || shirt.id;
        window.open(`https://rivalinretro.vercel.app/#product/${slug}`, "_blank");
      });

      container.appendChild(div);
    });
  } catch (error) {
    console.error("Failed to render Retro jerseys from API, falling back to mock jerseys:", error);
    renderMockRetroJerseys(container);
  }
};

const renderMockRetroJerseys = (container) => {
  const shirts = [
    { id: "br_70", name: "Brazil '70 Classic", price: 2499, mrp: 3999, icon: "👕", desc: "The signature yellow worn by Pele in Mexico." },
    { id: "arg_86", name: "Argentina '86 Away", price: 2399, mrp: 3899, icon: "👕", desc: "The legendary blue worn by Maradona in Azteca." },
    { id: "it_90", name: "Italy '90 Home", price: 2299, mrp: 3799, icon: "👕", desc: "Elegant azzurri retro design from Italia '90." },
    { id: "eng_66", name: "England '66 Red", price: 2599, mrp: 4199, icon: "👕", desc: "Worn during the historic victory at Wembley." }
  ];

  container.innerHTML = "";
  shirts.forEach(shirt => {
    const div = document.createElement("div");
    div.className = "bg-brand-charcoal/50 p-4 text-center border border-white/5 hover:border-brand-gold/30 transition-all cursor-pointer rounded-sm group relative overflow-hidden";
    div.innerHTML = `
      <div class="aspect-[3/4] bg-white/5 mb-4 flex flex-col items-center justify-center relative rounded-sm">
        <span class="text-6xl transform group-hover:scale-110 transition-transform duration-300">${shirt.icon}</span>
        <div class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p class="text-[10px] text-brand-gold uppercase tracking-wider font-bold mb-1">Rival In Retro</p>
          <p class="text-[10px] text-white leading-tight">${shirt.desc}</p>
        </div>
      </div>
      <div class="text-xs font-black uppercase tracking-tight truncate">${shirt.name}</div>
      <div class="text-brand-gold text-[10px] font-mono mt-1 font-bold">
        <span class="text-gray-500 line-through mr-1.5 text-[9px] font-mono">₹${shirt.mrp}</span>
        <span class="text-white font-extrabold text-xs">₹${shirt.price}</span>
      </div>
    `;
    const makeSlug = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    div.addEventListener("click", () => {
      const slug = makeSlug(shirt.name) || shirt.id;
      window.open(`https://rivalinretro.vercel.app/#product/${slug}`, "_blank");
    });
    container.appendChild(div);
  });
};

// 5. Flag Image Renderer Utility
const TEAM_ISO_CODES = {
  mexico: "mx",
  south_africa: "za",
  south_korea: "kr",
  czechia: "cz",
  canada: "ca",
  bosnia: "ba",
  qatar: "qa",
  switzerland: "ch",
  usa: "us",
  paraguay: "py",
  australia: "au",
  turkey: "tr",
  brazil: "br",
  morocco: "ma",
  haiti: "ht",
  scotland: "gb-sct",
  germany: "de",
  curacao: "cw",
  ivory_coast: "ci",
  ecuador: "ec",
  netherlands: "nl",
  japan: "jp",
  sweden: "se",
  tunisia: "tn",
  spain: "es",
  cape_verde: "cv",
  saudi_arabia: "sa",
  uruguay: "uy",
  belgium: "be",
  egypt: "eg",
  iran: "ir",
  new_zealand: "nz",
  france: "fr",
  senegal: "sn",
  iraq: "iq",
  norway: "no",
  argentina: "ar",
  algeria: "dz",
  austria: "at",
  jordan: "jo",
  portugal: "pt",
  dr_congo: "cd",
  uzbekistan: "uz",
  colombia: "co",
  england: "gb-eng",
  croatia: "hr",
  ghana: "gh",
  panama: "pa"
};

export const renderFlag = (team, imgClass = "w-6 h-4") => {
  if (!team) return `<span class="inline-block shrink-0">🏳️</span>`;
  let flagSrc = team.flag;
  // If it's an emoji (or not a url), check if we can resolve via ISO code mapping
  if (!flagSrc || !flagSrc.startsWith("http")) {
    const code = TEAM_ISO_CODES[team.id];
    if (code) {
      flagSrc = `https://flagcdn.com/w80/${code}.png`;
    }
  }

  if (flagSrc && flagSrc.startsWith("http")) {
    return `<img alt="${team.name || ''}" class="${imgClass} object-cover inline-block align-middle shadow-sm border border-white/10 shrink-0" src="${flagSrc}"/>`;
  }
  return `<span class="inline-block shrink-0">${flagSrc || "🏳️"}</span>`;
};
