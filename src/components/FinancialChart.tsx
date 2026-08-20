import React, { useState, useEffect, useRef } from 'react';

interface FinancialChartProps {
  symbol: string;
  currentPrice: number;
  changePercent: number;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ symbol, currentPrice, changePercent }) => {
  const [timeframe, setTimeframe] = useState<'1M' | '5M' | '15M' | '1H' | '1D'>('15M');
  const [chartType, setChartType] = useState<'candlestick' | 'area'>('candlestick');
  const [showVwap, setShowVwap] = useState(true);
  const [showEma, setShowEma] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<{ price: number; time: string; x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate deterministic mock candlestick data for testing chart rendering
  const generateData = () => {
    const data = [];
    let price = currentPrice * 0.96;
    const pointsCount = timeframe === '1M' ? 30 : timeframe === '5M' ? 40 : 50;

    for (let i = 0; i < pointsCount; i++) {
      const volatility = currentPrice * 0.008;
      const open = price;
      const change = (Math.random() - 0.48) * volatility * 2;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility;
      const low = Math.min(open, close) - Math.random() * volatility;
      const volume = Math.floor(Math.random() * 50000) + 10000;

      const date = new Date(Date.now() - (pointsCount - i) * (timeframe === '1D' ? 86400000 : 900000));
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      data.push({ open, high, low, close, volume, time: timeStr });
      price = close;
    }
    return data;
  };

  const [chartData, setChartData] = useState(generateData());

  useEffect(() => {
    setChartData(generateData());
  }, [timeframe, symbol]);

  // Render HTML5 Canvas Candlestick & Area Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI retina displays
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 600;
    const height = 280;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    if (chartData.length === 0) return;

    const minPrice = Math.min(...chartData.map(d => d.low)) * 0.998;
    const maxPrice = Math.max(...chartData.map(d => d.high)) * 1.002;
    const priceRange = maxPrice - minPrice || 1;

    const paddingLeft = 10;
    const paddingRight = 55;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const getY = (val: number) => paddingTop + chartHeight - ((val - minPrice) / priceRange) * chartHeight;
    const getX = (idx: number) => paddingLeft + (idx / (chartData.length - 1)) * chartWidth;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = paddingTop + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      const priceVal = maxPrice - (priceRange / 4) * i;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`₹${priceVal.toFixed(1)}`, width - paddingRight + 6, y + 3);
    }

    // Volume Bars (bottom 25% of chart)
    const maxVol = Math.max(...chartData.map(d => d.volume));
    chartData.forEach((d, i) => {
      const x = getX(i);
      const volHeight = (d.volume / maxVol) * (chartHeight * 0.25);
      const isBull = d.close >= d.open;

      ctx.fillStyle = isBull ? 'rgba(5, 150, 105, 0.25)' : 'rgba(220, 38, 38, 0.25)';
      const barWidth = Math.max(2, (chartWidth / chartData.length) * 0.6);
      ctx.fillRect(x - barWidth / 2, paddingTop + chartHeight - volHeight, barWidth, volHeight);
    });

    if (chartType === 'candlestick') {
      // Draw Candlesticks
      chartData.forEach((d, i) => {
        const x = getX(i);
        const yOpen = getY(d.open);
        const yClose = getY(d.close);
        const yHigh = getY(d.high);
        const yLow = getY(d.low);

        const isBull = d.close >= d.open;
        const color = isBull ? '#00E676' : '#FF3B30';

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
        const candleWidth = Math.max(3, (chartWidth / chartData.length) * 0.65);

        ctx.fillStyle = color;
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      });
    } else {
      // Area Gradient Chart
      const isOverallUp = changePercent >= 0;
      const lineColor = isOverallUp ? '#00E676' : '#FF3B30';

      ctx.beginPath();
      chartData.forEach((d, i) => {
        const x = getX(i);
        const y = getY(d.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Gradient Fill
      ctx.lineTo(width - paddingRight, paddingTop + chartHeight);
      ctx.lineTo(paddingLeft, paddingTop + chartHeight);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartHeight);
      if (isOverallUp) {
        gradient.addColorStop(0, 'rgba(0, 230, 118, 0.35)');
        gradient.addColorStop(1, 'rgba(0, 230, 118, 0.0)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 59, 48, 0.35)');
        gradient.addColorStop(1, 'rgba(255, 59, 48, 0.0)');
      }
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Indicator: EMA 20 line (Cyan)
    if (showEma && chartData.length > 5) {
      ctx.beginPath();
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 1.5;
      chartData.forEach((d, i) => {
        const x = getX(i);
        const avg = chartData.slice(Math.max(0, i - 10), i + 1).reduce((s, val) => s + val.close, 0) / Math.min(i + 1, 11);
        const y = getY(avg);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Indicator: VWAP line (Amber)
    if (showVwap && chartData.length > 5) {
      ctx.beginPath();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      let cumVol = 0;
      let cumPV = 0;
      chartData.forEach((d, i) => {
        const x = getX(i);
        const typical = (d.high + d.low + d.close) / 3;
        cumPV += typical * d.volume;
        cumVol += d.volume;
        const vwap = cumPV / cumVol;
        const y = getY(vwap);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [chartData, chartType, showVwap, showEma, changePercent]);

  return (
    <div className="space-y-3 font-sans">
      
      {/* Control Bar: Timeframe & Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
        
        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1">
          {(['1M', '5M', '15M', '1H', '1D'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                timeframe === tf
                  ? 'bg-[#059669] text-white dark:bg-[#00E676] dark:text-[#070a11] shadow-sm'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Style & Indicators */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setChartType(prev => prev === 'candlestick' ? 'area' : 'candlestick')}
            className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-gray-200 font-semibold hover:bg-slate-300 dark:hover:bg-white/20 transition-colors text-[11px]"
          >
            {chartType === 'candlestick' ? '🕯️ Candlesticks' : '📈 Line Area'}
          </button>

          <button
            onClick={() => setShowVwap(!showVwap)}
            className={`px-2 py-1 rounded-lg font-mono text-[11px] font-bold border transition-colors ${
              showVwap 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-500 dark:text-amber-400'
                : 'border-slate-300 dark:border-white/10 text-gray-400'
            }`}
          >
            VWAP
          </button>

          <button
            onClick={() => setShowEma(!showEma)}
            className={`px-2 py-1 rounded-lg font-mono text-[11px] font-bold border transition-colors ${
              showEma 
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-600 dark:text-cyan-400'
                : 'border-slate-300 dark:border-white/10 text-gray-400'
            }`}
          >
            EMA(20)
          </button>

        </div>

      </div>

      {/* HTML5 Canvas Container */}
      <div className="relative w-full rounded-2xl bg-slate-50 dark:bg-[#080d17] border border-slate-200 dark:border-white/10 p-2 overflow-hidden shadow-inner">
        <canvas ref={canvasRef} className="w-full h-[280px] block cursor-crosshair" />

        {/* Live Legend Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-3 font-mono text-[11px] bg-white/80 dark:bg-[#0e1524]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="font-extrabold text-slate-900 dark:text-white">${symbol}</span>
          <span className="text-gray-500 dark:text-gray-400">TF: {timeframe}</span>
          {showVwap && <span className="text-amber-500 font-bold">• VWAP</span>}
          {showEma && <span className="text-cyan-500 font-bold">• EMA20</span>}
        </div>
      </div>

    </div>
  );
};
