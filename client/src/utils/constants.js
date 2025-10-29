
export const API_URL = import.meta.env.VITE_APP_API_URL 

const navLinks = [
 
  {
    id: "Roadmap",
    title: "Roadmap",
    link: "/roadmap",
  },
  {
    id: "Profile",
    title: "Profile",
    link: "/profile",
  },
];

const initialFormData = {
  name: "",

};

const initialData = {
  _id: 1,
  step0: {
    topic: "Pronunciation Basics",
    goal: "Understand and practice the fundamental sounds of Spanish.",
    resources: [
      {
        goal: "Spanish Alphabet and Sounds Video (YouTube)",
        description:
          "A video explaining the Spanish alphabet and pronunciation of each letter and sound.",
        type: "video",
        link: "https://www.youtube.com/watch?v=eJv-jJ-yJ-U",
      },
      {
        goal: "Interactive Pronunciation Exercises (Online)",
        description:
          "Website with interactive exercises to practice pronunciation.",
        type: "website",
        link: "https://www.spanishsabores.com/spanish-pronunciation-exercises",
      },
      {
        goal: "Audio Recordings of Spanish Words (Spotify/Apple Music)",
        description: "Listen to native speakers pronouncing common words.",
        type: "audio",
        link: "https://open.spotify.com/search/keywords/spanish%20pronunciation",
      },
    ],
    description:
      "Understanding pronunciation is crucial for comprehending and being understood in Spanish. This initial step focuses on mastering the core sounds.",
    difficulty: "beginner",
    nei: [],
    position: { x: 25, y: 25 },
    id: 0
  },

};

const initialData2 = {
  _id: 2,
  step0: {
    topic: "TESSSTTTT",
    goal: "Understand and practice the fundamental sounds of Spanish.",
    resources: [
      {
        goal: "Spanish Alphabet and Sounds Video (YouTube)",
        description:
          "A video explaining the Spanish alphabet and pronunciation of each letter and sound.",
        type: "video",
        link: "https://www.youtube.com/watch?v=eJv-jJ-yJ-U",
      },
      {
        goal: "Interactive Pronunciation Exercises (Online)",
        description:
          "Website with interactive exercises to practice pronunciation.",
        type: "website",
        link: "https://www.spanishsabores.com/spanish-pronunciation-exercises",
      },
      {
        goal: "Audio Recordings of Spanish Words (Spotify/Apple Music)",
        description: "Listen to native speakers pronouncing common words.",
        type: "audio",
        link: "https://open.spotify.com/search/keywords/spanish%20pronunciation",
      },
    ],
    description:
      "Understanding pronunciation is crucial for comprehending and being understood in Spanish. This initial step focuses on mastering the core sounds.",
    difficulty: "beginner",
    nei: [],
    position: { x: 25, y: 25 },
    id: 0
  },
 
};

const data = [initialData, initialData2]
export { navLinks, initialData,initialData2,  initialFormData,data };
