// Database Bootstrapper and Fixture Generator - RedCardLive World Cup 2026
import { dbSetDoc, dbGetDoc } from "./firebase-config.js";
import TEAMS_DATA from "../world_cup_2026_team_profiles.json";

export const STADIUMS = [
  { id: "metlife", name: "MetLife Stadium", city: "East Rutherford, NJ", capacity: 82500, image: "https://images.unsplash.com/photo-1564198879120-ed341af72d89?w=600&auto=format&fit=crop&q=80" },
  { id: "azteca", name: "Estadio Azteca", city: "Mexico City, Mexico", capacity: 87523, image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80" },
  { id: "sofi", name: "SoFi Stadium", city: "Los Angeles, CA", capacity: 70240, image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=600&auto=format&fit=crop&q=80" },
  { id: "dallas", name: "AT&T Stadium", city: "Dallas, TX", capacity: 80000, image: "https://images.unsplash.com/photo-1485872299829-967fdf3ef4bf?w=600&auto=format&fit=crop&q=80" },
  { id: "vancouver", name: "BC Place", city: "Vancouver, Canada", capacity: 54500, image: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600&auto=format&fit=crop&q=80" },
  { id: "seattle", name: "Lumen Field", city: "Seattle, WA", capacity: 69000, image: "https://images.unsplash.com/photo-1504434026032-a7e440a30b68?w=600&auto=format&fit=crop&q=80" },
  { id: "bayarea", name: "Levi's Stadium", city: "San Francisco, CA", capacity: 68500, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80" },
  { id: "boston", name: "Gillette Stadium", city: "Boston, MA", capacity: 65878, image: "https://images.unsplash.com/photo-1568194157720-8ece71e4cb80?w=600&auto=format&fit=crop&q=80" },
  { id: "houston", name: "NRG Stadium", city: "Houston, TX", capacity: 72220, image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80" },
  { id: "kansascity", name: "Arrowhead Stadium", city: "Kansas City, MO", capacity: 76416, image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80" },
  { id: "atlanta", name: "Mercedes-Benz Stadium", city: "Atlanta, GA", capacity: 71000, image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80" },
  { id: "miami", name: "Hard Rock Stadium", city: "Miami, FL", capacity: 64767, image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80" },
  { id: "philadelphia", name: "Lincoln Financial Field", city: "Philadelphia, PA", capacity: 67594, image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80" },
  { id: "toronto", name: "BMO Field", city: "Toronto, Canada", capacity: 30000, image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80" },
  { id: "monterrey", name: "Estadio BBVA", city: "Monterrey, Mexico", capacity: 53500, image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80" },
  { id: "guadalajara", name: "Estadio Akron", city: "Guadalajara, Mexico", capacity: 48071, image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80" }
];

const ID_MAP = {
  "south-africa": "south_africa",
  "south-korea": "south_korea",
  "bosnia-and-herzegovina": "bosnia",
  "united-states": "usa",
  "ivory-coast": "ivory_coast",
  "new-zealand": "new_zealand",
  "saudi-arabia": "saudi_arabia",
  "cape-verde": "cape_verde",
  "dr-congo": "dr_congo"
};

export const TEAMS = TEAMS_DATA.map(t => ({
  ...t,
  id: ID_MAP[t.id] || t.id
}));

export const generateSquads = (teamId) => {
  const players = {
    england: [
      { name: "Jordan Pickford", position: "Goalkeeper", number: 1, apps: 68, cleanSheets: 26, goals: 0 },
      { name: "Aaron Ramsdale", position: "Goalkeeper", number: 13, apps: 5, cleanSheets: 2, goals: 0 },
      { name: "John Stones", position: "Defender", number: 5, apps: 75, cleanSheets: 30, goals: 3 },
      { name: "Kyle Walker", position: "Defender", number: 2, apps: 82, cleanSheets: 32, goals: 1 },
      { name: "Declan Rice", position: "Midfielder", number: 4, apps: 52, cleanSheets: 0, goals: 4 },
      { name: "Jude Bellingham", position: "Midfielder", number: 10, apps: 36, goals: 8, assists: 15 },
      { name: "Phil Foden", position: "Midfielder", number: 11, apps: 34, goals: 7, assists: 11 },
      { name: "Harry Kane", position: "Striker", number: 9, apps: 84, goals: 62, assists: 12 },
      { name: "Bukayo Saka", position: "Winger", number: 7, apps: 42, goals: 14, assists: 18 },
      { name: "Cole Palmer", position: "Winger", number: 20, apps: 12, goals: 3, assists: 5 }
    ],
    argentina: [
      { name: "Emi Martinez", position: "Goalkeeper", number: 23, apps: 45, cleanSheets: 28, goals: 0 },
      { name: "Christian Romero", position: "Defender", number: 13, apps: 38, cleanSheets: 18, goals: 3 },
      { name: "Rodrigo De Paul", position: "Midfielder", number: 7, apps: 60, goals: 2, assists: 14 },
      { name: "Enzo Fernandez", position: "Midfielder", number: 24, apps: 28, goals: 4, assists: 8 },
      { name: "Alexis Mac Allister", position: "Midfielder", number: 20, apps: 25, goals: 3, assists: 5 },
      { name: "Lionel Messi", position: "Striker", number: 10, apps: 180, goals: 106, assists: 56 },
      { name: "Lautaro Martinez", position: "Striker", number: 22, apps: 56, goals: 22, assists: 7 },
      { name: "Julian Alvarez", position: "Striker", number: 9, apps: 31, goals: 9, assists: 4 }
    ],
    brazil: [
      { name: "Alisson Becker", position: "Goalkeeper", number: 1, apps: 65, cleanSheets: 38, goals: 0 },
      { name: "Marquinhos", position: "Defender", number: 4, apps: 84, cleanSheets: 35, goals: 7 },
      { name: "Bruno Guimaraes", position: "Midfielder", number: 5, apps: 22, goals: 1, assists: 6 },
      { name: "Lucas Paqueta", position: "Midfielder", number: 8, apps: 44, goals: 10, assists: 12 },
      { name: "Vinicius Junior", position: "Winger", number: 7, apps: 30, goals: 5, assists: 9 },
      { name: "Rodrygo", position: "Winger", number: 10, apps: 25, goals: 6, assists: 5 },
      { name: "Endrick", position: "Striker", number: 9, apps: 10, goals: 3, assists: 1 }
    ],
    france: [
      { name: "Mike Maignan", position: "Goalkeeper", number: 16, apps: 14, cleanSheets: 6, goals: 0 },
      { name: "William Saliba", position: "Defender", number: 4, apps: 15, cleanSheets: 8, goals: 0 },
      { name: "Theo Hernandez", position: "Defender", number: 22, apps: 27, cleanSheets: 10, goals: 2 },
      { name: "Antoine Griezmann", position: "Midfielder", number: 7, apps: 127, goals: 44, assists: 38 },
      { name: "Aurelien Tchouameni", position: "Midfielder", number: 8, apps: 31, goals: 3, assists: 2 },
      { name: "Eduardo Camavinga", position: "Midfielder", number: 6, apps: 15, goals: 1, assists: 1 },
      { name: "Kylian Mbappe", position: "Striker", number: 10, apps: 77, goals: 46, assists: 30 },
      { name: "Ousmane Dembele", position: "Winger", number: 11, apps: 43, goals: 5, assists: 12 }
    ],
    portugal: [
      { name: "Diogo Costa", position: "Goalkeeper", number: 22, apps: 20, cleanSheets: 8, goals: 0 },
      { name: "Ruben Dias", position: "Defender", number: 4, apps: 54, cleanSheets: 20, goals: 3 },
      { name: "Joao Cancelo", position: "Defender", number: 2, apps: 50, cleanSheets: 18, goals: 10 },
      { name: "Bruno Fernandes", position: "Midfielder", number: 8, apps: 64, goals: 22, assists: 25 },
      { name: "Bernardo Silva", position: "Midfielder", number: 10, apps: 88, goals: 11, assists: 20 },
      { name: "Vitinha", position: "Midfielder", number: 23, apps: 15, goals: 0, assists: 4 },
      { name: "Cristiano Ronaldo", position: "Striker", number: 7, apps: 206, goals: 128, assists: 45 },
      { name: "Rafael Leao", position: "Winger", number: 17, apps: 25, goals: 4, assists: 8 }
    ],
    spain: [
      { name: "Unai Simon", position: "Goalkeeper", number: 23, apps: 40, cleanSheets: 16, goals: 0 },
      { name: "Robin Le Normand", position: "Defender", number: 3, apps: 10, cleanSheets: 4, goals: 1 },
      { name: "Dani Carvajal", position: "Defender", number: 2, apps: 43, cleanSheets: 15, goals: 0 },
      { name: "Rodri", position: "Midfielder", number: 16, apps: 50, goals: 3, assists: 6 },
      { name: "Pedri", position: "Midfielder", number: 20, apps: 20, goals: 2, assists: 8 },
      { name: "Lamine Yamal", position: "Winger", number: 19, apps: 10, goals: 2, assists: 5 },
      { name: "Nico Williams", position: "Winger", number: 17, apps: 15, goals: 2, assists: 4 },
      { name: "Alvaro Morata", position: "Striker", number: 7, apps: 73, goals: 36, assists: 10 }
    ],
    germany: [
      { name: "Ter Stegen", position: "Goalkeeper", number: 1, apps: 40, cleanSheets: 14, goals: 0 },
      { name: "Antonio Rudiger", position: "Defender", number: 2, apps: 69, cleanSheets: 22, goals: 3 },
      { name: "Joshua Kimmich", position: "Defender", number: 6, apps: 82, goals: 6, assists: 19 },
      { name: "Toni Kroos", position: "Midfielder", number: 8, apps: 109, goals: 17, assists: 28 },
      { name: "Florian Wirtz", position: "Midfielder", number: 10, apps: 18, goals: 2, assists: 6 },
      { name: "Jamal Musiala", position: "Midfielder", number: 42, apps: 29, goals: 2, assists: 8 },
      { name: "Ilkay Gundogan", position: "Midfielder", number: 21, apps: 77, goals: 19, assists: 15 },
      { name: "Kai Havertz", position: "Striker", number: 7, apps: 46, goals: 16, assists: 10 }
    ],
    usa: [
      { name: "Matt Turner", position: "Goalkeeper", number: 1, apps: 38, cleanSheets: 14, goals: 0 },
      { name: "Antonee Robinson", position: "Defender", number: 5, apps: 39, cleanSheets: 12, goals: 4 },
      { name: "Weston McKennie", position: "Midfielder", number: 8, apps: 49, goals: 11, assists: 8 },
      { name: "Tyler Adams", position: "Midfielder", number: 4, apps: 38, goals: 2, assists: 1 },
      { name: "Christian Pulisic", position: "Winger", number: 10, apps: 64, goals: 28, assists: 16 },
      { name: "Timothy Weah", position: "Winger", number: 21, apps: 35, goals: 4, assists: 5 },
      { name: "Folarin Balogun", position: "Striker", number: 20, apps: 10, goals: 3, assists: 2 }
    ],
    mexico: [
      { name: "Guillermo Ochoa", position: "Goalkeeper", number: 13, apps: 148, cleanSheets: 50, goals: 0 },
      { name: "Cesar Montes", position: "Defender", number: 3, apps: 42, cleanSheets: 15, goals: 1 },
      { name: "Edson Alvarez", position: "Midfielder", number: 4, apps: 74, goals: 5, assists: 4 },
      { name: "Luis Chavez", position: "Midfielder", number: 18, apps: 28, goals: 4, assists: 3 },
      { name: "Santiago Gimenez", position: "Striker", number: 11, apps: 25, goals: 4, assists: 2 },
      { name: "Hirving Lozano", position: "Winger", number: 22, apps: 70, goals: 18, assists: 12 }
    ]
  };
  return players[teamId] || [
    { name: "Player One", position: "Goalkeeper", number: 1, apps: 10, cleanSheets: 4, goals: 0 },
    { name: "Player Two", position: "Defender", number: 4, apps: 12, cleanSheets: 0, goals: 1 },
    { name: "Player Three", position: "Midfielder", number: 8, apps: 15, goals: 2, assists: 3 },
    { name: "Player Four", position: "Striker", number: 10, apps: 20, goals: 8, assists: 5 }
  ];
};

const RAW_FIXTURES_TEXT = `12 June (Fri) 12:30 AM – Mexico vs South Africa
07:30 AM – South Korea vs Czechia
13 June (Sat) 12:30 AM – Canada vs Bosnia & Herzegovina
06:30 AM – USA vs Paraguay
14 June (Sun) 12:30 AM – Qatar vs Switzerland
03:30 AM – Brazil vs Morocco
06:30 AM – Haiti vs Scotland
09:30 AM – Australia vs Türkiye
10:30 PM – Germany vs Curaçao
15 June (Mon) 01:30 AM – Netherlands vs Japan
04:30 AM – Ivory Coast vs Ecuador
07:30 AM – Sweden vs Tunisia
09:30 PM – Spain vs Cape Verde
16 June (Tue) 12:30 AM – Belgium vs Egypt
03:30 AM – Saudi Arabia vs Uruguay
06:30 AM – Iran vs New Zealand
17 June (Wed) 01:30 AM – France vs Senegal
03:30 AM – Iraq vs Norway
06:30 AM – Argentina vs Algeria
09:30 AM – Austria vs Jordan
10:30 PM – Portugal vs DR Congo
18 June (Thu) 01:30 AM – England vs Croatia
04:30 AM – Ghana vs Panama
07:30 AM – Uzbekistan vs Colombia
09:30 PM – Czechia vs South Africa
19 June (Fri) 12:30 AM – Switzerland vs Bosnia & Herzegovina
03:30 AM – Canada vs Qatar
06:30 AM – Mexico vs South Korea
20 June (Sat) 12:30 AM – USA vs Australia
03:30 AM – Scotland vs Morocco
06:00 AM – Brazil vs Haiti
08:30 AM – Türkiye vs Paraguay
10:30 PM – Netherlands vs Sweden
21 June (Sun) 01:30 AM – Germany vs Ivory Coast
05:30 AM – Ecuador vs Curaçao
09:30 AM – Tunisia vs Japan
09:30 PM – Spain vs Saudi Arabia
22 June (Mon) 12:30 AM – Belgium vs Iran
03:30 AM – Uruguay vs Cape Verde
06:30 AM – New Zealand vs Egypt
10:30 PM – Argentina vs Austria
23 June (Tue) 02:30 AM – France vs Iraq
05:30 AM – Norway vs Senegal
08:30 AM – Jordan vs Algeria
10:30 PM – Portugal vs Uzbekistan
24 June (Wed) 01:30 AM – England vs Ghana
04:30 AM – Panama vs Croatia
07:30 AM – Colombia vs DR Congo
25 June (Thu) 12:30 AM – Switzerland vs Canada
12:30 AM – Bosnia & Herzegovina vs Qatar
03:30 AM – Morocco vs Haiti
03:30 AM – Scotland vs Brazil
06:30 AM – South Africa vs South Korea
06:30 AM – Czechia vs Mexico
26 June (Fri) 01:30 AM – Curaçao vs Ivory Coast
01:30 AM – Ecuador vs Germany
04:30 AM – Tunisia vs Netherlands
04:30 AM – Japan vs Sweden
07:30 AM – Türkiye vs USA
07:30 AM – Paraguay vs Australia
27 June (Sat) 12:30 AM – Norway vs France
12:30 AM – Senegal vs Iraq
05:30 AM – Cape Verde vs Saudi Arabia
05:30 AM – Uruguay vs Spain
08:30 AM – New Zealand vs Belgium
08:30 AM – Egypt vs Iran
28 June (Sun) 02:30 AM – Panama vs England
02:30 AM – Croatia vs Ghana
05:00 AM – Colombia vs Portugal
05:00 AM – DR Congo vs Uzbekistan
07:30 AM – Algeria vs Austria
07:30 AM – Jordan vs Argentina`;

const GROUP_STAGE_SCORES = {
  // Group A
  "mexico_south_africa": { home: 2, away: 0 },
  "south_korea_czechia": { home: 2, away: 1 },
  "czechia_south_africa": { home: 1, away: 1 },
  "mexico_south_korea": { home: 1, away: 0 },
  "south_africa_south_korea": { home: 1, away: 0 },
  "czechia_mexico": { home: 0, away: 3 },

  // Group B
  "canada_bosnia": { home: 1, away: 1 },
  "qatar_switzerland": { home: 1, away: 1 },
  "switzerland_bosnia": { home: 4, away: 1 },
  "canada_qatar": { home: 6, away: 0 },
  "switzerland_canada": { home: 2, away: 1 },
  "bosnia_qatar": { home: 3, away: 1 },

  // Group C
  "brazil_morocco": { home: 1, away: 1 },
  "haiti_scotland": { home: 0, away: 1 },
  "scotland_morocco": { home: 0, away: 1 },
  "brazil_haiti": { home: 3, away: 0 },
  "scotland_brazil": { home: 0, away: 3 },
  "morocco_haiti": { home: 4, away: 2 },

  // Group D
  "usa_paraguay": { home: 4, away: 1 },
  "australia_turkey": { home: 2, away: 0 },
  "usa_australia": { home: 2, away: 0 },
  "turkey_paraguay": { home: 0, away: 1 },
  "turkey_usa": { home: 3, away: 2 },
  "paraguay_australia": { home: 0, away: 0 },

  // Group E
  "germany_curacao": { home: 7, away: 1 },
  "ivory_coast_ecuador": { home: 1, away: 0 },
  "germany_ivory_coast": { home: 2, away: 1 },
  "ecuador_curacao": { home: 0, away: 0 },
  "ecuador_germany": { home: 2, away: 1 },
  "curacao_ivory_coast": { home: 0, away: 2 },

  // Group F
  "netherlands_japan": { home: 2, away: 2 },
  "sweden_tunisia": { home: 5, away: 1 },
  "netherlands_sweden": { home: 5, away: 1 },
  "tunisia_japan": { home: 0, away: 4 },
  "japan_sweden": { home: 1, away: 1 },
  "tunisia_netherlands": { home: 2, away: 7 },

  // Group G
  "iran_new_zealand": { home: 2, away: 2 },
  "belgium_egypt": { home: 1, away: 1 },
  "belgium_iran": { home: 0, away: 0 },
  "new_zealand_egypt": { home: 1, away: 3 },
  "new_zealand_belgium": { home: 1, away: 5 },
  "egypt_iran": { home: 1, away: 1 },

  // Group H
  "spain_cape_verde": { home: 0, away: 0 },
  "saudi_arabia_uruguay": { home: 1, away: 1 },
  "spain_saudi_arabia": { home: 4, away: 0 },
  "uruguay_cape_verde": { home: 2, away: 2 },
  "cape_verde_saudi_arabia": { home: 2, away: 1 },
  "uruguay_spain": { home: 0, away: 2 },

  // Group I
  "france_senegal": { home: 3, away: 1 },
  "iraq_norway": { home: 1, away: 4 },
  "france_iraq": { home: 3, away: 0 },
  "norway_senegal": { home: 3, away: 2 },
  "norway_france": { home: 1, away: 4 },
  "senegal_iraq": { home: 1, away: 1 },

  // Group J
  "argentina_algeria": { home: 3, away: 0 },
  "austria_jordan": { home: 3, away: 1 },
  "argentina_austria": { home: 2, away: 0 },
  "jordan_algeria": { home: 1, away: 2 },
  "jordan_argentina": { home: 1, away: 3 },
  "algeria_austria": { home: 3, away: 3 },

  // Group K
  "portugal_dr_congo": { home: 1, away: 1 },
  "uzbekistan_colombia": { home: 1, away: 3 },
  "portugal_uzbekistan": { home: 5, away: 0 },
  "colombia_dr_congo": { home: 1, away: 0 },
  "colombia_portugal": { home: 0, away: 0 },
  "dr_congo_uzbekistan": { home: 3, away: 1 },

  // Group L
  "england_croatia": { home: 4, away: 2 },
  "ghana_panama": { home: 1, away: 0 },
  "england_ghana": { home: 0, away: 0 },
  "panama_croatia": { home: 0, away: 1 },
  "panama_england": { home: 0, away: 2 },
  "croatia_ghana": { home: 2, away: 1 }
};

const R32_SCORES = {
  "canada_south_africa": { home: 1, away: 0, homePenalties: null, awayPenalties: null, minute: 90 },
  "brazil_japan": { home: 2, away: 1, homePenalties: null, awayPenalties: null, minute: 90 },
  "germany_paraguay": { home: 1, away: 1, homePenalties: 3, awayPenalties: 4, minute: 120 },
  "netherlands_morocco": { home: 1, away: 1, homePenalties: 2, awayPenalties: 3, minute: 120 },
  "ivory_coast_norway": { home: 1, away: 2, homePenalties: null, awayPenalties: null, minute: 90 },
  "france_sweden": { home: 3, away: 0, homePenalties: null, awayPenalties: null, minute: 90 },
  "mexico_ecuador": { home: 2, away: 0, homePenalties: null, awayPenalties: null, minute: 90 },
  "england_dr_congo": { home: 2, away: 1, homePenalties: null, awayPenalties: null, minute: 90 },
  "belgium_senegal": { home: 3, away: 2, homePenalties: null, awayPenalties: null, minute: 120 },
  "usa_bosnia": { home: 2, away: 0, homePenalties: null, awayPenalties: null, minute: 90 },
  "spain_austria": { home: 3, away: 0, homePenalties: null, awayPenalties: null, minute: 90 },
  "portugal_croatia": { home: 2, away: 1, homePenalties: null, awayPenalties: null, minute: 90 },
  "switzerland_algeria": { home: 2, away: 0, homePenalties: null, awayPenalties: null, minute: 90 },
  "australia_egypt": { home: 1, away: 1, homePenalties: 2, awayPenalties: 4, minute: 120 },
  "argentina_cape_verde": { home: 3, away: 2, homePenalties: null, awayPenalties: null, minute: 120 },
  "colombia_ghana": { home: 1, away: 0, homePenalties: null, awayPenalties: null, minute: 90 }
};

export const getFixtureResult = (homeId, awayId, round) => {
  if (round === "Group Stage") {
    const key = `${homeId}_${awayId}`;
    if (GROUP_STAGE_SCORES[key]) {
      return {
        homeScore: GROUP_STAGE_SCORES[key].home,
        awayScore: GROUP_STAGE_SCORES[key].away,
        homePenalties: null,
        awayPenalties: null,
        minute: 90
      };
    }
    const revKey = `${awayId}_${homeId}`;
    if (GROUP_STAGE_SCORES[revKey]) {
      return {
        homeScore: GROUP_STAGE_SCORES[revKey].away,
        awayScore: GROUP_STAGE_SCORES[revKey].home,
        homePenalties: null,
        awayPenalties: null,
        minute: 90
      };
    }
    return { homeScore: 0, awayScore: 0, homePenalties: null, awayPenalties: null, minute: 90 };
  }

  if (round === "Round of 32") {
    const key = `${homeId}_${awayId}`;
    if (R32_SCORES[key]) {
      const res = R32_SCORES[key];
      return {
        homeScore: res.home,
        awayScore: res.away,
        homePenalties: res.homePenalties,
        awayPenalties: res.awayPenalties,
        minute: res.minute
      };
    }
    const revKey = `${awayId}_${homeId}`;
    if (R32_SCORES[revKey]) {
      const res = R32_SCORES[revKey];
      return {
        homeScore: res.away,
        awayScore: res.home,
        homePenalties: res.awayPenalties,
        awayPenalties: res.homePenalties,
        minute: res.minute
      };
    }
    return { homeScore: 0, awayScore: 0, homePenalties: null, awayPenalties: null, minute: 90 };
  }

  if (round === "Round of 16") {
    const matchesMap = {
      "canada_morocco": { home: 0, away: 3, hp: null, ap: null, min: 90 },
      "morocco_canada": { home: 3, away: 0, hp: null, ap: null, min: 90 },
      "paraguay_france": { home: 0, away: 1, hp: null, ap: null, min: 90 },
      "france_paraguay": { home: 1, away: 0, hp: null, ap: null, min: 90 },
      "spain_portugal": { home: 1, away: 0, hp: null, ap: null, min: 90 },
      "portugal_spain": { home: 0, away: 1, hp: null, ap: null, min: 90 },
      "belgium_usa": { home: 4, away: 1, hp: null, ap: null, min: 90 },
      "usa_belgium": { home: 1, away: 4, hp: null, ap: null, min: 90 },
      "england_mexico": { home: 3, away: 2, hp: null, ap: null, min: 90 },
      "mexico_england": { home: 2, away: 3, hp: null, ap: null, min: 90 },
      "norway_brazil": { home: 2, away: 1, hp: null, ap: null, min: 90 },
      "brazil_norway": { home: 1, away: 2, hp: null, ap: null, min: 90 },
      "argentina_egypt": { home: 3, away: 2, hp: null, ap: null, min: 90 },
      "egypt_argentina": { home: 2, away: 3, hp: null, ap: null, min: 90 },
      "switzerland_colombia": { home: 0, away: 0, hp: 4, ap: 3, min: 120 },
      "colombia_switzerland": { home: 0, away: 0, hp: 3, ap: 4, min: 120 }
    };
    const key = `${homeId}_${awayId}`;
    const result = matchesMap[key];
    if (result) {
      return { homeScore: result.home, awayScore: result.away, homePenalties: result.hp, awayPenalties: result.ap, minute: result.min };
    }
  }

  if (round === "Quarter Finals") {
    const matchesMap = {
      "france_morocco": { home: 2, away: 0, hp: null, ap: null, min: 90 },
      "morocco_france": { home: 0, away: 2, hp: null, ap: null, min: 90 },
      "spain_belgium": { home: 2, away: 1, hp: null, ap: null, min: 90 },
      "belgium_spain": { home: 1, away: 2, hp: null, ap: null, min: 90 },
      "england_norway": { home: 2, away: 1, hp: null, ap: null, min: 120 },
      "norway_england": { home: 1, away: 2, hp: null, ap: null, min: 120 },
      "argentina_switzerland": { home: 3, away: 1, hp: null, ap: null, min: 120 },
      "switzerland_argentina": { home: 1, away: 3, hp: null, ap: null, min: 120 }
    };
    const key = `${homeId}_${awayId}`;
    const result = matchesMap[key];
    if (result) {
      return { homeScore: result.home, awayScore: result.away, homePenalties: result.hp, awayPenalties: result.ap, minute: result.min };
    }
  }

  if (round === "Semi Finals") {
    const matchesMap = {
      "spain_france": { home: 2, away: 0, hp: null, ap: null, min: 90 },
      "france_spain": { home: 0, away: 2, hp: null, ap: null, min: 90 },
      "argentina_england": { home: 2, away: 1, hp: null, ap: null, min: 90 },
      "england_argentina": { home: 1, away: 2, hp: null, ap: null, min: 90 }
    };
    const key = `${homeId}_${awayId}`;
    const result = matchesMap[key];
    if (result) {
      return { homeScore: result.home, awayScore: result.away, homePenalties: result.hp, awayPenalties: result.ap, minute: result.min };
    }
  }

  if (round === "Final") {
    const matchesMap = {
      "spain_argentina": { home: 1, away: 0, hp: null, ap: null, min: 120 },
      "argentina_spain": { home: 0, away: 1, hp: null, ap: null, min: 120 }
    };
    const key = `${homeId}_${awayId}`;
    const result = matchesMap[key];
    if (result) {
      return { homeScore: result.home, awayScore: result.away, homePenalties: result.hp, awayPenalties: result.ap, minute: result.min };
    }
  }

  return { homeScore: 0, awayScore: 0, homePenalties: null, awayPenalties: null, minute: 90 };
};

export const calculateStandings = (fixtures) => {
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const standings = {};
  
  for (const group of groups) {
    const groupTeams = TEAMS.filter(t => t.group === group);
    standings[group] = {
      id: group,
      teams: groupTeams.map(t => ({
        teamId: t.id,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      }))
    };
  }

  const groupStageMatches = fixtures.filter(m => m.round === "Group Stage");
  for (const m of groupStageMatches) {
    const group = m.group;
    if (!group || !standings[group]) continue;

    const homeRow = standings[group].teams.find(row => row.teamId === m.homeTeamId);
    const awayRow = standings[group].teams.find(row => row.teamId === m.awayTeamId);

    if (homeRow && awayRow) {
      homeRow.played += 1;
      awayRow.played += 1;
      homeRow.goalsFor += m.homeScore;
      homeRow.goalsAgainst += m.awayScore;
      awayRow.goalsFor += m.awayScore;
      awayRow.goalsAgainst += m.homeScore;

      if (m.homeScore > m.awayScore) {
        homeRow.won += 1;
        homeRow.points += 3;
        awayRow.lost += 1;
      } else if (m.awayScore > m.homeScore) {
        awayRow.won += 1;
        awayRow.points += 3;
        homeRow.lost += 1;
      } else {
        homeRow.drawn += 1;
        homeRow.points += 1;
        awayRow.drawn += 1;
        awayRow.points += 1;
      }
    }
  }

  for (const group of groups) {
    standings[group].teams.forEach(row => {
      row.goalDifference = row.goalsFor - row.goalsAgainst;
    });
    standings[group].teams.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
  }

  return standings;
};

export const getMockStatsAndLineups = (homeId, awayId, homeScore, awayScore) => {
  const homeSquad = generateSquads(homeId);
  const awaySquad = generateSquads(awayId);
  const possessionHome = 45 + (homeScore - awayScore) * 3 + Math.floor(Math.random() * 5);
  const possessionNormalized = Math.max(25, Math.min(75, possessionHome));
  
  return {
    stats: {
      possessionHome: possessionNormalized,
      possessionAway: 100 - possessionNormalized,
      shotsHome: 6 + homeScore * 2 + Math.floor(Math.random() * 3),
      shotsAway: 4 + awayScore * 2 + Math.floor(Math.random() * 3),
      passesHome: 390 + Math.floor(Math.random() * 40),
      passesAway: 350 + Math.floor(Math.random() * 40),
      foulsHome: 9 + Math.floor(Math.random() * 4),
      foulsAway: 11 + Math.floor(Math.random() * 4)
    },
    lineups: {
      home: homeSquad.slice(0, 4),
      away: awaySquad.slice(0, 4)
    }
  };
};

export const generateFixtures = () => {
  const fixtures = [];
  const lines = RAW_FIXTURES_TEXT.split("\n");
  let currentDate = "";
  let matchIdx = 1;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const dateMatch = line.match(/^(\d+)\s+(June|July)\s*\([A-Za-z]+\)/);
    let restOfLine = line;

    if (dateMatch) {
      currentDate = `${dateMatch[1]} ${dateMatch[2]}`;
      restOfLine = line.substring(dateMatch[0].length).trim();
      if (restOfLine.startsWith("–") || restOfLine.startsWith("-")) {
        restOfLine = restOfLine.substring(1).trim();
      }
    }

    const timeMatch = restOfLine.match(/^(\d{1,2}:\d{2}\s+(AM|PM))\s*[–-]\s*(.+)$/i);
    if (!timeMatch) {
      console.warn("Could not parse line: " + line);
      continue;
    }

    const timeStr = timeMatch[1];
    const matchupStr = timeMatch[3];

    const teamsSplit = matchupStr.split(/\s+vs\s+/i);
    if (teamsSplit.length !== 2) {
      console.warn("Could not split matchup: " + matchupStr);
      continue;
    }

    const homeTeamName = teamsSplit[0].trim();
    const awayTeamName = teamsSplit[1].trim();

    const findTeamId = (name) => {
      const cleanName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const matched = TEAMS.find(t => {
        const teamNameClean = t.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return teamNameClean === cleanName || t.code.toLowerCase() === cleanName;
      });
      if (!matched) {
        if (name.includes("Bosnia")) return "bosnia";
        if (name.includes("Congo") || name.includes("DR")) return "dr_congo";
        if (name.includes("Türkiye") || name.includes("Turkey") || name.includes("turkey")) return "turkey";
        if (name.includes("Curaçao") || name.includes("Curacao")) return "curacao";
        if (name.includes("Ivory Coast") || name.includes("Côte d'Ivoire") || name.includes("cote")) return "ivory_coast";
        if (name.includes("Cabo Verde") || name.includes("Cape Verde")) return "cape_verde";
        if (name.includes("Czech")) return "czechia";
        console.error("Team not found for name: " + name);
        return name.toLowerCase().replace(/\s+/g, "_");
      }
      return matched.id;
    };

    const homeId = findTeamId(homeTeamName);
    const awayId = findTeamId(awayTeamName);

    const [day, monthName] = currentDate.split(" ");
    const month = monthName === "June" ? "06" : "07";
    const dayFormatted = String(day).padStart(2, "0");

    const [timePart, ampm] = timeStr.split(/\s+/);
    let [hours, minutes] = timePart.split(":").map(Number);
    if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
    
    const hoursFormatted = String(hours).padStart(2, "0");
    const minutesFormatted = String(minutes).padStart(2, "0");

    const istDateStr = `2026-${month}-${dayFormatted}T${hoursFormatted}:${minutesFormatted}:00+05:30`;
    const utcDateStr = new Date(istDateStr).toISOString();

    const homeTeamObj = TEAMS.find(t => t.id === homeId) || { group: null };

    const scoreResult = getFixtureResult(homeId, awayId, "Group Stage");
    const extraData = getMockStatsAndLineups(homeId, awayId, scoreResult.homeScore, scoreResult.awayScore);

    fixtures.push({
      id: `match_${matchIdx}`,
      homeTeamId: homeId,
      awayTeamId: awayId,
      date: utcDateStr,
      timeIST: `${timeStr} IST`,
      stadiumId: STADIUMS[matchIdx % STADIUMS.length].id,
      round: "Group Stage",
      group: homeTeamObj.group,
      status: "Finished",
      minute: 90,
      homeScore: scoreResult.homeScore,
      awayScore: scoreResult.awayScore,
      featured: false,
      sportsdbEventId: `sdb_${500000 + matchIdx}`,
      ...extraData
    });

    matchIdx++;
  }

  // Round of 32 (16 matches: June 29 - July 4)
  const r32MatchesList = [
    { home: "canada", away: "south_africa", date: "2026-06-29T00:30:00+05:30", timeIST: "12:30 AM IST" },
    { home: "brazil", away: "japan", date: "2026-06-29T22:30:00+05:30", timeIST: "10:30 PM IST" },
    { home: "germany", away: "paraguay", date: "2026-06-30T02:00:00+05:30", timeIST: "02:00 AM IST" },
    { home: "netherlands", away: "morocco", date: "2026-06-30T06:30:00+05:30", timeIST: "06:30 AM IST" },
    { home: "ivory_coast", away: "norway", date: "2026-06-30T22:30:00+05:30", timeIST: "10:30 PM IST" },
    { home: "france", away: "sweden", date: "2026-07-01T02:30:00+05:30", timeIST: "02:30 AM IST" },
    { home: "mexico", away: "ecuador", date: "2026-07-01T06:30:00+05:30", timeIST: "06:30 AM IST" },
    { home: "england", away: "dr_congo", date: "2026-07-01T21:30:00+05:30", timeIST: "09:30 PM IST" },
    { home: "belgium", away: "senegal", date: "2026-07-02T01:30:00+05:30", timeIST: "01:30 AM IST" },
    { home: "usa", away: "bosnia", date: "2026-07-02T05:30:00+05:30", timeIST: "05:30 AM IST" },
    { home: "spain", away: "austria", date: "2026-07-03T00:30:00+05:30", timeIST: "12:30 AM IST" },
    { home: "portugal", away: "croatia", date: "2026-07-03T04:30:00+05:30", timeIST: "04:30 AM IST" },
    { home: "switzerland", away: "algeria", date: "2026-07-03T08:30:00+05:30", timeIST: "08:30 AM IST" },
    { home: "australia", away: "egypt", date: "2026-07-03T23:30:00+05:30", timeIST: "11:30 PM IST" },
    { home: "argentina", away: "cape_verde", date: "2026-07-04T03:30:00+05:30", timeIST: "03:30 AM IST" },
    { home: "colombia", away: "ghana", date: "2026-07-04T07:00:00+05:30", timeIST: "07:00 AM IST" }
  ];

  const r32Winners = [];

  r32MatchesList.forEach((match) => {
    const stadium = STADIUMS[matchIdx % STADIUMS.length];
    const utcDateStr = new Date(match.date).toISOString();
    
    const result = getFixtureResult(match.home, match.away, "Round of 32");
    const extraData = getMockStatsAndLineups(match.home, match.away, result.homeScore, result.awayScore);
    
    fixtures.push({
      id: `match_${matchIdx}`,
      homeTeamId: match.home,
      awayTeamId: match.away,
      homePlaceholder: "",
      awayPlaceholder: "",
      date: utcDateStr,
      timeIST: match.timeIST,
      stadiumId: stadium.id,
      round: "Round of 32",
      group: null,
      status: "Finished",
      minute: result.minute,
      homeScore: result.homeScore,
      awayScore: result.awayScore,
      homePenalties: result.homePenalties,
      awayPenalties: result.awayPenalties,
      featured: false,
      sportsdbEventId: `sdb_${500000 + matchIdx}`,
      ...extraData
    });
    
    const isHomeWinner = result.homeScore > result.awayScore || (result.homePenalties !== null && result.homePenalties > result.awayPenalties);
    const winnerId = isHomeWinner ? match.home : match.away;
    r32Winners.push(winnerId);
    
    matchIdx++;
  });

  // Round of 16 (8 matches: July 4 - July 7)
  const r16Winners = [];
  const r16Pairings = [
    { home: r32Winners[0], away: r32Winners[3], homePlaceholder: "Winner R32 Match 1", awayPlaceholder: "Winner R32 Match 4" }, // Canada vs Morocco
    { home: r32Winners[2], away: r32Winners[5], homePlaceholder: "Winner R32 Match 3", awayPlaceholder: "Winner R32 Match 6" }, // Paraguay vs France
    { home: r32Winners[10], away: r32Winners[11], homePlaceholder: "Winner R32 Match 11", awayPlaceholder: "Winner R32 Match 12" }, // Spain vs Portugal
    { home: r32Winners[8], away: r32Winners[9], homePlaceholder: "Winner R32 Match 9", awayPlaceholder: "Winner R32 Match 10" }, // Belgium vs USA
    { home: r32Winners[7], away: r32Winners[6], homePlaceholder: "Winner R32 Match 8", awayPlaceholder: "Winner R32 Match 7" }, // England vs Mexico
    { home: r32Winners[4], away: r32Winners[1], homePlaceholder: "Winner R32 Match 5", awayPlaceholder: "Winner R32 Match 2" }, // Norway vs Brazil
    { home: r32Winners[14], away: r32Winners[13], homePlaceholder: "Winner R32 Match 15", awayPlaceholder: "Winner R32 Match 14" }, // Argentina vs Egypt
    { home: r32Winners[12], away: r32Winners[15], homePlaceholder: "Winner R32 Match 13", awayPlaceholder: "Winner R32 Match 16" } // Switzerland vs Colombia
  ];

  r16Pairings.forEach((match, idx) => {
    const matchDate = new Date("2026-07-04T18:00:00Z");
    matchDate.setDate(matchDate.getDate() + Math.floor(idx / 2));
    const stadium = STADIUMS[(idx + 4) % STADIUMS.length];
    
    const result = getFixtureResult(match.home, match.away, "Round of 16");
    const extraData = getMockStatsAndLineups(match.home, match.away, result.homeScore, result.awayScore);

    fixtures.push({
      id: `match_${matchIdx}`,
      homeTeamId: match.home,
      awayTeamId: match.away,
      homePlaceholder: match.homePlaceholder,
      awayPlaceholder: match.awayPlaceholder,
      date: matchDate.toISOString(),
      timeIST: "20:30 IST",
      stadiumId: stadium.id,
      round: "Round of 16",
      group: null,
      status: "Finished",
      minute: result.minute,
      homeScore: result.homeScore,
      awayScore: result.awayScore,
      homePenalties: result.homePenalties,
      awayPenalties: result.awayPenalties,
      featured: false,
      sportsdbEventId: `sdb_${500000 + matchIdx}`,
      ...extraData
    });

    const isHomeWinner = result.homeScore > result.awayScore || (result.homePenalties !== null && result.homePenalties > result.awayPenalties);
    const winnerId = isHomeWinner ? match.home : match.away;
    r16Winners.push(winnerId);
    
    matchIdx++;
  });

  // Quarter Finals (4 matches: July 9 - July 11)
  const qfWinners = [];
  for (let idx = 0; idx < 4; idx++) {
    const homeTeamId = r16Winners[idx * 2];
    const awayTeamId = r16Winners[idx * 2 + 1];
    const matchDate = new Date("2026-07-09T18:00:00Z");
    matchDate.setDate(matchDate.getDate() + idx);
    const stadium = STADIUMS[(idx + 8) % STADIUMS.length];
    
    const result = getFixtureResult(homeTeamId, awayTeamId, "Quarter Finals");
    const extraData = getMockStatsAndLineups(homeTeamId, awayTeamId, result.homeScore, result.awayScore);

    fixtures.push({
      id: `match_${matchIdx}`,
      homeTeamId,
      awayTeamId,
      homePlaceholder: `Winner R16 Match ${idx * 2 + 1}`,
      awayPlaceholder: `Winner R16 Match ${idx * 2 + 2}`,
      date: matchDate.toISOString(),
      timeIST: "23:30 IST",
      stadiumId: stadium.id,
      round: "Quarter Finals",
      group: null,
      status: "Finished",
      minute: result.minute,
      homeScore: result.homeScore,
      awayScore: result.awayScore,
      homePenalties: result.homePenalties,
      awayPenalties: result.awayPenalties,
      featured: false,
      sportsdbEventId: `sdb_${500000 + matchIdx}`,
      ...extraData
    });

    const isHomeWinner = result.homeScore > result.awayScore || (result.homePenalties !== null && result.homePenalties > result.awayPenalties);
    const winnerId = isHomeWinner ? homeTeamId : awayTeamId;
    qfWinners.push(winnerId);
    
    matchIdx++;
  }

  // Semi Finals (2 matches: July 14 - July 15)
  const sfWinners = [];
  for (let idx = 0; idx < 2; idx++) {
    const homeTeamId = qfWinners[idx * 2];
    const awayTeamId = qfWinners[idx * 2 + 1];
    const matchDate = idx === 0 ? "2026-07-14T18:00:00Z" : "2026-07-15T18:00:00Z";
    const stadiumId = idx === 0 ? "sofi" : "dallas";
    
    const result = getFixtureResult(homeTeamId, awayTeamId, "Semi Finals");
    const extraData = getMockStatsAndLineups(homeTeamId, awayTeamId, result.homeScore, result.awayScore);

    fixtures.push({
      id: `match_${matchIdx}`,
      homeTeamId,
      awayTeamId,
      homePlaceholder: `Winner Quarter-Final ${idx * 2 + 1}`,
      awayPlaceholder: `Winner Quarter-Final ${idx * 2 + 2}`,
      date: new Date(matchDate).toISOString(),
      timeIST: "20:30 IST",
      stadiumId,
      round: "Semi Finals",
      group: null,
      status: "Finished",
      minute: result.minute,
      homeScore: result.homeScore,
      awayScore: result.awayScore,
      homePenalties: result.homePenalties,
      awayPenalties: result.awayPenalties,
      featured: false,
      sportsdbEventId: `sdb_${500000 + matchIdx}`,
      ...extraData
    });

    const isHomeWinner = result.homeScore > result.awayScore || (result.homePenalties !== null && result.homePenalties > result.awayPenalties);
    const winnerId = isHomeWinner ? homeTeamId : awayTeamId;
    sfWinners.push(winnerId);
    
    matchIdx++;
  }

  // Final (July 19)
  const finalHomeId = sfWinners[0];
  const finalAwayId = sfWinners[1];
  const result = getFixtureResult(finalHomeId, finalAwayId, "Final");
  const extraData = getMockStatsAndLineups(finalHomeId, finalAwayId, result.homeScore, result.awayScore);

  fixtures.push({
    id: `match_${matchIdx}`,
    homeTeamId: finalHomeId,
    awayTeamId: finalAwayId,
    homePlaceholder: "Winner Semi-Final 1",
    awayPlaceholder: "Winner Semi-Final 2",
    date: new Date("2026-07-19T19:00:00Z").toISOString(),
    timeIST: "00:30 IST",
    stadiumId: "metlife",
    round: "Final",
    group: null,
    status: "Finished",
    minute: result.minute,
    homeScore: result.homeScore,
    awayScore: result.awayScore,
    homePenalties: result.homePenalties,
    awayPenalties: result.awayPenalties,
    featured: true,
    sportsdbEventId: `sdb_${500000 + matchIdx}`,
    ...extraData
  });

  return fixtures;
};

// Default news articles
export const DEFAULT_NEWS = [
  {
    id: "news_1",
    title: "THE THREE LIONS TOUCH DOWN IN L.A. FOR OPENING CLASH",
    summary: "England national team lands in Los Angeles preparing for their opening fixture against USA.",
    content: "The England squad arrived at Los Angeles International Airport late last night, drawing huge crowds. Manager Gareth Southgate expressed confidence in training updates: 'The weather is warm but our players are fully adapted and ready to start strong.' Harry Kane led the team camp in light drills this afternoon under intense media presence.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    category: "Breaking",
    publishedAt: new Date().toISOString()
  },
  {
    id: "news_2",
    title: "MBAPPÉ DOUBTFUL FOR SEMI-FINAL CLASH",
    summary: "French medical team conducts scans on Kylian Mbappé following training strain.",
    content: "French superstar Kylian Mbappé left the training grounds early with a suspected hamstring strain. While team doctors are hopeful, scans reveal a minor tear that could sideline him for the highly anticipated Semi-Final clash. Pundits suggest Antoine Griezmann will take up a more advanced focal role if Mbappé is unavailable.",
    image: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&auto=format&fit=crop&q=80",
    category: "Update",
    publishedAt: new Date().toISOString()
  },
  {
    id: "news_3",
    title: "AZTECA ATMOSPHERE SETS RECORD",
    summary: "Decibel levels hit record heights during opening match in Mexico City.",
    content: "Estadio Azteca was absolutely rocking as Mexico faced Poland in their opening match. Over 87,000 passionate fans created a deafening wave of noise, hitting a record 122 decibels at kickoff. Local organizers praised the historic security preparations and fan atmosphere.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    category: "Analysis",
    publishedAt: new Date().toISOString()
  }
];

export const bootstrapDatabase = async () => {
  console.log("Starting database bootstrap with custom schedule...");
  
  // 1. Write Stadiums
  for (const stadium of STADIUMS) {
    await dbSetDoc("stadiums", stadium.id, stadium);
  }
  console.log("Bootstrap: Stadiums written.");

  // 2. Write Teams (with squads)
  const TEAM_ISO_CODES = {
    mexico: "mx", south_africa: "za", south_korea: "kr", czechia: "cz",
    canada: "ca", bosnia: "ba", qatar: "qa", switzerland: "ch",
    usa: "us", paraguay: "py", australia: "au", turkey: "tr",
    brazil: "br", morocco: "ma", haiti: "ht", scotland: "gb-sct",
    germany: "de", curacao: "cw", ivory_coast: "ci", ecuador: "ec",
    netherlands: "nl", japan: "jp", sweden: "se", tunisia: "tn",
    spain: "es", cape_verde: "cv", saudi_arabia: "sa", uruguay: "uy",
    belgium: "be", egypt: "eg", iran: "ir", new_zealand: "nz",
    france: "fr", senegal: "sn", iraq: "iq", norway: "no",
    argentina: "ar", algeria: "dz", austria: "at", jordan: "jo",
    portugal: "pt", dr_congo: "cd", uzbekistan: "uz", colombia: "co",
    england: "gb-eng", croatia: "hr", ghana: "gh", panama: "pa"
  };

  for (const team of TEAMS) {
    const squad = generateSquads(team.id);
    const code = TEAM_ISO_CODES[team.id] || "un";
    const flagUrl = `https://flagcdn.com/w80/${code}.png`;
    const teamData = { ...team, flag: flagUrl, squad: squad };
    await dbSetDoc("teams", team.id, teamData);
  }
  console.log("Bootstrap: Teams and squads written.");

  // 3. Write Fixtures (Matches)
  const fixtures = generateFixtures();
  for (const match of fixtures) {
    await dbSetDoc("matches", match.id, match);
    
    // Add realistic events for finished matches to make it look premium
    if (match.status === "Finished") {
      const events = [];
      const homeSquad = generateSquads(match.homeTeamId);
      const awaySquad = generateSquads(match.awayTeamId);
      
      const getRandomPlayer = (squad) => {
        if (squad && squad.length > 0) {
          return squad[Math.floor(Math.random() * squad.length)].name;
        }
        return "Player";
      };

      let eventIdCounter = 1;
      
      // Inject Goals for Home Team
      for (let g = 0; g < match.homeScore; g++) {
        const minute = 1 + Math.floor(Math.random() * 89);
        events.push({
          id: `ev_${match.id}_g_h_${eventIdCounter++}`,
          type: "Goal",
          minute,
          playerName: getRandomPlayer(homeSquad),
          teamId: match.homeTeamId,
          detail: "Spectacular goal!"
        });
      }
      
      // Inject Goals for Away Team
      for (let g = 0; g < match.awayScore; g++) {
        const minute = 1 + Math.floor(Math.random() * 89);
        events.push({
          id: `ev_${match.id}_g_a_${eventIdCounter++}`,
          type: "Goal",
          minute,
          playerName: getRandomPlayer(awaySquad),
          teamId: match.awayTeamId,
          detail: "Clinical finish!"
        });
      }

      // Add a couple of yellow cards
      const numYellows = Math.floor(Math.random() * 4); // 0 to 3
      for (let y = 0; y < numYellows; y++) {
        const isHome = Math.random() > 0.5;
        const squad = isHome ? homeSquad : awaySquad;
        const teamId = isHome ? match.homeTeamId : match.awayTeamId;
        const minute = 1 + Math.floor(Math.random() * 89);
        events.push({
          id: `ev_${match.id}_yc_${eventIdCounter++}`,
          type: "Yellow Card",
          minute,
          playerName: getRandomPlayer(squad),
          teamId
        });
      }

      // Historical fallback specific events (optional, just in case)
      if (match.homeTeamId === "argentina" && match.awayTeamId === "australia") {
        events.push(
          { id: "ev_1", type: "Yellow Card", minute: 15, playerName: "Jackson Irvine", teamId: "australia" },
          { id: "ev_2", type: "Yellow Card", minute: 38, playerName: "Milos Degenek", teamId: "australia" },
          { id: "ev_3", type: "Goal", minute: 35, playerName: "Lionel Messi", detail: "Assisted by Nicolás Otamendi", teamId: "argentina" },
          { id: "ev_4", type: "Goal", minute: 57, playerName: "Julián Álvarez", detail: "Spectacular steal and finish!", teamId: "argentina" },
          { id: "ev_5", type: "Goal", minute: 77, playerName: "Enzo Fernández", detail: "Own Goal (Deflected shot)", teamId: "australia" }
        );
      } else if (match.homeTeamId === "netherlands" && match.awayTeamId === "usa") {
        events.push(
          { id: "ev_1", type: "Goal", minute: 10, playerName: "Memphis Depay", detail: "Assisted by Denzel Dumfries", teamId: "netherlands" },
          { id: "ev_2", type: "Goal", minute: 45, playerName: "Daley Blind", detail: "Assisted by Denzel Dumfries", teamId: "netherlands" },
          { id: "ev_3", type: "Yellow Card", minute: 60, playerName: "Teun Koopmeiners", teamId: "netherlands" },
          { id: "ev_4", type: "Yellow Card", minute: 67, playerName: "Weston McKennie", teamId: "usa" }
        );
      }

      for (const ev of events) {
        await dbSetDoc(`matches/${match.id}/events`, ev.id, ev);
      }
    }
  }
  console.log(`Bootstrap: All ${fixtures.length} Matches generated and written.`);

  // 4. Write News
  for (const news of DEFAULT_NEWS) {
    await dbSetDoc("news", news.id, news);
  }
  console.log("Bootstrap: Default news articles written.");

  // 5. Initialize Standings based on Group Stage
  const standings = calculateStandings(fixtures);
  for (const [group, standingsData] of Object.entries(standings)) {
    await dbSetDoc("standings", group, standingsData);
  }
  console.log("Bootstrap: Group standings initialized.");

  // 6. Admin credentials
  await dbSetDoc("settings", "admin_credentials", {
    email: "admin@redcardlive.com",
    passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" // SHA256 of "password"
  });

  // 7. Retro sponsorship
  const retroShirts = [
    { id: "br_70", name: "Brazil '70 Classic", price: 89.99, icon: "👕" },
    { id: "arg_86", name: "Argentina '86 Away", price: 84.99, icon: "👕" },
    { id: "it_90", name: "Italy '90 Home", price: 79.99, icon: "👕" },
    { id: "eng_66", name: "England '66 Red", price: 94.99, icon: "👕" }
  ];
  for (const shirt of retroShirts) {
    await dbSetDoc("retro_jersey", shirt.id, shirt);
  }
  
  console.log("Database Bootstrap complete successfully!");
};

export const bootstrapRoundOf32Only = async () => {
  console.log("Starting bootstrap of Round of 32 matches...");
  const fixtures = generateFixtures();
  const r32Matches = fixtures.filter(m => m.round === "Round of 32");
  for (const match of r32Matches) {
    await dbSetDoc("matches", match.id, match);
  }
  console.log("Bootstrap of Round of 32 matches complete.");
};
