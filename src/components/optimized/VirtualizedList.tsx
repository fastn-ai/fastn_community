// Virtualized list component for performance with large datasets
import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { cn } from '@/lib/utils';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (props: { index: number; style: React.CSSProperties; item: T }) => React.ReactNode;
  className?: string;
  overscanCount?: number;
  onScroll?: (scrollTop: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

function VirtualizedListComponent<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className,
  overscanCount = 5,
  onScroll,
  loading = false,
  emptyMessage = 'No items to display',
}: VirtualizedListProps<T>) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout>();

  const handleScroll = useCallback(({ scrollTop }: { scrollTop: number }) => {
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    onScroll?.(scrollTop);
  }, [onScroll]);

  const itemData = useMemo(() => ({
    items,
    renderItem,
    isScrolling,
  }), [items, renderItem, isScrolling]);

  const ItemRenderer = useCallback(({ index, style, data }: any) => {
    const { items, renderItem, isScrolling } = data;
    const item = items[index];
    
    return renderItem({ 
      index, 
      style: {
        ...style,
        // Add smooth transitions when not scrolling for better UX
        transition: isScrolling ? 'none' : 'all 0.2s ease-in-out',
      }, 
      item 
    });
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn('flex items-center justify-center text-gray-500', className)} style={{ height }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <List
      className={cn('scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100', className)}
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      itemData={itemData}
      overscanCount={overscanCount}
      onScroll={handleScroll}
    >
      {ItemRenderer}
    </List>
  );
}

const VirtualizedList = memo(VirtualizedListComponent) as <T>(
  props: VirtualizedListProps<T>
) => React.ReactElement;

VirtualizedList.displayName = 'VirtualizedList';

export default VirtualizedList;

