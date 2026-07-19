import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Linkedin, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useArchViz, type TaskStatus, type ArchVizTask } from '@/hooks/useArchViz';
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
          <button onClick={() => setIsEditing(true)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-muted-foreground hover:text-white transition-colors">
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
          <button onClick={handleSave} className="p-2 bg-calmGreen/20 text-calmGreen rounded-md hover:bg-calmGreen/30 transition-colors">
            <Check className="w-5 h-5" />
          </button>
          <button onClick={() => {setIsEditing(false); setEditValue(value.toString());}} className="p-2 bg-white/5 text-muted-foreground rounded-md hover:bg-white/10 transition-colors">
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
function DraggableTask({ task }: { task: ArchVizTask }) {
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

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card className="glass-card p-4 hover:border-white/20 transition-colors cursor-grab active:cursor-grabbing group">
        <p className="text-sm font-medium leading-relaxed select-none">{task.title}</p>
      </Card>
    </div>
  );
}

// Droppable Column
function DroppableColumn({ status, tasks, onAddTask }: { status: TaskStatus, tasks: ArchVizTask[], onAddTask: () => void }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="w-80 shrink-0 flex flex-col snap-center">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{status}</h3>
        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      
      <div 
        ref={setNodeRef} 
        className={`flex-1 space-y-3 min-h-[150px] p-2 -mx-2 rounded-xl transition-colors ${isOver ? 'bg-white/5' : ''}`}
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
              <DraggableTask task={task} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        <button onClick={onAddTask} className="w-full py-3 border border-dashed border-white/10 rounded-xl text-sm text-muted-foreground hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 mt-4">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
    </div>
  );
}

export default function ArchViz() {
  const { metrics, loading, updateMetrics, saveTasks } = useArchViz();
  const [localTasks, setLocalTasks] = useState<ArchVizTask[]>([]);

  useEffect(() => {
    if (metrics.tasks) {
      setLocalTasks(metrics.tasks);
    }
  }, [metrics.tasks]);

  const handleAddTask = (status: TaskStatus = 'Ideas') => {
    const title = window.prompt('Enter task title:');
    if (title && title.trim()) {
      const newTasks = [...localTasks, { id: crypto.randomUUID(), title: title.trim(), status }];
      setLocalTasks(newTasks);
      saveTasks(newTasks);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      
      // Update local optimistically
      const updatedTasks = localTasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      setLocalTasks(updatedTasks);
      saveTasks(updatedTasks);
    }
  };

  return (
    <div className="h-full flex flex-col pb-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-foreground mb-1 tracking-tight">ArchViz</h1>
          <p className="text-muted-foreground text-sm tracking-wide">Startup Management & Feature Pipeline</p>
        </div>
        <Button onClick={() => handleAddTask('Ideas')} className="bg-white text-black hover:bg-white/90 rounded-lg">
          <Plus className="w-4 h-4 mr-2" /> New Task
        </Button>
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

      <div className="w-full h-px bg-white/5 my-4" />

      {/* Kanban Board with Drag and Drop */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
          {COLUMNS.map((col) => (
            <DroppableColumn 
              key={col} 
              status={col} 
              tasks={localTasks.filter(t => t.status === col)} 
              onAddTask={() => handleAddTask(col)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
