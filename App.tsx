
import React, { useState, useEffect, Component, ReactNode, ErrorInfo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, Search, ChevronRight, User, Trophy, Calendar, 
  Newspaper, PlayCircle, BarChart3, Home, Users, BookOpen, 
  ArrowRight, Award, Zap
} from 'lucide-react';
import AdPlaceholder from './components/AdPlaceholder';

// --- Error Boundary ---

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-red-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">We encountered an error while loading this page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

// --- Types & Databases ---

interface PlayerStats {
  matches: string;
  runs: string;
  average: string;
  highScore: string;
  wickets?: string;
  economy?: string;
  bestBowling?: string;
}

interface PlayerDetail {
  name: string;
  role: string;
  team: string; // "Legend", "Men's Team", "Women's Team"
  imageColor: string;
  bio: string;
  stats: {
    test: PlayerStats;
    odi: PlayerStats;
    t20i: PlayerStats;
  };
  achievements: string[];
}

// COMPREHENSIVE PLAYER DATABASE
const PLAYER_DETAILS_DB: Record<string, PlayerDetail> = {
  // --- LEGENDS ---
  "Sachin Tendulkar": {
    name: "Sachin Tendulkar",
    role: "Batter",
    team: "Legend",
    imageColor: "bg-blue-600",
    bio: "The 'God of Cricket', Sachin Tendulkar is widely regarded as one of the greatest batsmen in the history of cricket. He is the all-time leading run-scorer in international cricket and the only player to have scored one hundred international centuries.",
    stats: {
      test: { matches: "200", runs: "15,921", average: "53.78", highScore: "248*" },
      odi: { matches: "463", runs: "18,426", average: "44.83", highScore: "200*" },
      t20i: { matches: "1", runs: "10", average: "10.00", highScore: "10" }
    },
    achievements: [
      "First player to score a double century in ODI cricket.",
      "Most runs in Test and ODI cricket.",
      "100 International Centuries.",
      "Bharat Ratna Awardee (2014).",
      "2011 World Cup Winner."
    ]
  },
  "Sunil Gavaskar": {
    name: "Sunil Gavaskar",
    role: "Batter",
    team: "Legend",
    imageColor: "bg-red-700",
    bio: "The 'Little Master' was the first batsman to reach 10,000 Test runs. Known for his immense concentration and technique against fearsome pace attacks without a helmet.",
    stats: {
      test: { matches: "125", runs: "10,122", average: "51.12", highScore: "236*" },
      odi: { matches: "108", runs: "3,092", average: "35.13", highScore: "103*" },
      t20i: { matches: "0", runs: "0", average: "0", highScore: "0" }
    },
    achievements: [
      "First player to score 10,000 Test runs.",
      "Held the record for most Test centuries (34) for two decades.",
      "1983 World Cup Winner."
    ]
  },
  "Kapil Dev": {
    name: "Kapil Dev",
    role: "All-Rounder",
    team: "Legend",
    imageColor: "bg-green-700",
    bio: "India's greatest all-rounder and the captain who led India to its first World Cup victory in 1983.",
    stats: {
      test: { matches: "131", runs: "5,248", average: "31.05", highScore: "163", wickets: "434", bestBowling: "9/83" },
      odi: { matches: "225", runs: "3,783", average: "23.79", highScore: "175*", wickets: "253", bestBowling: "5/43" },
      t20i: { matches: "0", runs: "0", average: "0", highScore: "0" }
    },
    achievements: [
      "1983 World Cup Winning Captain.",
      "First player to take 200 ODI wickets.",
      "Only player with 4,000 runs and 400 wickets in Tests.",
      "Wisden Indian Cricketer of the Century."
    ]
  },
  "Rahul Dravid": {
    name: "Rahul Dravid",
    role: "Batter",
    team: "Legend",
    imageColor: "bg-slate-600",
    bio: "The 'Wall' of Indian cricket, known for his technical solidity and patience. A former captain and head coach who won the 2024 T20 World Cup as coach.",
    stats: {
      test: { matches: "164", runs: "13,288", average: "52.31", highScore: "270" },
      odi: { matches: "344", runs: "10,889", average: "39.16", highScore: "153" },
      t20i: { matches: "1", runs: "31", average: "31.00", highScore: "31" }
    },
    achievements: [
      "Most catches in Test cricket (210).",
      "First player to score centuries in all Test playing nations.",
      "ICC Hall of Fame Inductee."
    ]
  },
  "MS Dhoni": {
    name: "MS Dhoni",
    role: "Wicketkeeper Batter",
    team: "Legend",
    imageColor: "bg-yellow-600",
    bio: "Mahendra Singh Dhoni, 'Captain Cool', is the only captain in history to win all three ICC trophies. Known for his finishing abilities and lightning-fast wicketkeeping.",
    stats: {
      test: { matches: "90", runs: "4,876", average: "38.09", highScore: "224" },
      odi: { matches: "350", runs: "10,773", average: "50.57", highScore: "183*" },
      t20i: { matches: "98", runs: "1,617", average: "37.60", highScore: "56" }
    },
    achievements: [
      "2007 T20 World Cup, 2011 ODI World Cup, 2013 Champions Trophy Winner.",
      "Most stumpings in international cricket.",
      "Padma Bhushan (2018).",
      "Honorary Lieutenant Colonel in Indian Territorial Army."
    ]
  },
  "Anil Kumble": {
    name: "Anil Kumble",
    role: "Bowler",
    team: "Legend",
    imageColor: "bg-indigo-700",
    bio: "India's greatest match-winner with the ball. 'Jumbo' is one of only three bowlers in history to take all 10 wickets in a single Test innings.",
    stats: {
      test: { matches: "132", runs: "2,506", average: "17.77", highScore: "110*", wickets: "619", bestBowling: "10/74" },
      odi: { matches: "271", runs: "938", average: "10.53", highScore: "26", wickets: "337", bestBowling: "6/12" },
      t20i: { matches: "0", runs: "0", average: "0", highScore: "0" }
    },
    achievements: [
      "Most wickets for India in Test cricket (619).",
      "Took 10/74 against Pakistan in 1999.",
      "Former Indian Captain and Head Coach."
    ]
  },
  "Virender Sehwag": {
    name: "Virender Sehwag",
    role: "Batter",
    team: "Legend",
    imageColor: "bg-orange-500",
    bio: "The 'Nawab of Najafgarh' redefined opening batting in Test cricket. Known for his simple philosophy: see ball, hit ball.",
    stats: {
      test: { matches: "104", runs: "8,586", average: "49.34", highScore: "319" },
      odi: { matches: "251", runs: "8,273", average: "35.05", highScore: "219" },
      t20i: { matches: "19", runs: "394", average: "21.88", highScore: "68" }
    },
    achievements: [
      "Only Indian to score two triple centuries in Tests.",
      "2007 T20 World Cup & 2011 ODI World Cup Winner.",
      "Scored fastest triple century in Test history."
    ]
  },
  "Bishan Singh Bedi": {
    name: "Bishan Singh Bedi",
    role: "Bowler",
    team: "Legend",
    imageColor: "bg-pink-700",
    bio: "A master of flight and guile, Bedi was part of the legendary Indian spin quartet. His poetry in motion bowling action is still admired today.",
    stats: {
      test: { matches: "67", runs: "656", average: "8.98", highScore: "50", wickets: "266", bestBowling: "7/98" },
      odi: { matches: "10", runs: "31", average: "10.33", highScore: "13", wickets: "7", bestBowling: "2/44" },
      t20i: { matches: "0", runs: "0", average: "0", highScore: "0" }
    },
    achievements: [
      "1560 First-class wickets, the most by any Indian.",
      "Led India to its first Test win in Australia.",
      "Padma Shri Awardee."
    ]
  },
  "Vinoo Mankad": {
    name: "Vinoo Mankad",
    role: "All-Rounder",
    team: "Legend",
    imageColor: "bg-gray-600",
    bio: "One of India's first great all-rounders. He holds the record for the highest opening partnership in Tests (413) with Pankaj Roy which stood for 52 years.",
    stats: {
      test: { matches: "44", runs: "2,109", average: "31.47", highScore: "231", wickets: "162", bestBowling: "8/52" },
      odi: { matches: "0", runs: "0", average: "0", highScore: "0" },
      t20i: { matches: "0", runs: "0", average: "0", highScore: "0" }
    },
    achievements: [
      "Scored 184 and took 5 wickets in the 'Mankad's Test' at Lord's (1952).",
      "First Indian to score 2000 runs and take 100 wickets in Tests.",
      "Wisden Cricketer of the Year 1947."
    ]
  },
  "Sourav Ganguly": {
    name: "Sourav Ganguly",
    role: "Batter",
    team: "Legend",
    imageColor: "bg-blue-800",
    bio: "Dada, the Prince of Kolkata, is credited with instilling aggression in the Indian team. One of the finest left-handed batters and a revolutionary captain.",
    stats: {
      test: { matches: "113", runs: "7,212", average: "42.17", highScore: "239" },
      odi: { matches: "311", runs: "11,363", average: "41.02", highScore: "183" },
      t20i: { matches: "0", runs: "0", average: "0", highScore: "0" }
    },
    achievements: [
      "One of the most successful Indian Test captains overseas.",
      "Over 11,000 ODI runs.",
      "Former BCCI President."
    ]
  },
  "Virat Kohli": {
    name: "Virat Kohli",
    role: "Batter",
    team: "Men's Team",
    imageColor: "bg-orange-600",
    bio: "Virat Kohli is a modern-day legend known for his aggressive batting and chasing ability. He has redefined fitness standards in Indian cricket.",
    stats: {
      test: { matches: "113", runs: "8,848", average: "49.15", highScore: "254*" },
      odi: { matches: "292", runs: "13,848", average: "58.67", highScore: "183" },
      t20i: { matches: "117", runs: "4,037", average: "51.75", highScore: "122*" }
    },
    achievements: [
      "Most ODI centuries in history (50).",
      "ICC Player of the Decade (2011-2020).",
      "2011 World Cup & 2024 T20 World Cup Winner.",
      "Fastest to 8,000, 9,000, 10,000, 11,000, 12,000, 13,000 ODI runs."
    ]
  },
  "Rohit Sharma": {
    name: "Rohit Sharma",
    role: "Batter",
    team: "Men's Team",
    imageColor: "bg-blue-500",
    bio: "The 'Hitman', Rohit Sharma is known for his elegance and ability to score big hundreds. He is the current captain of the Indian team across formats.",
    stats: {
      test: { matches: "59", runs: "4,137", average: "45.46", highScore: "212" },
      odi: { matches: "262", runs: "10,709", average: "49.12", highScore: "264" },
      t20i: { matches: "159", runs: "4,231", average: "32.05", highScore: "121*" }
    },
    achievements: [
      "Only player to score 3 double centuries in ODIs.",
      "Highest individual score in ODIs (264).",
      "2024 T20 World Cup Winning Captain.",
      "Most sixes in international cricket."
    ]
  },
  "Jasprit Bumrah": {
    name: "Jasprit Bumrah",
    role: "Bowler",
    team: "Men's Team",
    imageColor: "bg-blue-400",
    bio: "A premier fast bowler with an unorthodox action, known for his lethal yorkers and ability to take wickets in all phases of the game.",
    stats: {
      test: { matches: "36", runs: "239", average: "6.82", highScore: "24", wickets: "159", bestBowling: "6/27" },
      odi: { matches: "89", runs: "96", average: "5.05", highScore: "14", wickets: "149", bestBowling: "6/19" },
      t20i: { matches: "70", runs: "17", average: "3.40", highScore: "7", wickets: "89", bestBowling: "3/11" }
    },
    achievements: [
      "First Asian bowler to take 5 wickets in a Test innings in SA, Eng, and Aus.",
      "Player of the Tournament, 2024 T20 World Cup."
    ]
  },
  "KL Rahul": {
    name: "KL Rahul",
    role: "Batter",
    team: "Men's Team",
    imageColor: "bg-gray-800",
    bio: "A classy right-handed batter and wicketkeeper who can bat at any position. Known for his technical correctness and elegant stroke play.",
    stats: {
      test: { matches: "50", runs: "2,863", average: "34.08", highScore: "199" },
      odi: { matches: "75", runs: "2,820", average: "50.35", highScore: "112" },
      t20i: { matches: "72", runs: "2,265", average: "37.75", highScore: "110*" }
    },
    achievements: [
      "Fastest Indian to score a century in all three formats.",
      "Scored a century on ODI debut.",
      "Key member of 2023 ODI World Cup runner-up squad."
    ]
  },
  "Ravindra Jadeja": {
    name: "Ravindra Jadeja",
    role: "All-Rounder",
    team: "Men's Team",
    imageColor: "bg-yellow-700",
    bio: "Sir Jadeja is a true 3D player - exceptional fielder, accurate bowler, and reliable lower-order batter.",
    stats: {
      test: { matches: "72", runs: "3,036", average: "36.14", highScore: "175*", wickets: "294", bestBowling: "7/42" },
      odi: { matches: "197", runs: "2,756", average: "32.42", highScore: "87", wickets: "220", bestBowling: "5/33" },
      t20i: { matches: "74", runs: "515", average: "21.45", highScore: "46", wickets: "54", bestBowling: "3/15" }
    },
    achievements: [
      "Ranked World No. 1 Test All-rounder multiple times.",
      "Fastest left-arm bowler to 200 Test wickets.",
      "2013 Champions Trophy & 2024 T20 World Cup Winner."
    ]
  },
  "Hardik Pandya": {
    name: "Hardik Pandya",
    role: "All-Rounder",
    team: "Men's Team",
    imageColor: "bg-blue-900",
    bio: "An explosive all-rounder who brings balance to the side. Known for his power-hitting and crucial wickets.",
    stats: {
      test: { matches: "11", runs: "532", average: "31.29", highScore: "108", wickets: "17", bestBowling: "5/28" },
      odi: { matches: "86", runs: "1,769", average: "34.01", highScore: "92*", wickets: "84", bestBowling: "4/24" },
      t20i: { matches: "100", runs: "1,492", average: "26.64", highScore: "71*", wickets: "84", bestBowling: "4/16" }
    },
    achievements: [
      "Vice-Captain of 2024 T20 World Cup winning team.",
      "Defended 16 runs in the final over of T20 WC Final 2024.",
      "Led Gujarat Titans to IPL title in their debut season."
    ]
  },
  "Rishabh Pant": {
    name: "Rishabh Pant",
    role: "Wicketkeeper Batter",
    team: "Men's Team",
    imageColor: "bg-blue-400",
    bio: "A dynamic and fearless wicketkeeper-batter who has played some of the greatest test knocks for India overseas. Made a miraculous comeback from a life-threatening accident.",
    stats: {
      test: { matches: "33", runs: "2,271", average: "43.67", highScore: "159*" },
      odi: { matches: "30", runs: "865", average: "34.60", highScore: "125*" },
      t20i: { matches: "74", runs: "1,158", average: "22.70", highScore: "65*" }
    },
    achievements: [
      "First Indian wicketkeeper to score Test centuries in England and Australia.",
      "Breached the Gabba fortress in 2021 with an unbeaten 89*.",
      "ICC Emerging Player of the Year 2018."
    ]
  },
  "Suryakumar Yadav": {
    name: "Suryakumar Yadav",
    role: "Batter",
    team: "Men's Team",
    imageColor: "bg-blue-600",
    bio: "Known as 'SKY', he is arguably the greatest T20 batter India has produced, revolutionizing the format with his 360-degree play.",
    stats: {
      test: { matches: "1", runs: "8", average: "8.00", highScore: "8" },
      odi: { matches: "37", runs: "773", average: "25.76", highScore: "72" },
      t20i: { matches: "68", runs: "2,340", average: "43.33", highScore: "117" }
    },
    achievements: [
      "ICC T20I Cricketer of the Year (2022, 2023).",
      "Ranked World No. 1 T20I Batter.",
      "Took the match-winning catch in 2024 T20 World Cup Final."
    ]
  },
  "Shreyas Iyer": {
    name: "Shreyas Iyer",
    role: "Batter",
    team: "Men's Team",
    imageColor: "bg-purple-700",
    bio: "A solid middle-order batter and an astute captain. Known for his ability to play spin exceptionally well.",
    stats: {
      test: { matches: "14", runs: "811", average: "36.86", highScore: "105" },
      odi: { matches: "59", runs: "2,383", average: "49.64", highScore: "128*" },
      t20i: { matches: "51", runs: "1,104", average: "30.66", highScore: "74*" }
    },
    achievements: [
      "Scored a century on Test debut.",
      "IPL 2024 Winning Captain with KKR.",
      "Highest run-getter for India in middle order in 2023 ODI WC."
    ]
  },
  "Mohammed Siraj": {
    name: "Mohammed Siraj",
    role: "Bowler",
    team: "Men's Team",
    imageColor: "bg-red-600",
    bio: "'Miyan Magic' rose from humble beginnings to become a world-class fast bowler. Known for his aggression and seam movement.",
    stats: {
      test: { matches: "27", runs: "74", average: "5.00", highScore: "16*", wickets: "74", bestBowling: "5/60" },
      odi: { matches: "41", runs: "48", average: "4.00", highScore: "9", wickets: "68", bestBowling: "6/21" },
      t20i: { matches: "13", runs: "5", average: "2.50", highScore: "5", wickets: "14", bestBowling: "4/17" }
    },
    achievements: [
      "Took 6/21 in Asia Cup Final 2023 against Sri Lanka.",
      "Ranked No. 1 ODI Bowler in 2023.",
      "Key architect of India's pace attack."
    ]
  },
  "Kuldeep Yadav": {
    name: "Kuldeep Yadav",
    role: "Bowler",
    team: "Men's Team",
    imageColor: "bg-blue-500",
    bio: "A rare chinaman bowler who adds variety and mystery to the Indian attack. A crucial wicket-taker in white-ball cricket.",
    stats: {
      test: { matches: "12", runs: "283", average: "21.76", highScore: "40", wickets: "53", bestBowling: "5/40" },
      odi: { matches: "103", runs: "189", average: "11.11", highScore: "19", wickets: "168", bestBowling: "6/25" },
      t20i: { matches: "39", runs: "46", average: "11.50", highScore: "23*", wickets: "69", bestBowling: "5/17" }
    },
    achievements: [
      "Only Indian bowler with two ODI hat-tricks.",
      "Fastest Indian spinner to 100 ODI wickets.",
      "Player of the Series in Asia Cup 2023."
    ]
  },
  "Mithali Raj": {
    name: "Mithali Raj",
    role: "Batter",
    team: "Women's Team",
    imageColor: "bg-blue-700",
    bio: "The pillar of Indian women's cricket for two decades. She is the highest run-scorer in women's international cricket.",
    stats: {
      test: { matches: "12", runs: "699", average: "43.68", highScore: "214" },
      odi: { matches: "232", runs: "7,805", average: "50.68", highScore: "125*" },
      t20i: { matches: "89", runs: "2,364", average: "37.52", highScore: "97*" }
    },
    achievements: [
      "Leading run-scorer in Women's ODIs.",
      "Youngest player to score an ODI century (16 years).",
      "Padma Shri & Khel Ratna Awardee."
    ]
  },
  "Harmanpreet Kaur": {
    name: "Harmanpreet Kaur",
    role: "All-Rounder",
    team: "Women's Team",
    imageColor: "bg-blue-600",
    bio: "The aggressive captain of the Indian women's team, known for her monstrous hitting, especially her 171* against Australia.",
    stats: {
      test: { matches: "6", runs: "173", average: "21.62", highScore: "69" },
      odi: { matches: "130", runs: "3,410", average: "37.47", highScore: "171*" },
      t20i: { matches: "166", runs: "3,366", average: "27.81", highScore: "103" }
    },
    achievements: [
      "First Indian woman to score a T20I century.",
      "Highest individual score by an Indian in Women's World Cup (171*).",
      "Captain of Team India."
    ]
  },
  "Smriti Mandhana": {
    name: "Smriti Mandhana",
    role: "Batter",
    team: "Women's Team",
    imageColor: "bg-pink-600",
    bio: "An elegant left-handed opener who combines grace with aggression. One of the leading batters in world cricket today.",
    stats: {
      test: { matches: "6", runs: "480", average: "48.00", highScore: "127" },
      odi: { matches: "82", runs: "3,242", average: "42.65", highScore: "135" },
      t20i: { matches: "128", runs: "3,109", average: "27.51", highScore: "87" }
    },
    achievements: [
      "ICC Women's Cricketer of the Year (2018, 2021).",
      "Fastest Indian woman to 2000 ODI runs.",
      "WPL Winner with RCB (2024)."
    ]
  },
  "Jhulan Goswami": {
    name: "Jhulan Goswami",
    role: "Bowler",
    team: "Women's Team",
    imageColor: "bg-green-600",
    bio: "The 'Chakdaha Express', Jhulan is one of the fastest and most durable bowlers in women's cricket history. Highest wicket-taker in ODIs.",
    stats: {
      test: { matches: "12", runs: "291", average: "24.25", highScore: "69", wickets: "44", bestBowling: "5/25" },
      odi: { matches: "204", runs: "1,228", average: "14.61", highScore: "57", wickets: "255", bestBowling: "6/31" },
      t20i: { matches: "68", runs: "405", average: "10.94", highScore: "37", wickets: "56", bestBowling: "5/11" }
    },
    achievements: [
      "Most wickets in Women's ODI history.",
      "First woman to take 200 ODI wickets.",
      "Padma Shri Awardee."
    ]
  },
  "Shafali Verma": {
    name: "Shafali Verma",
    role: "Batter",
    team: "Women's Team",
    imageColor: "bg-blue-500",
    bio: "A teenage prodigy known for her Sehwag-like aggression at the top of the order. She became the youngest Indian to play international cricket.",
    stats: {
      test: { matches: "4", runs: "359", average: "59.83", highScore: "205" },
      odi: { matches: "26", runs: "588", average: "24.50", highScore: "71*" },
      t20i: { matches: "74", runs: "1,721", average: "24.23", highScore: "81" }
    },
    achievements: [
      "Youngest Indian to score an international half-century.",
      "Fastest double century in Women's Test history.",
      "U-19 World Cup Winning Captain (2023)."
    ]
  },
  "Deepti Sharma": {
    name: "Deepti Sharma",
    role: "All-Rounder",
    team: "Women's Team",
    imageColor: "bg-indigo-600",
    bio: "A premier all-rounder known for her accurate off-spin and reliable left-handed batting. A vital cog in the Indian team.",
    stats: {
      test: { matches: "5", runs: "502", average: "62.75", highScore: "91", wickets: "20", bestBowling: "5/7" },
      odi: { matches: "89", runs: "2,019", average: "35.42", highScore: "188", wickets: "106", bestBowling: "6/20" },
      t20i: { matches: "109", runs: "1,005", average: "24.51", highScore: "64", wickets: "116", bestBowling: "4/10" }
    },
    achievements: [
      "First Indian cricketer to take 100 T20I wickets.",
      "Highest individual score by an Indian woman in ODIs (188).",
      "Player of the Tournament in The Hundred 2024."
    ]
  },
  "Jemimah Rodrigues": {
    name: "Jemimah Rodrigues",
    role: "Batter",
    team: "Women's Team",
    imageColor: "bg-pink-500",
    bio: "A stylish middle-order batter known for her gap-finding ability and vibrant personality. A consistent performer in T20 leagues globally.",
    stats: {
      test: { matches: "2", runs: "235", average: "78.33", highScore: "68" },
      odi: { matches: "30", runs: "710", average: "27.30", highScore: "86" },
      t20i: { matches: "92", runs: "1,985", average: "29.62", highScore: "76" }
    },
    achievements: [
      "Youngest player to score a double century in List-A cricket.",
      "Star performer in WBBL and The Hundred.",
      "Commonwealth Games Silver Medalist (2022)."
    ]
  },
  "Renuka Singh": {
    name: "Renuka Singh",
    role: "Bowler",
    team: "Women's Team",
    imageColor: "bg-orange-500",
    bio: "The leader of India's pace attack, known for her ability to swing the ball significantly in the powerplay.",
    stats: {
      test: { matches: "1", runs: "0", average: "0", highScore: "0", wickets: "1", bestBowling: "1/20" },
      odi: { matches: "10", runs: "12", average: "2.00", highScore: "4", wickets: "20", bestBowling: "4/28" },
      t20i: { matches: "43", runs: "3", average: "1.50", highScore: "2", wickets: "44", bestBowling: "5/15" }
    },
    achievements: [
      "ICC Emerging Women's Cricketer of the Year 2022.",
      "Took 4 wickets against Australia in CWG 2022 opener.",
      "Leading wicket-taker for India in Commonwealth Games."
    ]
  },
  "Shubman Gill": {
    name: "Shubman Gill",
    role: "Batter",
    team: "Men's Team",
    imageColor: "bg-purple-600",
    bio: "The 'Prince' of Indian batting, touted as the next big thing. He has already scored a double century in ODIs and is a prolific run-getter.",
    stats: {
      test: { matches: "25", runs: "1,492", average: "35.52", highScore: "128" },
      odi: { matches: "44", runs: "2,271", average: "61.37", highScore: "208" },
      t20i: { matches: "19", runs: "505", average: "29.70", highScore: "126*" }
    },
    achievements: [
      "Youngest player to score an ODI double century.",
      "Orange Cap in IPL 2023 (890 runs).",
      "Player of the Tournament, U-19 World Cup 2018."
    ]
  }
};

const NEWS_DB = [
  { id: 1, title: "India wins T20 World Cup 2024", source: "ICC Media", time: "2h ago" },
  { id: 2, title: "Virat Kohli announces T20I retirement", source: "BCCI", time: "3h ago" },
  { id: 3, title: "Rohit Sharma lifts the trophy in Barbados", source: "Sports Today", time: "5h ago" },
  { id: 4, title: "Bumrah named Player of the Tournament", source: "CricInfo", time: "6h ago" },
  { id: 5, title: "Jay Shah announces prize money for Team India", source: "News18", time: "1d ago" },
];

const HISTORY_CONTENT = [
  {
    title: "1. The Beginning of Glory",
    years: "1983–1991",
    description: "The turning point in Indian cricket arrived in 1983, when Kapil Dev led an unheralded Indian team to a historic World Cup win at Lord’s. This victory not only shocked the cricketing world but also ignited an unstoppable passion for cricket across India. The 1985 World Championship of Cricket in Australia added another feather to India’s cap, with Ravi Shastri winning the “Champion of Champions” award.\n\nThis era laid the foundation for India’s cricketing identity and began the country’s rise in global cricket."
  },
  {
    title: "2. The Era of Superstars",
    years: "1992–2000",
    description: "The 1992 World Cup introduced modern cricket—colored jerseys, white balls, and floodlights. In this era emerged one of cricket’s greatest legends: Sachin Tendulkar. Along with stars like Sourav Ganguly, Rahul Dravid, Anil Kumble, and Javagal Srinath, this generation strengthened India’s foundation.\n\nThe late ’90s brought challenges too, particularly the match-fixing scandal that shook the nation. However, it became a turning point for rebuilding the team with stronger ethics, discipline, and structure."
  },
  {
    title: "3. The Ganguly Revolution",
    years: "2000–2007",
    description: "Sourav Ganguly took over a broken team and rebuilt it with courage, aggression, and belief. With John Wright as India’s first foreign coach, a new culture of professionalism began.\n\nThis era saw:\n• The iconic NatWest Trophy win in 2002, where Ganguly waved his shirt at Lord’s.\n• 2003 World Cup Final, signaling India’s return to global dominance.\n• A historic series win in Pakistan in 2004.\n\nA new generation emerged—Virender Sehwag, Yuvraj Singh, Harbhajan Singh, Zaheer Khan—who became the backbone of future success."
  },
  {
    title: "4. The MS Dhoni Era",
    years: "2007–2016",
    description: "MS Dhoni, calm and fearless, led India into its most successful era. Key milestones of this period include:\n• Winning the 2007 T20 World Cup, which sparked the T20 revolution.\n• The launch of the Indian Premier League (IPL) in 2008, which transformed world cricket.\n• The 2011 Cricket World Cup victory, ending a 28-year wait, with Dhoni’s historic winning six.\n• Winning the 2013 Champions Trophy, making Dhoni the only captain to win all ICC trophies.\n\nThis era defined India as a modern cricket superpower."
  },
  {
    title: "5. The Virat Kohli Era",
    years: "2014–2022",
    description: "Under Virat Kohli, India became the fittest, most aggressive, and one of the strongest Test sides in the world.\n\nHighlights include:\n• India becoming the No. 1 Test team for a record period.\n• Historic Test series wins in Australia (2018–19 and 2020–21).\n• Reaching the World Test Championship finals in 2021 and 2023.\n• Unmatched consistency in all formats, with Kohli breaking record after record.\n\nThis era saw the rise of modern greats like Rohit Sharma, Jasprit Bumrah, Ravindra Jadeja, Hardik Pandya, KL Rahul, and Rishabh Pant."
  },
  {
    title: "6. The Rohit Sharma Era",
    years: "2023–2024",
    description: "Rohit Sharma’s captaincy brought solid stability and dominant cricket. The 2023 ODI World Cup showcased one of the greatest Indian teams ever, with 10 consecutive wins and record-breaking performances by Kohli and Shami. Though India narrowly missed the trophy, the team earned respect worldwide.\n\nIn 2024, India won the T20 World Cup, ending the long ICC trophy drought. Rohit Sharma, Virat Kohli, Jasprit Bumrah, and Hardik Pandya delivered match-winning performances to bring the title home."
  }
];

const TRANSFORMATION_POINTS = [
  "India became the richest and most influential cricket board (BCCI).",
  "IPL became the world’s biggest cricket league.",
  "Cricket infrastructure expanded nationwide.",
  "Small-town players began rising to international levels.",
  "Fitness, technology, and analytics transformed training standards.",
  "Indian cricket turned into a global superpower, shaping the sport’s future."
];

// --- Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={18} /> },
    { label: 'Players', path: '/players', icon: <Users size={18} /> },
    { label: 'History', path: '/history', icon: <BookOpen size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <ScrollToTop />
      <nav className="bg-gradient-to-r from-india-blue to-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-white p-1.5 rounded-full group-hover:rotate-12 transition-transform duration-300">
                <Trophy className="text-india-blue" size={24} fill="currentColor" />
              </div>
              <span className="text-2xl font-bold tracking-tight">LOTUS <span className="text-india-orange">CRICKET</span></span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 transition-all font-medium text-sm tracking-wide"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-900 border-t border-blue-800">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 active:bg-white/10 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {children}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="text-white" size={24} />
            <span className="text-xl font-bold text-white">LOTUS <span className="text-india-orange">CRICKET</span></span>
          </div>
          <p className="mb-6 max-w-md mx-auto">Celebrating the spirit of Indian Cricket. From the gallis to the stadiums, we cover it all.</p>
          <div className="flex justify-center gap-6 mb-8 text-sm font-medium">
             <Link to="/" className="hover:text-white transition-colors">Home</Link>
             <Link to="/players" className="hover:text-white transition-colors">Players</Link>
             <Link to="/history" className="hover:text-white transition-colors">History</Link>
          </div>
          <div className="border-t border-gray-800 pt-6">
            <p>&copy; 2024 Lotus Cricket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Pages ---

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-india-blue via-blue-800 to-indigo-900 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-india-orange/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="relative p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-india-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-india-orange"></span>
              </span>
              T20 World Cup Champions 2024
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Indian Cricket <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-india-orange to-yellow-300">Encyclopedia</span>
            </h1>
            <p className="text-lg text-blue-100/90 leading-relaxed">
              Dive into the glorious history, real-time stats, and legendary tales of the Men in Blue.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <button onClick={() => navigate('/players')} className="px-8 py-3 bg-white text-india-blue rounded-full font-bold hover:bg-gray-100 transition shadow-lg hover:shadow-xl flex items-center gap-2">
                Explore Players <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/history')} className="px-8 py-3 bg-transparent border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition flex items-center gap-2">
                View History
              </button>
            </div>
          </div>
          
          <div className="relative">
             <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-blue-400 to-india-blue flex items-center justify-center shadow-inner border-4 border-white/20 animate-float">
                <Trophy size={120} className="text-white drop-shadow-md" />
             </div>
          </div>
        </div>
      </section>

      <AdPlaceholder size="leaderboard" />

      {/* Featured Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-india-blue">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Player Profiles</h3>
          <p className="text-gray-600 mb-4">Detailed stats and biographies of legends and current stars.</p>
          <Link to="/players" className="text-india-blue font-semibold hover:underline flex items-center gap-1">Browse Players <ChevronRight size={16}/></Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
           <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 text-india-orange">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Cricket History</h3>
          <p className="text-gray-600 mb-4">Relive the iconic moments from 1983 to 2024.</p>
          <Link to="/history" className="text-india-blue font-semibold hover:underline flex items-center gap-1">Read History <ChevronRight size={16}/></Link>
        </div>
      </div>

      {/* Cricket Pulse */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Newspaper className="text-india-blue" /> Cricket Pulse
          </h2>
          <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-1 rounded-full animate-pulse">LIVE UPDATES</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
           {NEWS_DB.map((news) => (
             <div key={news.id} className="flex gap-4 items-start group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
               <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                 <img src={`https://placehold.co/100x100/e2e8f0/64748b?text=News`} alt="News" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900 mb-1 group-hover:text-india-blue transition-colors line-clamp-2">{news.title}</h4>
                 <div className="flex items-center gap-3 text-xs text-gray-500">
                   <span className="font-medium">{news.source}</span>
                   <span>•</span>
                   <span>{news.time}</span>
                 </div>
               </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

const PlayersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const allPlayers = Object.values(PLAYER_DETAILS_DB);
  
  const filteredPlayers = allPlayers.filter(p => {
    return p.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Player Roster</h1>
          <p className="text-gray-500 text-sm">Discover the heroes of Indian Cricket</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search players..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-india-blue/20 focus:border-india-blue transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <AdPlaceholder size="leaderboard" />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <div 
              key={player.name}
              onClick={() => navigate(`/player/${player.name}`)}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1"
            >
              <div className={`h-32 ${player.imageColor} relative flex items-center justify-center overflow-hidden`}>
                 {/* Decorative circles */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                 <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8"></div>
                 
                 <span className="text-5xl font-bold text-white/90 drop-shadow-md">
                   {player.name.charAt(0)}
                 </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-india-blue transition-colors">{player.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{player.role}</p>
                <div className="flex items-center text-xs font-medium text-india-blue bg-blue-50 w-fit px-3 py-1 rounded-full">
                  View Profile <ArrowRight size={12} className="ml-1" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>No players found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PlayerProfile = () => {
  const { name } = useParams<{ name: string }>();
  const player: PlayerDetail = PLAYER_DETAILS_DB[name || ""] || {
    name: name || "Unknown Player",
    role: "Cricketer",
    team: "Unknown",
    imageColor: "bg-gray-400",
    bio: "Player details not found.",
    stats: {
      test: { matches: "-", runs: "-", average: "-", highScore: "-" },
      odi: { matches: "-", runs: "-", average: "-", highScore: "-" },
      t20i: { matches: "-", runs: "-", average: "-", highScore: "-" },
    },
    achievements: []
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'news'>('overview');

  // Helper to safely access stats
  const getStat = (format: 'test' | 'odi' | 't20i', key: keyof PlayerStats) => {
    return player.stats?.[format]?.[key] || '-';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`h-48 ${player.imageColor} relative`}>
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-4">
             <div className={`w-32 h-32 rounded-full border-4 border-white ${player.imageColor} flex items-center justify-center text-5xl font-bold text-white shadow-md`}>
               {player.name.charAt(0)}
             </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{player.name}</h1>
            <p className="text-gray-500 font-medium">{player.role} • {player.team}</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-t border-gray-100">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-4 text-sm font-semibold text-center hover:bg-gray-50 transition-colors border-b-2 ${activeTab === 'overview' ? 'border-india-blue text-india-blue' : 'border-transparent text-gray-500'}`}
          >
            Overview
          </button>
          <button 
             onClick={() => setActiveTab('stats')}
             className={`flex-1 py-4 text-sm font-semibold text-center hover:bg-gray-50 transition-colors border-b-2 ${activeTab === 'stats' ? 'border-india-blue text-india-blue' : 'border-transparent text-gray-500'}`}
          >
            Statistics & Records
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} className="text-india-blue" /> Biography
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {player.bio}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy size={20} className="text-india-orange" /> Key Achievements
                </h2>
                <ul className="space-y-3">
                  {player.achievements && player.achievements.length > 0 ? player.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <Award size={18} className="text-yellow-500 mt-1 flex-shrink-0" />
                      <span>{ach}</span>
                    </li>
                  )) : (
                     <li className="text-gray-400 italic">No achievements listed.</li>
                  )}
                </ul>
              </div>
            </>
          )}

          {activeTab === 'stats' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 size={20} className="text-green-600" /> Career Stats
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Format</th>
                      <th className="px-4 py-3">Matches</th>
                      <th className="px-4 py-3">Runs</th>
                      <th className="px-4 py-3">Average</th>
                      <th className="px-4 py-3 rounded-r-lg">High Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 font-bold text-gray-900">Test</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('test', 'matches')}</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('test', 'runs')}</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('test', 'average')}</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('test', 'highScore')}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 font-bold text-gray-900">ODI</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('odi', 'matches')}</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('odi', 'runs')}</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('odi', 'average')}</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('odi', 'highScore')}</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 font-bold text-gray-900">T20I</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('t20i', 'matches')}</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('t20i', 'runs')}</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('t20i', 'average')}</td>
                      <td className="px-4 py-4 text-gray-600">{getStat('t20i', 'highScore')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Bowling Stats if available */}
              {(getStat('test', 'wickets') !== '-' || getStat('odi', 'wickets') !== '-') && (
                 <div className="mt-8 overflow-x-auto">
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 tracking-wider">Bowling Records</h3>
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">Format</th>
                          <th className="px-4 py-3">Wickets</th>
                          <th className="px-4 py-3 rounded-r-lg">Best Bowling</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {getStat('test', 'wickets') !== '-' && (
                          <tr className="hover:bg-gray-50 transition">
                            <td className="px-4 py-4 font-bold text-gray-900">Test</td>
                            <td className="px-4 py-4 text-gray-600">{getStat('test', 'wickets')}</td>
                            <td className="px-4 py-4 text-gray-600">{getStat('test', 'bestBowling')}</td>
                          </tr>
                        )}
                        {getStat('odi', 'wickets') !== '-' && (
                          <tr className="hover:bg-gray-50 transition">
                            <td className="px-4 py-4 font-bold text-gray-900">ODI</td>
                            <td className="px-4 py-4 text-gray-600">{getStat('odi', 'wickets')}</td>
                            <td className="px-4 py-4 text-gray-600">{getStat('odi', 'bestBowling')}</td>
                          </tr>
                        )}
                        {getStat('t20i', 'wickets') !== '-' && (
                          <tr className="hover:bg-gray-50 transition">
                            <td className="px-4 py-4 font-bold text-gray-900">T20I</td>
                            <td className="px-4 py-4 text-gray-600">{getStat('t20i', 'wickets')}</td>
                            <td className="px-4 py-4 text-gray-600">{getStat('t20i', 'bestBowling')}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <AdPlaceholder size="rectangle" />
        </div>
      </div>
    </div>
  );
};

const HistoryPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">History of Indian Cricket (1983–2024)</h1>
        <p className="text-xl text-india-blue font-semibold">A Saga of Glory</p>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
          The history of Indian cricket from 1983 to 2024 represents one of the most remarkable transformations in world sports. In these four decades, India rose from being considered underdogs to becoming the most influential and powerful cricketing nation globally. This journey is filled with iconic victories, legendary players, historic milestones, controversies, revolutions in leadership, and a new cricketing culture that changed the sport forever.
        </p>
      </div>

      <div className="space-y-12">
        {HISTORY_CONTENT.map((era, index) => (
          <div key={index} className="relative pl-8 md:pl-0">
             {/* Timeline Line */}
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 to-blue-50 md:hidden rounded-full"></div>
             
             <div className="mb-4">
               <span className="inline-block px-4 py-1 bg-india-blue text-white font-bold rounded-full text-sm mb-3 shadow-md">{era.years}</span>
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{era.title}</h2>
             </div>

             <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
               <div className="prose prose-blue max-w-none text-gray-700">
                 {era.description.split('\n').map((paragraph, pIdx) => (
                   paragraph.trim().startsWith('•') 
                    ? <li key={pIdx} className="list-none ml-4 flex items-start gap-2 mb-2">
                        <span className="mt-2 w-1.5 h-1.5 bg-india-orange rounded-full flex-shrink-0"></span>
                        <span>{paragraph.replace('•', '').trim()}</span>
                      </li>
                    : <p key={pIdx} className="mb-4 leading-relaxed">{paragraph}</p>
                 ))}
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* Transformation Section */}
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white p-8 md:p-10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
          <Zap className="text-yellow-400" size={32} /> Indian Cricket’s Transformation <span className="text-blue-300 text-lg font-normal block md:inline mt-1 md:mt-0">(1983–2024)</span>
        </h2>
        
        <p className="text-center text-blue-100 mb-8 max-w-2xl mx-auto">Over these 41 years, Indian cricket witnessed unprecedented growth:</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {TRANSFORMATION_POINTS.map((point, i) => (
             <div key={i} className="bg-white/10 p-6 rounded-2xl border border-white/5 hover:bg-white/20 transition backdrop-blur-sm flex items-start gap-3">
               <div className="mt-1 w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
               <p className="text-sm md:text-base text-gray-100 font-medium leading-snug">{point}</p>
             </div>
           ))}
        </div>
        
        <div className="mt-12 text-center border-t border-white/10 pt-8">
           <h3 className="text-2xl font-bold text-white mb-2">Conclusion</h3>
           <p className="italic text-lg text-blue-200 max-w-3xl mx-auto">
             "From the unforgettable 1983 World Cup win to the triumphant 2024 T20 World Cup glory, Indian cricket’s journey is a story of passion, transformation, leadership, and national pride. Over four decades, India has built a cricket legacy that inspires millions and continues to shape the global cricketing landscape."
           </p>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/player/:name" element={<PlayerProfile />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
