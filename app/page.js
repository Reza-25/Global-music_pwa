"use client"
import { useState, useEffect } from 'react'
import { Radar, Bar, Scatter, Line } from 'react-chartjs-2' // <-- Line ditambahkan
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement
} from 'chart.js'
import { createClient } from '@supabase/supabase-js'

// --- KONEKSI SUPABASE ---
const supabaseUrl = 'https://osaoqduizudyedpxeiwq.supabase.co'
const supabaseAnonKey = 'sb_publishable_72wtaaZe1rSYWWFOAn7s1w_UH-ipzY8'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function Dashboard() {
  const [country, setCountry] = useState('United States') // Default ganti ke US biar langsung keren
  const [vibeData, setVibeData] = useState(null)
  const [artistData, setArtistData] = useState([])
  const [topSongs, setTopSongs] = useState([])
  const [scatterData, setScatterData] = useState([])
  const [trendData, setTrendData] = useState([]) // <-- State baru untuk Trend
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [country])

  async function fetchData() {
    setLoading(true)
    
    // Fetch Data
    const { data: vibe } = await supabase.from('vibe_summary').select('*').eq('Nationality', country).single()
    const { data: artists } = await supabase.from('artist_summary').select('*').eq('Nationality', country).order('Total_Points', { ascending: false }).limit(10)
    const { data: songs } = await supabase.from('top_songs_summary').select('*').eq('Nationality', country)
    const { data: scatter } = await supabase.from('scatter_summary').select('*').eq('Nationality', country)
    
    // Fetch Trend Data
    const { data: trend } = await supabase.from('trend_summary').select('*').eq('Nationality', country)

    setVibeData(vibe)
    setArtistData(artists || [])
    setTopSongs(songs || [])
    setScatterData(scatter || [])
    setTrendData(trend || [])
    setLoading(false)
  }

  // Konfigurasi Scatter Plot
  const scatterChartData = {
    datasets: [{
      label: 'Lagu',
      data: scatterData.map(song => ({ x: song.Valence, y: song.Energy, title: song.Title, artist: song.Artists })),
      backgroundColor: 'rgba(6, 182, 212, 0.8)', borderColor: '#06b6d4', pointRadius: 6, pointHoverRadius: 9,
    }]
  }

  // Konfigurasi Line Chart (Trend)
  const lineChartData = {
    labels: trendData.map(d => d.Time_Period), // Sumbu X: 2023-01, 2023-02, dll.
    datasets: [{
      label: 'Total Poin',
      data: trendData.map(d => d.Total_Points_Month),
      borderColor: '#06b6d4', // Cyan elegan
      backgroundColor: 'rgba(6, 182, 212, 0.1)', // Efek bayangan di bawah garis
      fill: true,
      tension: 0.4, // Membuat garisnya melengkung halus (tidak kaku)
      pointBackgroundColor: '#0a0a0a',
      pointBorderColor: '#06b6d4',
      pointHoverBackgroundColor: '#06b6d4',
      pointBorderWidth: 2,
    }]
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 p-6 md:p-10 font-sans">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Global Music <span className="text-cyan-500">Pulse</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Real-time Music Analytics & Vibe Tracking</p>
        </div>
        <div className="mt-6 md:mt-0 bg-[#141414] p-1.5 rounded-lg border border-gray-800 shadow-xl">
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-transparent text-cyan-400 font-semibold px-4 py-2 outline-none cursor-pointer text-sm">
            <option value="Indonesia">🇮🇩 Indonesia</option>
            <option value="Japan">🇯🇵 Japan</option>
            <option value="South Korea">🇰🇷 South Korea</option>
            <option value="United States">🇺🇸 United States</option>
            <option value="United Kingdom">🇬🇧 United Kingdom</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div></div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* BARIS 1 & 2 (Tetap Sama) */}
          <div className="bg-[#141414] p-6 rounded-xl border border-gray-800/60 shadow-2xl">
            <h2 className="text-lg font-semibold mb-6 text-white tracking-wide">Audio Characteristics (Vibe)</h2>
            <div className="h-72 flex justify-center">{vibeData && <Radar data={{ labels: ['Danceability', 'Energy', 'Valence', 'Acousticness'], datasets: [{ label: `Score ${country}`, data: [vibeData.Avg_Danceability, vibeData.Avg_Energy, vibeData.Avg_Valence, vibeData.Avg_Acousticness], backgroundColor: 'rgba(6, 182, 212, 0.15)', borderColor: '#06b6d4', pointBackgroundColor: '#06b6d4', pointBorderColor: '#fff', borderWidth: 1.5 }]}} options={{ scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#9ca3af', font: { size: 12 } }, ticks: { display: false } } }, plugins: { legend: { display: false } }, maintainAspectRatio: false }} />}</div>
          </div>

          <div className="bg-[#141414] p-6 rounded-xl border border-gray-800/60 shadow-2xl">
            <h2 className="text-lg font-semibold mb-6 text-white tracking-wide">Top 10 Artists (Total Points)</h2>
            <div className="h-72">{artistData.length > 0 && <Bar data={{ labels: artistData.map(a => a['Artist (Ind.)'] || a.Artist), datasets: [{ label: 'Total Points', data: artistData.map(a => a.Total_Points), backgroundColor: '#3b82f6', borderRadius: 4, barThickness: 16 }]}} options={{ indexAxis: 'y', scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280' } }, y: { grid: { display: false }, ticks: { color: '#d1d5db', font: { size: 11 } } } }, plugins: { legend: { display: false } }, maintainAspectRatio: false }} />}</div>
          </div>

          <div className="bg-[#141414] p-6 rounded-xl border border-gray-800/60 shadow-2xl flex flex-col">
            <h2 className="text-lg font-semibold mb-2 text-white tracking-wide">The Emotional Landscape</h2>
            <p className="text-xs text-gray-500 mb-6">Arahkan kursor ke titik untuk melihat judul lagu.</p>
            <div className="h-72 flex-grow">{scatterData.length > 0 && <Scatter data={scatterChartData} options={{ scales: { x: { title: { display: true, text: 'Valence (Sedih ➔ Bahagia)', color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280' }, min: 0, max: 1 }, y: { title: { display: true, text: 'Energy (Lambat ➔ Keras)', color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280' }, min: 0, max: 1 } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.raw.title} - ${ctx.raw.artist}` } } }, maintainAspectRatio: false }} />}</div>
          </div>

          <div className="bg-[#141414] p-6 rounded-xl border border-gray-800/60 shadow-2xl overflow-y-auto" style={{ maxHeight: '420px' }}>
            <h2 className="text-lg font-semibold mb-4 text-white tracking-wide">Top 3 Tracks Leaderboard</h2>
            <div className="space-y-4">{topSongs.map((song, index) => (<div key={index} className="flex items-center gap-4 bg-[#0a0a0a] p-3 rounded-lg border border-gray-800"><div className={`text-2xl font-black w-8 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-amber-600'}`}>#{index + 1}</div><div className="flex-grow"><iframe style={{ borderRadius: '12px' }} src={`https://open.spotify.com/embed/track/${song.id}?theme=0`} width="100%" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div></div>))}</div>
          </div>

          {/* BARIS 3: LINE CHART TREND (MEMANJANG PENUH) */}
          <div className="bg-[#141414] p-6 rounded-xl border border-gray-800/60 shadow-2xl lg:col-span-2">
            <h2 className="text-lg font-semibold mb-2 text-white tracking-wide">Music Consumption Trend Over Time</h2>
            <p className="text-xs text-gray-500 mb-6">Total akumulasi poin pemutaran musik per bulan berdasarkan region.</p>
            <div className="h-80">
              {trendData.length > 0 && (
                <Line 
                  data={lineChartData} 
                  options={{
                    scales: {
                      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
                      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } }
                    },
                    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
                    maintainAspectRatio: false,
                    interaction: { mode: 'nearest', axis: 'x', intersect: false }
                  }} 
                />
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}