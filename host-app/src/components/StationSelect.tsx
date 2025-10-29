import React, { useEffect, useRef, useState } from 'react';
import { fetchStations } from '../api';

interface Station {
  name: string;
  code: string;
}

interface Props {
  selected: Station | null;
  onSelect: (s: Station | null) => void;
  placeholder?: string;
}

const StationSelect: React.FC<Props> = ({ selected, onSelect, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<string>(selected ? `${selected.name} (${selected.code})` : '');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Station[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  // keep input in sync if selected changes externally
  useEffect(() => {
    setInput(selected ? `${selected.name} (${selected.code})` : '');
  }, [selected]);

  // debounce input -> query
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current as any);
    debounceRef.current = window.setTimeout(() => {
      setQuery(input);
      setPage(1);
      setHasMore(true);
      setItems([]);
    }, 300);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current as any); };
  }, [input]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!hasMore) return;
      setLoading(true);
      try {
        const res: any = await fetchStations(query, page, 50);
        if (cancelled) return;
        const newItems = Array.isArray(res.items) ? res.items : [];
        setItems((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
        const total = res.total || 0;
        setHasMore((page * 50) < total);
      } catch (err) {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [query, page]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40 && !loading && hasMore) {
      setPage((p) => p + 1);
    }
  };

  const handleSelect = (s: Station) => {
    onSelect(s);
    setInput(`${s.name} (${s.code})`);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <input
        value={input}
        onFocus={() => setOpen(true)}
        onChange={(e) => { setInput(e.target.value); }}
        placeholder={placeholder}
        style={{ width: '100%', padding: '8px' }}
      />

      {open && (
        <div
          onScroll={onScroll}
          style={{
            position: 'absolute',
            zIndex: 40,
            background: 'white',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            width: '100%',
            maxHeight: 220,
            overflowY: 'auto',
            marginTop: 6,
            borderRadius: 6,
          }}
        >
          {items.length === 0 && !loading && <div style={{ padding: 12, color: '#666' }}>No stations</div>}
          {items.map((s, idx) => (
            <div key={idx} onClick={() => handleSelect(s)} style={{ padding: '8px 12px', cursor: 'pointer' }}>
              <div style={{ fontSize: 14 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{s.code}</div>
            </div>
          ))}
          {loading && <div style={{ padding: 12 }}>Loading...</div>}
        </div>
      )}
    </div>
  );
};

export default StationSelect;
