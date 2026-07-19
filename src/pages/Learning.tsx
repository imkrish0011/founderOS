import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, Trophy, Target, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCurriculum } from '@/hooks/useCurriculum';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { VIDEO_MAPPING, type VideoResource } from '@/data/videoMap';

export default function Learning() {
  const { phases, progress, loading, toggleTopic, toggleProject } = useCurriculum();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground animate-pulse">Loading Curriculum...</p>
      </div>
    );
  }

  // Calculate Progress
  let totalTopics = 0;
  phases.forEach(p => {
    p.modules?.forEach((m: any) => {
      totalTopics += (m.topics?.length || 0);
    });
  });
  
  const completedTopics = progress.completedTopics.length;
  const remainingTopics = totalTopics - completedTopics;
  
  const chartData = [
    { name: 'Completed', value: completedTopics, color: 'hsl(var(--primary))' },
    { name: 'Remaining', value: remainingTopics, color: 'hsl(var(--muted))' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-1 tracking-tight">Learning Path</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Structured Curriculum & Progress</p>
        </div>
        
        {/* Progress Chart Widget */}
        <Card className="glass-card flex items-center p-4 pr-6 shrink-0 gap-4">
          <div className="w-20 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={25}
                  outerRadius={35}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="text-2xl font-light">{Math.round((completedTopics / Math.max(1, totalTopics)) * 100)}%</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Completion</div>
          </div>
        </Card>
      </div>

      <div className="w-full h-px bg-border my-8" />

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {phases.map((phase, phaseIndex) => {
          return (
            <div key={phase.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Timeline Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-charcoal-950 bg-charcoal-900 text-muted-foreground group-[.is-active]:bg-white/10 group-[.is-active]:text-white shadow-[0_0_0_4px_rgba(20,20,20,1)] z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <BookOpen className="w-4 h-4" />
              </div>

              {/* Content Card */}
              <Card className={`glass-card w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 md:p-8 hover:border-white/20 transition-all duration-300`}>
                <div className="flex flex-col gap-4">
                  
                  {/* Header */}
                  <div>
                    <h3 className="text-2xl font-light mb-2">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{phase.goal}</p>
                  </div>

                  {/* Meta (Duration & Difficulty) */}
                  <div className="flex flex-wrap gap-3 mt-2">
                    {phase.duration && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-xs text-muted-foreground border border-white/5">
                        <Clock className="w-3.5 h-3.5" />
                        {phase.duration}
                      </span>
                    )}
                    {phase.difficulty && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-xs text-muted-foreground border border-white/5">
                        <Zap className="w-3.5 h-3.5 text-calmBlue" />
                        Difficulty: {phase.difficulty.replace(/⭐/g, '★').replace(/☆/g, '☆')}
                      </span>
                    )}
                  </div>

                  <div className="w-full h-px bg-border my-4" />

                  {/* Modules & Topics */}
                  {phase.modules?.length > 0 && (
                    <div className="space-y-6">
                      {phase.modules.map((mod: any, mIdx: number) => {
                        const modVideoKey = Object.keys(VIDEO_MAPPING).find(key => 
                          mod.title && mod.title.toLowerCase().includes(key)
                        );
                        
                        return (
                        <div key={mIdx} className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium uppercase tracking-widest text-foreground/70 mb-3 flex items-center gap-2">
                              <Target className="w-3.5 h-3.5" />
                              {mod.title}
                            </h4>
                            
                            {/* Module-level Video Rendering */}
                            {modVideoKey && VIDEO_MAPPING[modVideoKey] && (
                              <div className="mb-4 space-y-4 max-w-lg">
                                {VIDEO_MAPPING[modVideoKey].map((resource: VideoResource, rIdx: number) => (
                                  <div key={rIdx} className="overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
                                    {resource.type === 'doc' ? (
                                      <a 
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 hover:bg-muted/80 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="flex items-center gap-2 text-primary font-medium">
                                          <BookOpen className="w-4 h-4" />
                                          {resource.title}
                                          <span className="text-xs text-muted-foreground ml-auto">External Link</span>
                                        </div>
                                      </a>
                                    ) : (
                                      <>
                                        <div className="p-3 border-b border-border bg-card/50 flex justify-between items-center">
                                          <h5 className="text-sm font-medium text-foreground">{resource.title}</h5>
                                          {resource.type === 'playlist' && (
                                            <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full uppercase tracking-wider font-semibold">Playlist</span>
                                          )}
                                        </div>
                                        <div className="aspect-video w-full bg-black/50">
                                          <iframe 
                                            width="100%" 
                                            height="100%" 
                                            src={resource.url} 
                                            title={resource.title}
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                          />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2 pl-5 border-l border-border">
                            {mod.topics?.map((topic: any, tIdx: number) => {
                              const topicId = `${phase.id}_${mIdx}_${tIdx}`;
                              const isCompleted = progress.completedTopics.includes(topicId);
                              
                              // Find relevant video strictly based on topic title
                              const topicVideoKey = Object.keys(VIDEO_MAPPING).find(key => 
                                topic.title.toLowerCase() === key || topic.title.toLowerCase().includes(key)
                              );
                              
                              // If this topic matches the module video exactly, don't duplicate it
                              const showTopicVideo = topicVideoKey && topicVideoKey !== modVideoKey;
                              
                              return (
                                <div key={tIdx} className="group/topic">
                                  <button 
                                    onClick={() => toggleTopic(topicId)}
                                    className="flex items-start gap-3 w-full text-left hover:bg-muted/50 p-2 rounded-lg transition-colors"
                                  >
                                    <div className="mt-0.5 shrink-0">
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-muted-foreground group-hover/topic:text-foreground transition-colors" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <span className={`text-sm ${isCompleted ? 'text-muted-foreground line-through opacity-50' : 'text-foreground'}`}>
                                        {topic.title}
                                      </span>
                                      {!isCompleted && topic.learn?.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                          {topic.learn.map((l: string, i: number) => (
                                            <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                                              <div className="w-1 h-1 rounded-full bg-border" />
                                              {l}
                                            </li>
                                          ))}
                                        </ul>
                                      )}

                                      {/* Topic-specific Video Rendering */}
                                      {!isCompleted && showTopicVideo && topicVideoKey && VIDEO_MAPPING[topicVideoKey] && (
                                        <div className="mt-4 mb-2 space-y-4">
                                          {VIDEO_MAPPING[topicVideoKey].map((resource: VideoResource, rIdx: number) => (
                                            <div key={rIdx} className="overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
                                              {resource.type === 'doc' ? (
                                                <a 
                                                  href={resource.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="block p-4 hover:bg-muted/80 transition-colors"
                                                  onClick={(e) => e.stopPropagation()}
                                                >
                                                  <div className="flex items-center gap-2 text-primary font-medium">
                                                    <BookOpen className="w-4 h-4" />
                                                    {resource.title}
                                                    <span className="text-xs text-muted-foreground ml-auto">External Link</span>
                                                  </div>
                                                </a>
                                              ) : (
                                                <>
                                                  <div className="p-3 border-b border-border bg-card/50 flex justify-between items-center">
                                                    <h5 className="text-sm font-medium text-foreground">{resource.title}</h5>
                                                    {resource.type === 'playlist' && (
                                                      <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full uppercase tracking-wider font-semibold">Playlist</span>
                                                    )}
                                                  </div>
                                                  <div className="aspect-video w-full bg-black/50">
                                                    <iframe 
                                                      width="100%" 
                                                      height="100%" 
                                                      src={resource.url} 
                                                      title={resource.title}
                                                      frameBorder="0" 
                                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                      allowFullScreen
                                                    />
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )})}
                    </div>
                  )}

                  {/* Projects */}
                  {phase.projects?.length > 0 && (
                    <>
                      <div className="w-full h-px bg-border my-4" />
                      <div>
                        <h4 className="text-sm font-medium uppercase tracking-widest text-foreground/70 mb-3 flex items-center gap-2">
                          <Trophy className="w-3.5 h-3.5" />
                          Mini Projects
                        </h4>
                        <div className="space-y-2">
                          {phase.projects.map((project: string, pIdx: number) => {
                            const projectId = `${phase.id}_proj_${pIdx}`;
                            const isCompleted = progress.completedProjects.includes(projectId);
                            return (
                              <button 
                                key={pIdx}
                                onClick={() => toggleProject(projectId)}
                                className="flex items-center gap-3 w-full text-left bg-muted/30 hover:bg-muted p-3 rounded-lg transition-colors border border-border"
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                ) : (
                                  <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                                )}
                                <span className={`text-sm font-medium ${isCompleted ? 'text-muted-foreground line-through opacity-50' : 'text-foreground'}`}>
                                  {project}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
