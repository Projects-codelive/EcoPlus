import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { QuizCard } from '@/components/learn/QuizCard';
import { TipsCarousel } from '@/components/learn/TipsCarousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Lightbulb, FileText, Video, Image, Play, ArrowLeft, ExternalLink, X, Clock, Share2 } from 'lucide-react';

// --- REAL DATA WITH CONTENT ---
const videos = [
  { id: 1, title: "Why humans are so bad at thinking about climate change", videoId: "DkZ7BJQupVA", thumbnail: "https://img.youtube.com/vi/DkZ7BJQupVA/maxresdefault.jpg", category: "Psychology", duration: "9:45" },
  { id: 2, title: "The tricky plan to pull CO2 out of the air", videoId: "kfNr2zUDEZc", thumbnail: "https://img.youtube.com/vi/kfNr2zUDEZc/maxresdefault.jpg", category: "Tech", duration: "10:30" },
  { id: 3, title: "How a warmer Arctic could intensify extreme weather", videoId: "yQliow4ghtU", thumbnail: "https://img.youtube.com/vi/yQliow4ghtU/maxresdefault.jpg", category: "Impact", duration: "6:15" },
  { id: 4, title: "Going green shouldn't be this hard", videoId: "BxKfpt70rLI", thumbnail: "https://img.youtube.com/vi/BxKfpt70rLI/maxresdefault.jpg", category: "Lifestyle", duration: "8:20" }
];

const articles = [
  {
    id: 1,
    title: "Fire on Ice: The Arctic's Changing Fire Regime",
    category: "Environment",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    content: "The Arctic is heating up twice as fast as the rest of the planet. This phenomenon, known as Arctic amplification, is causing sea ice to melt at unprecedented rates. \n\nNew research from NASA suggests that 'zombie fires'—fires that smolder underground during the winter—are becoming more common. These fires re-emerge in the spring, releasing vast amounts of carbon stored in the peatlands."
  },
  {
    id: 2,
    title: "Satellites Detect Seasonal Pulses in Earth's Glaciers",
    category: "Science",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?auto=format&fit=crop&w=600&q=80",
    content: "Using advanced satellite imagery, scientists have observed that glaciers 'breathe'—expanding and contracting seasonally. This pulse gives researchers critical data on how ice sheets are responding to global temperature shifts.\n\nThe data, collected over 20 years, shows a clear trend: the contraction periods are getting longer, while the recovery periods are shortening."
  },
  {
    id: 3,
    title: "10 Myths About Climate Change Debunked",
    category: "Education",
    readTime: "5 min",
    image: "https://developmenteducation.ie/wp-content/uploads/2021/02/10-Myths-About-Climate-Change-cover.jpg",
    content: "Myth 1: The climate has changed before.\nFact: While Earth's climate has changed throughout history, the current warming is happening at a rate not seen in the past 10,000 years.\n\nMyth 2: It's the sun.\nFact: The sun's energy output has actually decreased slightly since the 1970s, even as Earth has warmed."
  },
  {
    id: 4,
    title: "Understanding the Greenhouse Effect",
    category: "Explained",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80",
    content: "The greenhouse effect is the way in which heat is trapped close to Earth's surface by 'greenhouse gases.' These heat-trapping gases can be thought of as a blanket wrapped around Earth, keeping the planet toastier than it would be without them.\n\nCarbon dioxide, methane, and nitrous oxide are the primary greenhouse gases. Without them, Earth would be too cold to sustain life as we know it."
  }
];

const infographics = [
  {
    id: 1,
    title: "Global Temperature Anomalies",
    category: "Data",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80",
    description: "This chart illustrates the deviation from the 20th-century average global temperature. Note the steep incline starting in 1980."
  },
  {
    id: 2,
    title: "Sources of Methane Emissions",
    category: "Causes",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80",
    description: "Agriculture accounts for 40% of methane emissions, followed closely by fossil fuel production and waste management."
  },
  {
    id: 3,
    title: "Sea Level Rise: The Data",
    category: "Impact",
    image: "https://images.unsplash.com/photo-1550147760-44c9966d6bc7?auto=format&fit=crop&w=600&q=80",
    description: "Global sea levels have risen by about 8 inches since 1880. By 2100, scientists project another 1 to 4 feet of rise."
  },
  {
    id: 4,
    title: "How Long Does Trash Last?",
    category: "Waste",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
    description: "Plastic bottles: 450 years.\nAluminum cans: 200 years.\nGlass bottles: 1,000,000+ years."
  }
];

const LearnPage = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [selectedInfographic, setSelectedInfographic] = useState<any | null>(null);

  return (
    <AppLayout>
      <div className="p-4 space-y-6 pb-24 w-full max-w-full overflow-x-hidden">
        <div className="pt-2 pb-2">
          <h1 className="text-2xl font-bold text-foreground">Climate Lab</h1>
          <p className="text-muted-foreground">Explore, learn, and take action</p>
        </div>

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-white rounded-2xl p-1 h-auto shadow-sm mb-6">
            <TabsTrigger value="articles" className="rounded-xl py-3 font-semibold data-[state=active]:bg-[#15803D] data-[state=active]:text-white">
              <FileText size={18} strokeWidth={2.5} className="mr-2" /> Articles
            </TabsTrigger>
            <TabsTrigger value="videos" className="rounded-xl py-3 font-semibold data-[state=active]:bg-[#15803D] data-[state=active]:text-white">
              <Video size={18} strokeWidth={2.5} className="mr-2" /> Videos
            </TabsTrigger>
            <TabsTrigger value="infographics" className="rounded-xl py-3 font-semibold data-[state=active]:bg-[#15803D] data-[state=active]:text-white">
              <Image size={18} strokeWidth={2.5} className="mr-2" /> Visuals
            </TabsTrigger>
          </TabsList>

          {/* ARTICLES TAB */}
          <TabsContent value="articles" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((item) => (
                <div key={item.id} onClick={() => setSelectedArticle(item)}>
                  <ContentCard {...item} />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* VIDEOS TAB */}
          <TabsContent value="videos" className="mt-4">
            {activeVideo ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <button onClick={() => setActiveVideo(null)} className="flex items-center text-sm font-bold text-muted-foreground mb-4 hover:text-primary transition-colors">
                  <ArrowLeft size={16} className="mr-1" /> Back to Videos
                </button>
                <div className="relative pt-[56.25%] rounded-3xl overflow-hidden shadow-xl bg-black">
                  <iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`} title="Video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((item) => (
                  <div key={item.id} onClick={() => setActiveVideo(item.videoId)}>
                    <ContentCard title={item.title} category={item.category} readTime={item.duration} image={item.thumbnail} isVideo />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* INFOGRAPHICS TAB */}
          <TabsContent value="infographics" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infographics.map((item) => (
                <div key={item.id} onClick={() => setSelectedInfographic(item)}>
                  <ContentCard title={item.title} category={item.category} readTime="View Data" image={item.image} isInfographic />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* --- ARTICLE READING PANEL (MODAL) --- */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full sm:w-[500px] h-[85vh] sm:h-[80vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
              {/* Modal Header Image */}
              <div className="relative h-48 shrink-0">
                <img src={selectedArticle.image} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedArticle(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 backdrop-blur-md">
                  <X size={20} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#15803D] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    {selectedArticle.category}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-3">{selectedArticle.title}</h2>
                <div className="flex items-center gap-4 text-slate-500 text-sm mb-6 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-1"><Clock size={14} /> {selectedArticle.readTime}</div>
                  <div className="flex items-center gap-1"><Share2 size={14} /> Share</div>
                </div>

                <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedArticle.content}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- INFOGRAPHIC VIEWING PANEL (MODAL) --- */}
        {selectedInfographic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200 p-4">
            <div className="bg-transparent w-full max-w-md flex flex-col items-center">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl mb-4">
                <img src={selectedInfographic.image} className="w-full object-contain bg-white" />
                <button onClick={() => setSelectedInfographic(null)} className="absolute top-3 right-3 bg-black/50 p-2 rounded-full text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl w-full shadow-lg">
                <h3 className="text-lg font-bold text-slate-900">{selectedInfographic.title}</h3>
                <p className="text-slate-600 text-sm mt-2 whitespace-pre-line">{selectedInfographic.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* OTHER SECTIONS */}
        <div className="flex items-center gap-3 mb-2 mt-8">
          <div className="w-10 h-10 rounded-2xl bg-[#FB923C]/20 flex items-center justify-center">
            <BookOpen size={20} strokeWidth={2.5} className="text-[#FB923C]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Daily Quiz</h2>
            <p className="text-sm text-muted-foreground">Earn 50 points</p>
          </div>
        </div>
        <QuizCard />

        <div className="flex items-center gap-3 mb-2 mt-6">
          <div className="w-10 h-10 rounded-2xl bg-[#84CC16]/20 flex items-center justify-center">
            <Lightbulb size={20} strokeWidth={2.5} className="text-[#65A30D]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Did You Know?</h2>
            <p className="text-sm text-muted-foreground">Eco-hacks</p>
          </div>
        </div>
        <TipsCarousel />
      </div>
    </AppLayout>
  );
};

interface ContentCardProps {
  title: string; category: string; readTime: string; image: string; isVideo?: boolean; isInfographic?: boolean;
}

const ContentCard = ({ title, category, readTime, image, isVideo, isInfographic }: ContentCardProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-all group h-full flex flex-col">
      <div className="relative h-32 w-full overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {isVideo && (<div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors"><div className="bg-white/90 p-2 rounded-full shadow-lg backdrop-blur-sm"><Play size={20} className="text-[#15803D] fill-current ml-1" /></div></div>)}
        <div className="absolute top-2 left-2"><span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide backdrop-blur-md shadow-sm ${isVideo ? 'bg-white/95 text-[#FB923C]' : isInfographic ? 'bg-white/95 text-[#65A30D]' : 'bg-white/95 text-[#15803D]'}`}>{category}</span></div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-2">{title}</h3>
        <div className="mt-auto flex items-center gap-2 text-slate-400">
          {isVideo && <Video size={14} strokeWidth={2.5} />}
          {isInfographic && <Image size={14} strokeWidth={2.5} />}
          {!isVideo && !isInfographic && <FileText size={14} strokeWidth={2.5} />}
          <span className="text-xs font-medium">{readTime}</span>
          {!isVideo && (<ExternalLink size={12} className="ml-auto opacity-50" />)}
        </div>
      </div>
    </div>
  );
};

export default LearnPage;