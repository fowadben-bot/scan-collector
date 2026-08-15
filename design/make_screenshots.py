import cairosvg

W, H = 1290, 2796
BG = "#050916"
CARD = "#111A33"
BORDER = "#1F2B4D"
TEXT = "#F5F7FF"
MUTED = "#8B93B8"
BLUE = "#2563FF"
ORANGE = "#F97316"
RED = "#E5342B"

def status_bar():
    return f'''
    <text x="70" y="110" fill="{TEXT}" font-family="Helvetica, Arial" font-size="34" font-weight="700">9:41</text>
    <g transform="translate(1060,72)">
      <rect x="0" y="14" width="8" height="14" rx="2" fill="{TEXT}"/>
      <rect x="12" y="8" width="8" height="20" rx="2" fill="{TEXT}"/>
      <rect x="24" y="2" width="8" height="26" rx="2" fill="{TEXT}"/>
      <rect x="46" y="4" width="46" height="22" rx="6" fill="none" stroke="{TEXT}" stroke-width="3"/>
      <rect x="50" y="8" width="38" height="14" rx="3" fill="{TEXT}"/>
      <rect x="95" y="10" width="4" height="10" fill="{TEXT}"/>
    </g>
    '''

def card_tile(x, y, w, h, kind, title, subtitle):
    if kind == "sport":
        badge_color = ORANGE
        art = f'''
        <circle cx="{x+w/2}" cy="{y+h*0.34}" r="{w*0.28}" fill="#C97A2E"/>
        <path d="M {x+w*0.22} {y+h*0.34} Q {x+w/2} {y+h*0.2} {x+w*0.78} {y+h*0.34}" stroke="#7A4413" stroke-width="6" fill="none"/>
        <path d="M {x+w*0.22} {y+h*0.34} Q {x+w/2} {y+h*0.48} {x+w*0.78} {y+h*0.34}" stroke="#7A4413" stroke-width="6" fill="none"/>
        <line x1="{x+w/2}" y1="{y+h*0.08}" x2="{x+w/2}" y2="{y+h*0.6}" stroke="#7A4413" stroke-width="6"/>
        '''
    else:
        badge_color = BLUE
        art = f'''
        <circle cx="{x+w/2}" cy="{y+h*0.3}" r="{w*0.24}" fill="#F3C9A3"/>
        <path d="M {x+w*0.28} {y+h*0.14} Q {x+w/2} {y+h*0.02} {x+w*0.72} {y+h*0.14} L {x+w*0.7} {y+h*0.32} Q {x+w/2} {y+h*0.4} {x+w*0.3} {y+h*0.32} Z" fill="#2B2140"/>
        <circle cx="{x+w*0.42}" cy="{y+h*0.3}" r="6" fill="#1a1a1a"/>
        <circle cx="{x+w*0.58}" cy="{y+h*0.3}" r="6" fill="#1a1a1a"/>
        '''
    return f'''
    <g>
      <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="24" fill="{CARD}" stroke="{BORDER}" stroke-width="2"/>
      <rect x="{x+14}" y="{y+14}" width="{w-28}" height="{h*0.62}" rx="18" fill="{BG}"/>
      {art}
      <rect x="{x+24}" y="{y+22}" width="{badge_color and 120 or 0}" height="34" rx="14" fill="{badge_color}"/>
      <text x="{x+40}" y="{y+45}" fill="#fff" font-family="Helvetica" font-size="20" font-weight="700">{ 'SPORT' if kind=='sport' else 'MANGA' }</text>
      <text x="{x+24}" y="{y+h*0.62+48}" fill="{TEXT}" font-family="Helvetica" font-size="30" font-weight="700">{title}</text>
      <text x="{x+24}" y="{y+h*0.62+80}" fill="{MUTED}" font-family="Helvetica" font-size="24">{subtitle}</text>
    </g>
    '''

def home_screen():
    tiles = ""
    data = [
        ("sport", "Basketball Star #23", "Prizm Rookie 23"),
        ("manga", "Ninja Orange", "Wave 1 Holo"),
        ("sport", "Attaquant Vedette", "Obsidian Chase"),
        ("manga", "Guerrier Saiyan", "Vintage 1988"),
    ]
    gap = 32
    tile_w = (1090 - gap) / 2
    tile_h = 560
    start_x = 100
    start_y = 700
    for i, (kind, title, sub) in enumerate(data):
        col = i % 2
        row = i // 2
        x = start_x + col * (tile_w + gap)
        y = start_y + row * (tile_h + gap)
        tiles += card_tile(x, y, tile_w, tile_h, kind, title, sub)

    svg = f'''<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="{W}" height="{H}" fill="{BG}"/>
      {status_bar()}
      <text x="100" y="270" fill="{TEXT}" font-family="Helvetica" font-size="72" font-weight="800">Scan Collector</text>
      <text x="100" y="320" fill="{MUTED}" font-family="Helvetica" font-size="34">24 cartes dans ta collection</text>
      <circle cx="1150" cy="270" r="72" fill="{BLUE}"/>
      <g transform="translate(1150,270)" fill="#fff">
        <rect x="-20" y="-14" width="40" height="30" rx="6"/>
        <circle cx="0" cy="0" r="11" fill="{BLUE}"/>
        <rect x="10" y="-22" width="14" height="8" rx="2"/>
      </g>
      <rect x="100" y="400" width="1090" height="92" rx="26" fill="{CARD}" stroke="{BORDER}" stroke-width="2"/>
      <circle cx="160" cy="446" r="9" fill="none" stroke="{MUTED}" stroke-width="4"/>
      <line x1="167" y1="453" x2="180" y2="466" stroke="{MUTED}" stroke-width="4"/>
      <text x="200" y="458" fill="{MUTED}" font-family="Helvetica" font-size="30">Rechercher une carte, un set...</text>
      <g font-family="Helvetica" font-size="26" font-weight="600">
        <rect x="100" y="540" width="140" height="66" rx="33" fill="{BLUE}"/>
        <text x="130" y="581" fill="#fff">Tout</text>
        <rect x="256" y="540" width="180" height="66" rx="33" fill="{CARD}" stroke="{BORDER}" stroke-width="2"/>
        <text x="290" y="581" fill="{MUTED}">Sport</text>
        <rect x="452" y="540" width="190" height="66" rx="33" fill="{CARD}" stroke="{BORDER}" stroke-width="2"/>
        <text x="486" y="581" fill="{MUTED}">Manga</text>
        <rect x="658" y="540" width="180" height="66" rx="33" fill="{CARD}" stroke="{BORDER}" stroke-width="2"/>
        <text x="692" y="581" fill="{MUTED}">Autre</text>
      </g>
      {tiles}
    </svg>'''
    return svg

def scan_screen():
    svg = f'''<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="camgrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1a2340"/>
          <stop offset="1" stop-color="#05070f"/>
        </linearGradient>
      </defs>
      <rect width="{W}" height="{H}" fill="#000"/>
      <rect width="{W}" height="{H}" fill="url(#camgrad)"/>
      {status_bar()}
      <rect x="{(W-1000)/2}" y="820" width="1000" height="1430" rx="36" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="6"/>
      <g stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none">
        <path d="M {(W-1000)/2-20} 800 L {(W-1000)/2-20} 860 M {(W-1000)/2-20} 800 L {(W-1000)/2+40} 800"/>
        <path d="M {(W+1000)/2+20} 800 L {(W+1000)/2+20} 860 M {(W+1000)/2+20} 800 L {(W+1000)/2-40} 800"/>
      </g>
      <text x="{W/2}" y="750" fill="#fff" font-family="Helvetica" font-size="34" text-anchor="middle" opacity="0.9">Cadre ta carte dans la zone</text>
      <g transform="translate({W/2},2500)">
        <circle r="80" fill="none" stroke="#fff" stroke-width="8"/>
        <circle r="62" fill="#fff"/>
      </g>
      <g transform="translate({W/2-320},2500)">
        <circle r="60" fill="rgba(255,255,255,0.15)"/>
        <rect x="-24" y="-20" width="48" height="36" rx="6" fill="#fff"/>
        <circle r="10" fill="rgba(255,255,255,0.15)"/>
      </g>
      <g transform="translate({W/2+320},2500)">
        <circle r="60" fill="rgba(255,255,255,0.15)"/>
        <line x1="-20" y1="-20" x2="20" y2="20" stroke="#fff" stroke-width="8"/>
        <line x1="20" y1="-20" x2="-20" y2="20" stroke="#fff" stroke-width="8"/>
      </g>
    </svg>'''
    return svg

def detail_screen():
    svg = f'''<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="{W}" height="{H}" fill="{BG}"/>
      <rect x="0" y="0" width="{W}" height="1500" fill="{CARD}"/>
      <circle cx="{W*0.5}" cy="600" r="420" fill="#C97A2E" opacity="0.9"/>
      <path d="M {W*0.5-300} 600 Q {W*0.5} 440 {W*0.5+300} 600" stroke="#7A4413" stroke-width="14" fill="none"/>
      <path d="M {W*0.5-300} 600 Q {W*0.5} 760 {W*0.5+300} 600" stroke="#7A4413" stroke-width="14" fill="none"/>
      <line x1="{W*0.5}" y1="180" x2="{W*0.5}" y2="1020" stroke="#7A4413" stroke-width="14"/>
      {status_bar()}
      <circle cx="160" cy="270" r="72" fill="rgba(0,0,0,0.4)"/>
      <path d="M 178 270 L 148 270 M 148 270 L 168 250 M 148 270 L 168 290" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="{W-160}" cy="270" r="72" fill="rgba(0,0,0,0.4)"/>
      <path d="M {W-160} 235 L {W-192} 285 L {W-160} 285 L {W-160} 305 L {W-128} 255 L {W-160} 255 Z" fill="{ORANGE}"/>
      <rect x="100" y="1580" width="240" height="60" rx="16" fill="{ORANGE}"/>
      <text x="130" y="1622" fill="#fff" font-family="Helvetica" font-size="28" font-weight="700">SPORT</text>
      <text x="100" y="1720" fill="{TEXT}" font-family="Helvetica" font-size="64" font-weight="800">Basketball Star #23</text>
      <line x1="100" y1="1840" x2="{W-100}" y2="1840" stroke="{BORDER}" stroke-width="2"/>
      <text x="100" y="1810" fill="{MUTED}" font-family="Helvetica" font-size="30">Set</text>
      <text x="{W-100}" y="1810" fill="{TEXT}" font-family="Helvetica" font-size="30" font-weight="700" text-anchor="end">Prizm Rookie 2023</text>
      <line x1="100" y1="1930" x2="{W-100}" y2="1930" stroke="{BORDER}" stroke-width="2"/>
      <text x="100" y="1900" fill="{MUTED}" font-family="Helvetica" font-size="30">Etat</text>
      <text x="{W-100}" y="1900" fill="{TEXT}" font-family="Helvetica" font-size="30" font-weight="700" text-anchor="end">PSA 9</text>
      <rect x="100" y="2050" width="820" height="130" rx="34" fill="{BLUE}"/>
      <text x="510" y="2128" fill="#fff" font-family="Helvetica" font-size="36" font-weight="700" text-anchor="middle">Modifier</text>
      <rect x="960" y="2050" width="230" height="130" rx="34" fill="none" stroke="{RED}" stroke-width="3"/>
    </svg>'''
    return svg

def detail_header_fix():
    pass

screens = {
    "screenshot_1_home.png": home_screen(),
    "screenshot_2_scan.png": scan_screen(),
    "screenshot_3_detail.png": detail_screen(),
}

import os
os.makedirs("store/screenshots", exist_ok=True)
for name, svg in screens.items():
    cairosvg.svg2png(bytestring=svg.encode(), write_to=f"store/screenshots/{name}", output_width=W, output_height=H)
    print("done", name)

def feature_graphic():
    FW, FH = 1024, 500
    svg = f'''<svg width="{FW}" height="{FH}" viewBox="0 0 {FW} {FH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="{FW}" y2="{FH}" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#050916"/>
          <stop offset="1" stop-color="#0B1224"/>
        </linearGradient>
        <linearGradient id="blueSplat" x1="0" y1="0" x2="300" y2="{FH}" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#3B82F6"/>
          <stop offset="1" stop-color="#1D3FB8"/>
        </linearGradient>
        <linearGradient id="redSplat" x1="{FW}" y1="0" x2="{FW-300}" y2="{FH}" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#FF5B4E"/>
          <stop offset="1" stop-color="#C4231C"/>
        </linearGradient>
      </defs>
      <rect width="{FW}" height="{FH}" fill="url(#bg)"/>
      <polygon points="0,0 260,0 130,{FH} 0,{FH}" fill="url(#blueSplat)" opacity="0.85"/>
      <polygon points="{FW},0 {FW-260},0 {FW-130},{FH} {FW},{FH}" fill="url(#redSplat)" opacity="0.85"/>
      <g transform="translate(160 250)">
        <rect x="-95" y="-130" width="190" height="260" rx="20" fill="#EEF1FB" stroke="#050916" stroke-width="6"/>
        <rect x="-80" y="-112" width="160" height="160" rx="10" fill="#0B1224"/>
        <path d="M0 -35 L10.5 -11 L36 -8 L17 9 L23 35 L0 21 L-23 35 L-17 9 L-36 -8 L-10.5 -11 Z" fill="#F97316"/>
      </g>
      <text x="330" y="230" fill="#F5F7FF" font-family="Helvetica, Arial" font-size="72" font-weight="800">Scan Collector</text>
      <text x="330" y="290" fill="#8B93B8" font-family="Helvetica, Arial" font-size="32">Scanne, catalogue et organise tes cartes</text>
      <text x="330" y="335" fill="#8B93B8" font-family="Helvetica, Arial" font-size="32">de collection - sport, manga et plus.</text>
    </svg>'''
    cairosvg.svg2png(bytestring=svg.encode(), write_to="store/feature_graphic.png", output_width=FW, output_height=FH)
    print("done feature_graphic")

feature_graphic()
