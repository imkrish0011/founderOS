import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useJournal } from '@/hooks/useJournal';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export default function Journal() {
  const { entry, saveEntry, loading, saving, today } = useJournal();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your daily reflection... (Type / for commands)',
      }),
    ],
    content: entry.content || `
      <h2>1. What did I accomplish today?</h2><p></p>
      <h2>2. What did I learn today?</h2><p></p>
      <h2>3. Tomorrow's plan?</h2><p></p>
    `,
    onUpdate: ({ editor }) => {
      // We don't save on every keystroke to Firebase to avoid spam, we rely on the save button
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px]',
      },
    },
  });

  // Re-sync if entry from db changes (e.g. initial load)
  useEffect(() => {
    if (editor && !editor.isFocused && entry.content) {
      editor.commands.setContent(entry.content);
    } else if (editor && !editor.isFocused && !entry.content && !loading) {
       editor.commands.setContent(`
        <h2>1. What did I accomplish today?</h2><p></p>
        <h2>2. What did I learn today?</h2><p></p>
        <h2>3. Tomorrow's plan?</h2><p></p>
      `);
    }
  }, [entry.content, editor, loading]);

  const handleSave = () => {
    if (editor) {
      saveEntry({ content: editor.getHTML() });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 pt-8">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">Daily Reflection</h1>
        <p className="text-muted-foreground text-sm tracking-wide">
          {new Date(today).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className={`glass-card p-6 md:p-10 space-y-8 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div className="bg-background/50 rounded-xl p-4 border border-border">
            <EditorContent editor={editor} />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8 transition-all"
            >
              {saving ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
