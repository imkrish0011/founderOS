import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Linkedin, Edit2, Check, X, Calendar, CalendarDays, Kanban, Clock, ChevronDown, ListTodo, AlignLeft, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useArchViz, type TaskStatus, type ArchVizTask, type SubTask, type Priority } from '@/hooks/useArchViz';
import { DndContext, useDroppable, useDraggable, type DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const COLUMNS: TaskStatus[] = ['Ideas', 'Planned', 'Building', 'Completed'];

function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  onSave 
}: { 
  title: string, 
  value: number, 
  icon: any, 
  onSave: (val: number) => void 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || '0');

  const handleSave = () => {
    const num = parseInt(editValue, 10);
    if (!isNaN(num)) {
      onSave(num);
    }
    setIsEditing(false);
  };

  return (
    <Card className="glass-card p-6 flex flex-col justify-center relative group">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="p-1.5 bg-accent/50 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4 text-muted-foreground">
        <Icon className="w-5 h-5" />
        <span className="text-xs uppercase tracking-widest">{title}</span>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)}
            className="h-10 text-xl font-light w-full"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button onClick={handleSave} className="p-2 bg-green-500/20 text-green-500 rounded-md hover:bg-green-500/30 transition-colors">
            <Check className="w-5 h-5" />
          </button>
          <button onClick={() => {setIsEditing(false); setEditValue(value.toString());}} className="p-2 bg-accent text-muted-foreground rounded-md hover:bg-accent/80 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <span className="text-4xl font-light">{value?.toLocaleString() || 0}</span>
      )}
    </Card>
  );
}

// Draggable Task Card
function DraggableTask({ task, onClick }: { task: ArchVizTask, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
    position: isDragging ? 'relative' as const : 'static' as const,
  };

  const priorityColors = {
    High: 'bg-red-500/10 text-red-500 border-red-500/20',
    Med: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Low: 'bg-green-500/10 text-green-500 border-green-500/20',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card 
        className="glass-card p-4 hover:border-border transition-colors cursor-grab active:cursor-grabbing group"
      >
        <div className="flex flex-col gap-3" {...listeners}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-relaxed select-none text-foreground">{task.title}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-accent rounded-md transition-all shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
          
          {(task.priority || task.dueDate || (task.subtasks && task.subtasks.length > 0)) && (
            <div className="flex items-center flex-wrap gap-2 mt-1">
              {task.priority && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              )}
              {task.dueDate && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-accent/50 px-2 py-0.5 rounded-full">
                  <Calendar className="w-3 h-3" />
                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              )}
              {task.subtasks && task.subtasks.length > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-accent/50 px-2 py-0.5 rounded-full">
                  <ListTodo className="w-3 h-3" />
                  {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Droppable Column
function DroppableColumn({ status, tasks, onAddTask, onEditTask }: { status: TaskStatus, tasks: ArchVizTask[], onAddTask: () => void, onEditTask: (t: ArchVizTask) => void }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="w-80 shrink-0 flex flex-col snap-center">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{status}</h3>
        <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef} 
        className={`flex-1 space-y-3 min-h-[150px] p-2 -mx-2 rounded-xl transition-colors ${isOver ? 'bg-muted/20' : ''}`}
      >
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DraggableTask task={task} onClick={() => onEditTask(task)} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        <button onClick={onAddTask} className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-all flex items-center justify-center gap-2 mt-4">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
    </div>
  );
}

export default function ArchViz() {
  const { metrics, updateMetrics, saveTasks } = useArchViz();
  const [localTasks, setLocalTasks] = useState<ArchVizTask[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'calendar'>('kanban');
  const [selectedTask, setSelectedTask] = useState<ArchVizTask | null>(null);

  useEffect(() => {
    if (metrics.tasks) {
      setLocalTasks(metrics.tasks);
    }
  }, [metrics.tasks]);

  const handleAddTask = (status: TaskStatus = 'Ideas') => {
    const newTask: ArchVizTask = { id: crypto.randomUUID(), title: '', status };
    const newTasks = [...localTasks, newTask];
    setLocalTasks(newTasks);
    saveTasks(newTasks);
    setSelectedTask(newTask); // Open modal immediately for editing
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      
      const updatedTasks = localTasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      setLocalTasks(updatedTasks);
      saveTasks(updatedTasks);
    }
  };

  const updateSelectedTask = (updates: Partial<ArchVizTask>) => {
    if (!selectedTask) return;
    const updated = { ...selectedTask, ...updates };
    setSelectedTask(updated);
    const newTasks = localTasks.map(t => t.id === updated.id ? updated : t);
    setLocalTasks(newTasks);
    saveTasks(newTasks);
  };

  const renderCalendar = () => {
    // Simple current month grid
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4 text-foreground">
          {today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground uppercase py-2">{d}</div>
          ))}
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="h-24 bg-muted/10 rounded-lg" />;
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTasks = localTasks.filter(t => t.dueDate === dateStr);
            const isToday = day === today.getDate();

            return (
              <div key={day} className={`h-24 p-2 rounded-lg border ${isToday ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-background'} flex flex-col gap-1 overflow-y-auto`}>
                <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>{day}</span>
                {dayTasks.map(t => (
                  <div key={t.id} onClick={() => setSelectedTask(t)} className="text-[10px] truncate bg-accent text-accent-foreground px-1.5 py-0.5 rounded cursor-pointer hover:bg-accent/80">
                    {t.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col pb-12 space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-1 tracking-tight">ArchViz</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Startup Management & Feature Pipeline</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-muted rounded-lg">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={() => handleAddTask('Ideas')} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
            <Plus className="w-4 h-4 mr-2" /> New Task
          </Button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard 
          title="LinkedIn Followers" 
          value={metrics.linkedInFollowers} 
          icon={Linkedin} 
          onSave={(val) => updateMetrics({ linkedInFollowers: val })} 
        />
        <MetricCard 
          title="Live Users" 
          value={metrics.liveUsers} 
          icon={Users} 
          onSave={(val) => updateMetrics({ liveUsers: val })} 
        />
      </div>

      <div className="w-full h-px bg-border my-4" />

      {viewMode === 'kanban' ? (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
            {COLUMNS.map((col) => (
              <DroppableColumn 
                key={col} 
                status={col} 
                tasks={localTasks.filter(t => t.status === col)} 
                onAddTask={() => handleAddTask(col)}
                onEditTask={setSelectedTask}
              />
            ))}
          </div>
        </DndContext>
      ) : (
        renderCalendar()
      )}

      {/* Task Modal Overlay */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedTask(null)}
                className="absolute top-4 right-4 p-2 bg-muted/50 hover:bg-muted text-muted-foreground rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <input 
                  type="text" 
                  value={selectedTask.title}
                  onChange={e => updateSelectedTask({ title: e.target.value })}
                  className="w-full bg-transparent border-none text-2xl font-semibold text-foreground focus:outline-none focus:ring-0 px-0 placeholder:text-muted-foreground/50"
                  placeholder="Task title..."
                />
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  In list <span className="underline decoration-border underline-offset-4">{selectedTask.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Priority</label>
                  <select 
                    value={selectedTask.priority || ''}
                    onChange={e => updateSelectedTask({ priority: e.target.value as Priority || undefined })}
                    className="w-full bg-muted border border-border rounded-lg text-sm px-3 py-2 text-foreground focus:outline-none"
                  >
                    <option value="">None</option>
                    <option value="High">High 🔴</option>
                    <option value="Med">Medium 🟡</option>
                    <option value="Low">Low 🟢</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Due Date</label>
                  <input 
                    type="date" 
                    value={selectedTask.dueDate || ''}
                    onChange={e => updateSelectedTask({ dueDate: e.target.value || undefined })}
                    className="w-full bg-muted border border-border rounded-lg text-sm px-3 py-2 text-foreground focus:outline-none color-scheme-dark"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5" /> Description</label>
                <textarea 
                  value={selectedTask.description || ''}
                  onChange={e => updateSelectedTask({ description: e.target.value })}
                  placeholder="Add a more detailed description..."
                  className="w-full bg-muted/50 border border-border rounded-lg text-sm px-4 py-3 text-foreground focus:outline-none min-h-[100px] resize-y"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Subtasks</label>
                </div>
                
                {/* Progress bar */}
                {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                  <div className="w-full bg-muted rounded-full h-1.5 mb-4">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${(selectedTask.subtasks.filter(s => s.completed).length / selectedTask.subtasks.length) * 100}%` }} 
                    />
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {(selectedTask.subtasks || []).map((subtask, idx) => (
                    <div key={subtask.id} className="flex items-center gap-3 group/sub">
                      <button 
                        onClick={() => {
                          const newSubs = [...(selectedTask.subtasks || [])];
                          newSubs[idx] = { ...newSubs[idx], completed: !newSubs[idx].completed };
                          updateSelectedTask({ subtasks: newSubs });
                        }}
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 ${subtask.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/50 hover:border-foreground bg-transparent'}`}
                      >
                        {subtask.completed && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <input 
                        type="text" 
                        value={subtask.title}
                        onChange={e => {
                          const newSubs = [...(selectedTask.subtasks || [])];
                          newSubs[idx] = { ...newSubs[idx], title: e.target.value };
                          updateSelectedTask({ subtasks: newSubs });
                        }}
                        className={`flex-1 bg-transparent border-none text-sm focus:outline-none focus:ring-0 px-0 ${subtask.completed ? 'text-muted-foreground line-through opacity-50' : 'text-foreground'}`}
                      />
                      <button 
                        onClick={() => {
                          const newSubs = (selectedTask.subtasks || []).filter((_, i) => i !== idx);
                          updateSelectedTask({ subtasks: newSubs });
                        }}
                        className="opacity-0 group-hover/sub:opacity-100 p-1 hover:bg-muted text-muted-foreground rounded transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-muted/50 border-dashed border-border text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    const newSubs = [...(selectedTask.subtasks || []), { id: crypto.randomUUID(), title: '', completed: false }];
                    updateSelectedTask({ subtasks: newSubs });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Subtask
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
