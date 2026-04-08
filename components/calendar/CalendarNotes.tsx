'use client';

/**
 * CalendarNotes
 * Inline notes panel (like reference image - simple lined paper style)
 * Also supports mobile slide-out variant
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, StickyNote, ChevronRight, X } from 'lucide-react';
import { useNotes } from './hooks/useNotes';
import { useCalendarStore } from './hooks/useCalendarStore';
import { NoteCard } from './NoteCard';
import { NOTE_COLORS, type NoteColor } from './types/calendar.types';

const colorOptions: NoteColor[] = ['yellow', 'blue', 'green', 'pink', 'white'];

interface CalendarNotesProps {
  variant?: 'inline' | 'mobile';
}

export function CalendarNotes({ variant = 'inline' }: CalendarNotesProps) {
  const {
    notes,
    isNotesOpen,
    toggleNotesPanel,
    createNote,
    editNoteContent,
    changeNoteColor,
    deleteNote,
    toggleNotePin,
    attachDateRange,
    detachDateRange,
  } = useNotes();

  const { extractedColor, selectedRange } = useCalendarStore();
  const [newNoteColor, setNewNoteColor] = useState<NoteColor>('yellow');
  const [quickNote, setQuickNote] = useState('');

  const handleAddNote = useCallback(() => {
    if (quickNote.trim()) {
      createNote(quickNote, newNoteColor);
      setQuickNote('');
    } else {
      createNote('', newNoteColor);
    }
  }, [createNote, newNoteColor, quickNote]);

  // Inline variant - matches reference image lined paper style
  if (variant === 'inline') {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm text-foreground">Notes</span>
          <span className="text-[10px] text-muted-foreground">({notes.length})</span>
        </div>

        {/* Lined paper style notes area */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto relative"
          style={{
            backgroundImage: `repeating-linear-gradient(
              transparent,
              transparent 23px,
              rgba(0,0,0,0.08) 23px,
              rgba(0,0,0,0.08) 24px
            )`,
            backgroundSize: '100% 24px',
          }}
        >
          {/* Quick add input */}
          <div className="flex items-start gap-1 mb-2">
            <input
              type="text"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              placeholder="Quick note..."
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 py-0.5"
            />
            <div className="flex gap-0.5">
              {colorOptions.slice(0, 3).map((color) => (
                <button
                  key={color}
                  onClick={() => setNewNoteColor(color)}
                  className={`w-3 h-3 rounded-full transition-transform ${
                    newNoteColor === color ? 'scale-125 ring-1 ring-foreground/30' : ''
                  }`}
                  style={{ backgroundColor: NOTE_COLORS[color] }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleAddNote}
            className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded text-white text-xs font-medium mb-3"
            style={{ backgroundColor: extractedColor }}
          >
            <Plus className="w-3 h-3" />
            Add
            {selectedRange.start && <span className="opacity-70">(+dates)</span>}
          </button>

          {/* Notes list */}
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {notes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4 text-muted-foreground"
                >
                  <StickyNote className="w-8 h-8 mx-auto mb-1 opacity-20" />
                  <p className="text-[10px]">No notes yet</p>
                </motion.div>
              ) : (
                notes.map((note, index) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    index={index}
                    onEdit={editNoteContent}
                    onChangeColor={changeNoteColor}
                    onDelete={deleteNote}
                    onTogglePin={toggleNotePin}
                    onAttachDate={attachDateRange}
                    onDetachDate={detachDateRange}
                    compact
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // Mobile variant - slide-out panel
  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleNotesPanel}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg"
        style={{ backgroundColor: extractedColor }}
        aria-label={isNotesOpen ? 'Close notes' : 'Open notes'}
      >
        <StickyNote className="w-5 h-5 text-white" />
        {notes.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-xs font-bold flex items-center justify-center"
            style={{ color: extractedColor }}
          >
            {notes.length}
          </span>
        )}
      </button>

      {/* Slide-out panel */}
      <AnimatePresence>
        {isNotesOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleNotesPanel}
              className="fixed inset-0 bg-black/40 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 w-80 h-full bg-card shadow-xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5" style={{ color: extractedColor }} />
                  <span className="font-semibold">Notes</span>
                  <span className="text-xs text-muted-foreground">({notes.length})</span>
                </div>
                <button
                  onClick={toggleNotesPanel}
                  className="p-1.5 rounded-lg hover:bg-accent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Add note section */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">Color:</span>
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewNoteColor(color)}
                      className={`w-5 h-5 rounded-full border-2 ${
                        newNoteColor === color ? 'border-foreground scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: NOTE_COLORS[color] }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleAddNote}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: extractedColor }}
                >
                  <Plus className="w-4 h-4" />
                  Add Note
                  {selectedRange.start && <span className="text-xs opacity-80">(with dates)</span>}
                </button>
              </div>

              {/* Notes list */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {notes.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <StickyNote className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No notes yet</p>
                      </motion.div>
                    ) : (
                      notes.map((note, index) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          index={index}
                          onEdit={editNoteContent}
                          onChangeColor={changeNoteColor}
                          onDelete={deleteNote}
                          onTogglePin={toggleNotePin}
                          onAttachDate={attachDateRange}
                          onDetachDate={detachDateRange}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
