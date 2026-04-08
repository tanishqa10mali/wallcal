'use client';

/**
 * NoteCard
 * Individual sticky note with edit, color change, pin, and delete functionality
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pin, Trash2, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { NOTE_COLORS, type Note, type NoteColor } from './types/calendar.types';

interface NoteCardProps {
  note: Note;
  onEdit: (id: string, content: string) => void;
  onChangeColor: (id: string, color: NoteColor) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onAttachDate: (id: string) => void;
  onDetachDate: (id: string) => void;
  index: number;
  compact?: boolean;
}

const colorOptions: NoteColor[] = ['yellow', 'blue', 'green', 'pink', 'white'];

export function NoteCard({
  note,
  onEdit,
  onChangeColor,
  onDelete,
  onTogglePin,
  onAttachDate,
  onDetachDate,
  index,
  compact = false,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSave = useCallback(() => {
    onEdit(note.id, editContent);
    setIsEditing(false);
  }, [note.id, editContent, onEdit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        handleSave();
      }
      if (e.key === 'Escape') {
        setEditContent(note.content);
        setIsEditing(false);
      }
    },
    [handleSave, note.content]
  );

  // Darken the note color for text
  const textColor = note.color === 'white' ? '#44403c' : '#1c1917';
  const bgColor = NOTE_COLORS[note.color];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, rotate: -2 }}
      animate={{ opacity: 1, x: 0, rotate: index % 2 === 0 ? 1 : -1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative group"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        boxShadow: `
          2px 2px 6px rgba(0,0,0,0.1),
          0 0 0 1px rgba(0,0,0,0.05)
        `,
      }}
    >
      {/* Sticky note fold effect */}
      <div
        className="absolute top-0 right-0 w-6 h-6"
        style={{
          background: `linear-gradient(135deg, ${bgColor} 50%, rgba(0,0,0,0.1) 50%)`,
        }}
      />

      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <div className="w-4 h-4 rounded-full bg-red-500 shadow-md" />
        </div>
      )}

      <div className={compact ? 'p-2' : 'p-3 pt-4'}>
        {/* Action buttons */}
        <div className={`flex justify-end gap-1 ${compact ? 'mb-1' : 'mb-2'} opacity-0 group-hover:opacity-100 transition-opacity`}>
          <button
            onClick={() => onTogglePin(note.id)}
            className={`p-1 rounded hover:bg-black/10 ${
              note.isPinned ? 'text-red-600' : ''
            }`}
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1 rounded hover:bg-black/10"
            aria-label="Change color"
          >
            <div className="w-4 h-4 rounded-full border-2 border-current" />
          </button>

          {note.dateRange?.start ? (
            <button
              onClick={() => onDetachDate(note.id)}
              className="p-1 rounded hover:bg-black/10"
              aria-label="Remove date"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onAttachDate(note.id)}
              className="p-1 rounded hover:bg-black/10"
              aria-label="Attach selected date"
            >
              <Calendar className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onDelete(note.id)}
            className="p-1 rounded hover:bg-red-100 text-red-600"
            aria-label="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Color picker */}
        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-1 mb-2 p-1 bg-white/50 rounded"
          >
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChangeColor(note.id, color);
                  setShowColorPicker(false);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  note.color === color ? 'border-gray-700 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: NOTE_COLORS[color] }}
                aria-label={`${color} color`}
              />
            ))}
          </motion.div>
        )}

        {/* Note content */}
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`w-full bg-transparent resize-none focus:outline-none ${compact ? 'min-h-[40px] text-xs' : 'min-h-[80px] text-sm'}`}
            autoFocus
            placeholder="Write your note..."
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className={`cursor-text whitespace-pre-wrap break-words ${compact ? 'min-h-[30px] text-xs' : 'min-h-[60px] text-sm'}`}
          >
            {note.content || (
              <span className="opacity-50 italic">{compact ? 'Click to edit...' : 'Click to add note...'}</span>
            )}
          </div>
        )}

        {/* Date range indicator */}
        {note.dateRange?.start && (
          <div className="mt-2 pt-2 border-t border-black/10 text-xs opacity-70">
            <Calendar className="w-3 h-3 inline mr-1" />
            {format(new Date(note.dateRange.start), 'MMM d')}
            {note.dateRange.end &&
              ` - ${format(new Date(note.dateRange.end), 'MMM d')}`}
          </div>
        )}
      </div>
    </motion.div>
  );
}
