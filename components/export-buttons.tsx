'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

type ExportFormat = 'markdown' | 'csv' | 'notion' | 'schedule';

export function ExportButtons({
  generationId,
  exportAction,
}: {
  generationId: string;
  exportAction: (id: string, format: ExportFormat) => Promise<{ data?: string; error?: string }>;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleExport(format: ExportFormat) {
    setLoading(format);
    try {
      const result = await exportAction(generationId, format);
      if (result.data) {
        const isCsv = format === 'csv' || format === 'schedule';
        const blob = new Blob([result.data], {
          type: isCsv ? 'text/csv' : 'text/markdown',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ext = isCsv ? 'csv' : 'md';
        const name = format === 'schedule' ? 'schedule' : 'repurpose';
        a.download = `${name}-${generationId.slice(0, 8)}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={!!loading}
        onClick={() => handleExport('markdown')}
      >
        {loading === 'markdown' ? '…' : 'Export .md'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!!loading}
        onClick={() => handleExport('notion')}
      >
        {loading === 'notion' ? '…' : 'Notion'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!!loading}
        onClick={() => handleExport('csv')}
      >
        {loading === 'csv' ? '…' : 'Export .csv'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!!loading}
        onClick={() => handleExport('schedule')}
      >
        {loading === 'schedule' ? '…' : 'Export for scheduling'}
      </Button>
    </div>
  );
}
