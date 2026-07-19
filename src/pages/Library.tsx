import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Youtube, FileText, Globe, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLibrary } from '@/hooks/useLibrary';

const ICONS = {
  paper: FileText,
  video: Youtube,
  book: BookOpen,
  article: Globe,
};

export default function Library() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const { resources, loading } = useLibrary();

  // Extract all unique phase tags
  const phaseTags = ['All', ...Array.from(new Set(resources.map(r => r.tags[0]).filter(Boolean)))].sort();

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.author.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || r.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-1 tracking-tight">Resource Library</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Curriculum References</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-border rounded-xl"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {phaseTags.map(filter => (
          <Button 
            key={filter} 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full transition-colors ${
              activeFilter === filter 
                ? 'bg-accent border-border text-accent-foreground' 
                : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted'
            }`}
          >
            {filter}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground animate-pulse">Loading library...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-muted/20">
          <BookOpen className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No resources found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredResources.map((resource: any, index: number) => {
            const Icon = ICONS[resource.type as keyof typeof ICONS] || FileText;
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }} // Cap max delay
              >
                <Card className="glass-card p-5 hover:border-white/20 transition-colors cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">{resource.year}</span>
                      {/* Type Badge */}
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-white/10 rounded text-muted-foreground">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1 leading-snug">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.author}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {resource.tags.map((tag: string) => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 rounded-md text-calmBlue/80 border border-calmBlue/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
