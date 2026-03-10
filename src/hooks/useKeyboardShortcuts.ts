'use client';

import { useEffect } from 'react';

interface KeyboardShortcuts {
  'Cmd+Enter'?: () => void;
  'Ctrl+Enter'?: () => void;
  'Cmd+/'?: () => void;
  'Ctrl+/'?: () => void;
  'Cmd+N'?: () => void;
  'Ctrl+N'?: () => void;
  Escape?: () => void;
  ArrowUp?: () => void;
  ArrowDown?: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const isCmd = isMac ? event.metaKey : event.ctrlKey;

      // Cmd/Ctrl + Enter
      if (isCmd && event.key === 'Enter') {
        event.preventDefault();
        shortcuts['Cmd+Enter']?.();
        return;
      }

      // Cmd/Ctrl + /
      if (isCmd && event.key === '/') {
        event.preventDefault();
        shortcuts['Cmd+/']?.();
        return;
      }

      // Cmd/Ctrl + N
      if (isCmd && event.key === 'n') {
        event.preventDefault();
        shortcuts['Cmd+N']?.();
        return;
      }

      // Escape
      if (event.key === 'Escape') {
        event.preventDefault();
        shortcuts.Escape?.();
        return;
      }

      // Arrow keys
      if (event.key === 'ArrowUp') {
        shortcuts.ArrowUp?.();
      } else if (event.key === 'ArrowDown') {
        shortcuts.ArrowDown?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
