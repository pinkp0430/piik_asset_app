// PIIK Asset Engine (v1.0.0 Native Multi-Asset API Bridge: KR/US Stocks, Metals, Upbit 300+ Crypto)

try {
  const version = localStorage.getItem('hb_version');
  if (version !== 'v1.0.0') {
    localStorage.setItem('hb_version', 'v1.0.0');
  }
} catch (e) {
  console.warn('Storage reset warning:', e);
}

const DEFAULT_ASSETS_DATABASE = {
  // 귀금속
  'gold_24k_1don': {
    id: 'gold_24k_1don',
    category: 'metal',
    sourceText: '출처: 네이버 증권 (KRX 금현물)',
    name: '순금 시세 (24K / 1돈)',
    symbol: 'GOLD • 3.75g (Naver KRX)',
    keywords: ['금', '순금', '24k', 'gold', '금값', '1돈'],
    currency: '₩',
    isKRW: true
  },
  'gold_24k_1g': {
    id: 'gold_24k_1g',
    category: 'metal',
    sourceText: '출처: 네이버 증권 (KRX 금현물)',
    name: '순금 시세 (24K / 1g)',
    symbol: 'GOLD • 1.00g (Naver KRX)',
    keywords: ['금', '순금', '1g', 'gold'],
    currency: '₩',
    isKRW: true
  },
  'silver_1don': {
    id: 'silver_1don',
    category: 'metal',
    sourceText: '출처: 네이버 증권 (KRX 은현물)',
    name: '순은 시세 (99.9% / 1돈)',
    symbol: 'SILVER • 3.75g',
    keywords: ['은', '순은', 'silver', '은값', '1돈'],
    currency: '₩',
    isKRW: true
  },

  // 해외주식 (미국주식)
  'sldp': {
    id: 'sldp',
    category: 'stock_us',
    sourceText: '출처: 네이버 해외 증권',
    reutersCode: 'SLDP.O',
    name: '솔리드 파워 (Solid Power)',
    symbol: 'SLDP • NASDAQ',
    keywords: ['솔리드파워', '솔리드 파워', '솔리드', 'solid power', 'sldp'],
    currency: '$',
    isKRW: false
  },
  'tsla': {
    id: 'tsla',
    category: 'stock_us',
    sourceText: '출처: 네이버 해외 증권',
    reutersCode: 'TSLA.O',
    name: '테슬라 (Tesla)',
    symbol: 'TSLA • NASDAQ',
    keywords: ['테슬라', 'tesla', 'tsla'],
    currency: '$',
    isKRW: false
  },
  'aapl': {
    id: 'aapl',
    category: 'stock_us',
    sourceText: '출처: 네이버 해외 증권',
    reutersCode: 'AAPL.O',
    name: '애플 (Apple)',
    symbol: 'AAPL • NASDAQ',
    keywords: ['애플', 'apple', 'aapl', '아이폰'],
    currency: '$',
    isKRW: false
  },
  'nvda': {
    id: 'nvda',
    category: 'stock_us',
    sourceText: '출처: 네이버 해외 증권',
    reutersCode: 'NVDA.O',
    name: '엔비디아 (NVIDIA)',
    symbol: 'NVDA • NASDAQ',
    keywords: ['엔비디아', 'nvidia', 'nvda'],
    currency: '$',
    isKRW: false
  },
  'msft': {
    id: 'msft',
    category: 'stock_us',
    sourceText: '출처: 네이버 해외 증권',
    reutersCode: 'MSFT.O',
    name: '마이크로소프트 (MSFT)',
    symbol: 'MSFT • NASDAQ',
    keywords: ['마이크로소프트', '마소', 'msft'],
    currency: '$',
    isKRW: false
  },
  'pltr': {
    id: 'pltr',
    category: 'stock_us',
    sourceText: '출처: 네이버 해외 증권',
    reutersCode: 'PLTR.N',
    name: '팔란티어 (Palantir)',
    symbol: 'PLTR • NYSE',
    keywords: ['팔란티어', 'palantir', 'pltr'],
    currency: '$',
    isKRW: false
  },
  'ionq': {
    id: 'ionq',
    category: 'stock_us',
    sourceText: '출처: 네이버 해외 증권',
    reutersCode: 'IONQ.N',
    name: '아이온큐 (IONQ)',
    symbol: 'IONQ • NYSE',
    keywords: ['아이온큐', 'ionq'],
    currency: '$',
    isKRW: false
  },

  // 국내주식 (주요 종목 완벽 기본 내장)
  // 국내주식 (주요 종목 완벽 기본 내장: 6자리 네이버 종목 코드 통일)
  '000270': {
    id: '000270',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '000270',
    name: '기아',
    symbol: '000270 • 코스피',
    keywords: ['기아', '기아차', '기아자동차', 'kia', '000270'],
    currency: '₩',
    isKRW: true
  },
  '064350': {
    id: '064350',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '064350',
    name: '현대로템',
    symbol: '064350 • 코스피',
    keywords: ['현대로템', '로템', 'rotem', '064350'],
    currency: '₩',
    isKRW: true
  },
  '005930': {
    id: '005930',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '005930',
    name: '삼성전자',
    symbol: '005930 • 코스피',
    keywords: ['삼성', '삼성전자', '삼전', '005930'],
    currency: '₩',
    isKRW: true
  },
  '000660': {
    id: '000660',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '000660',
    name: 'SK하이닉스',
    symbol: '000660 • 코스피',
    keywords: ['하이닉스', 'sk하이닉스', '000660'],
    currency: '₩',
    isKRW: true
  },
  '005380': {
    id: '005380',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '005380',
    name: '현대차',
    symbol: '005380 • 코스피',
    keywords: ['현대', '현대차', '005380'],
    currency: '₩',
    isKRW: true
  },
  '034020': {
    id: '034020',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '034020',
    name: '두산에너빌리티',
    symbol: '034020 • 코스피',
    keywords: ['두산', '두산에너빌리티', '034020'],
    currency: '₩',
    isKRW: true
  },
  '000880': {
    id: '000880',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '000880',
    name: '한화',
    symbol: '000880 • 코스피',
    keywords: ['한화', 'hanwha', '000880'],
    currency: '₩',
    isKRW: true
  },
  '012450': {
    id: '012450',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '012450',
    name: '한화에어로스페이스',
    symbol: '012450 • 코스피',
    keywords: ['한화', '한화에어로스페이스', '한화에어로', '012450'],
    currency: '₩',
    isKRW: true
  },
  '009830': {
    id: '009830',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '009830',
    name: '한화솔루션',
    symbol: '009830 • 코스피',
    keywords: ['한화솔루션', '009830'],
    currency: '₩',
    isKRW: true
  },
  '042660': {
    id: '042660',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '042660',
    name: '한화오션',
    symbol: '042660 • 코스피',
    keywords: ['한화오션', '042660'],
    currency: '₩',
    isKRW: true
  },
  '005490': {
    id: '005490',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '005490',
    name: 'POSCO홀딩스',
    symbol: '005490 • 코스피',
    keywords: ['posco', '포스코', '포스코홀딩스', '005490'],
    currency: '₩',
    isKRW: true
  },
  '003670': {
    id: '003670',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '003670',
    name: '포스코퓨처엠',
    symbol: '003670 • 코스피',
    keywords: ['포스코퓨처엠', '003670'],
    currency: '₩',
    isKRW: true
  },
  '047050': {
    id: '047050',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '047050',
    name: '포스코인터내셔널',
    symbol: '047050 • 코스피',
    keywords: ['포스코인터내셔널', '047050'],
    currency: '₩',
    isKRW: true
  },
  '022100': {
    id: '022100',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '022100',
    name: '포스코DX',
    symbol: '022100 • 코스피',
    keywords: ['포스코dx', '022100'],
    currency: '₩',
    isKRW: true
  },
  '373220': {
    id: '373220',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '373220',
    name: 'LG에너지솔루션',
    symbol: '373220 • 코스피',
    keywords: ['lg에너지솔루션', '엔솔', '373220'],
    currency: '₩',
    isKRW: true
  },
  '035420': {
    id: '035420',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '035420',
    name: 'NAVER',
    symbol: '035420 • 코스피',
    keywords: ['네이버', 'naver', '035420'],
    currency: '₩',
    isKRW: true
  },
  '035720': {
    id: '035720',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '035720',
    name: '카카오',
    symbol: '035720 • 코스피',
    keywords: ['카카오', 'kakao', '035720'],
    currency: '₩',
    isKRW: true
  },
  '068270': {
    id: '068270',
    category: 'stock_kr',
    sourceText: '출처: 네이버 증권',
    naverCode: '068270',
    name: '셀트리온',
    symbol: '068270 • 코스피',
    keywords: ['셀트리온', '068270'],
    currency: '₩',
    isKRW: true
  },

  // 가상자산 (주요 인기 코인 기본 포함)
  'btc': {
    id: 'btc',
    category: 'crypto',
    sourceText: '출처: 업비트 (Upbit)',
    upbitMarket: 'KRW-BTC',
    name: '비트코인',
    symbol: 'BTC / KRW (Upbit)',
    keywords: ['비트코인', 'btc', 'bitcoin', '코인'],
    currency: '₩',
    isKRW: true
  },
  'eth': {
    id: 'eth',
    category: 'crypto',
    sourceText: '출처: 업비트 (Upbit)',
    upbitMarket: 'KRW-ETH',
    name: '이더리움',
    symbol: 'ETH / KRW (Upbit)',
    keywords: ['이더리움', 'eth', 'ethereum', '코인'],
    currency: '₩',
    isKRW: true
  },
  'xrp': {
    id: 'xrp',
    category: 'crypto',
    sourceText: '출처: 업비트 (Upbit)',
    upbitMarket: 'KRW-XRP',
    name: '리플',
    symbol: 'XRP / KRW (Upbit)',
    keywords: ['리플', '엑스알피', 'xrp', 'ripple', '코인'],
    currency: '₩',
    isKRW: true
  },
  'sol': {
    id: 'sol',
    category: 'crypto',
    sourceText: '출처: 업비트 (Upbit)',
    upbitMarket: 'KRW-SOL',
    name: '솔라나',
    symbol: 'SOL / KRW (Upbit)',
    keywords: ['솔라나', 'sol', 'solana', '코인'],
    currency: '₩',
    isKRW: true
  },
  'doge': {
    id: 'doge',
    category: 'crypto',
    sourceText: '출처: 업비트 (Upbit)',
    upbitMarket: 'KRW-DOGE',
    name: '도지코인',
    symbol: 'DOGE / KRW (Upbit)',
    keywords: ['도지코인', '도지', 'doge', 'dogecoin', '코인'],
    currency: '₩',
    isKRW: true
  },
  'shib': {
    id: 'shib',
    category: 'crypto',
    sourceText: '출처: 업비트 (Upbit)',
    upbitMarket: 'KRW-SHIB',
    name: '시바이누',
    symbol: 'SHIB / KRW (Upbit)',
    keywords: ['시바이누', '시바', 'shib', 'shiba', '코인'],
    currency: '₩',
    isKRW: true
  },
  'pepe': {
    id: 'pepe',
    category: 'crypto',
    sourceText: '출처: 업비트 (Upbit)',
    upbitMarket: 'KRW-PEPE',
    name: '페페',
    symbol: 'PEPE / KRW (Upbit)',
    keywords: ['페페', 'pepe', '코인'],
    currency: '₩',
    isKRW: true
  },
  'ada': {
    id: 'ada',
    category: 'crypto',
    sourceText: '출처: 업비트 (Upbit)',
    upbitMarket: 'KRW-ADA',
    name: '에이다',
    symbol: 'ADA / KRW (Upbit)',
    keywords: ['에이다', 'ada', 'cardano', '코인'],
    currency: '₩',
    isKRW: true
  },
  'bch': {
    id: 'bch',
    category: 'crypto',
    sourceText: '출처: 업비트 (Upbit)',
    upbitMarket: 'KRW-BCH',
    name: '비트코인캐시',
    symbol: 'BCH / KRW (Upbit)',
    keywords: ['비트코인캐시', '비캐', 'bch', 'bitcoin cash', '코인'],
    currency: '₩',
    isKRW: true
  }
};

let ASSETS_DATABASE = { ...DEFAULT_ASSETS_DATABASE };

const LEGACY_ALIAS_MAP = {
  'kia': '000270',
  'hyundai_rotem': '064350',
  'samsung': '005930',
  'sk_hynix': '000660',
  'hyundai': '005380',
  'doosan_enerbility': '034020',
  'hanwha': '000880',
  'hanwha_aerospace': '012450',
  'hanwha_solutions': '009830',
  'hanwha_ocean': '042660',
  'posco_holdings': '005490',
  'posco_futurem': '003670',
  'posco_intl': '047050',
  'posco_dx': '022100',
  'lg_energy': '373220',
  'naver': '035420',
  'kakao': '035720',
  'celltrion': '068270'
};

function getAsset(assetId) {
  if (!assetId) return ASSETS_DATABASE['gold_24k_1don'];
  const resolvedId = LEGACY_ALIAS_MAP[assetId] || assetId;
  return ASSETS_DATABASE[resolvedId] || ASSETS_DATABASE[assetId] || ASSETS_DATABASE['gold_24k_1don'];
}

async function loadUpbitMarketList() {
  try {
    const res = await fetch('https://api.upbit.com/v1/market/all');
    if (res.ok) {
      const list = await res.json();
      list.forEach(item => {
        if (item.market && item.market.startsWith('KRW-')) {
          const coinSymbol = item.market.replace('KRW-', '');
          const coinId = coinSymbol.toLowerCase();

          ASSETS_DATABASE[coinId] = {
            id: coinId,
            category: 'crypto',
            sourceText: '출처: 업비트 (Upbit)',
            upbitMarket: item.market,
            name: `${item.korean_name} (${coinSymbol})`,
            symbol: `${coinSymbol} / KRW (Upbit)`,
            keywords: [item.korean_name.toLowerCase(), item.english_name.toLowerCase(), coinSymbol.toLowerCase(), '코인'],
            currency: '₩',
            isKRW: true
          };
        }
      });
      renderFilteredAssets();
    }
  } catch (e) {
    console.warn('Upbit market list load error:', e);
  }
}

let state = {
  currentAssetId: (function() {
    const raw = localStorage.getItem('ag_selectedAsset');
    if (!raw || LEGACY_ALIAS_MAP[raw]) return 'gold_24k_1don';
    return raw;
  })(),
  recentAssetIds: (function() {
    try {
      const raw = localStorage.getItem('ag_recentAssetIds');
      if (!raw) return ['gold_24k_1don'];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return ['gold_24k_1don'];

      const cleaned = [];
      parsed.forEach(id => {
        const resolved = LEGACY_ALIAS_MAP[id] || id;
        if (resolved && !LEGACY_ALIAS_MAP[resolved] && !cleaned.includes(resolved)) {
          cleaned.push(resolved);
        }
      });
      return cleaned.length > 0 ? cleaned.slice(0, 10) : ['gold_24k_1don'];
    } catch (e) {
      return ['gold_24k_1don'];
    }
  })(),
  searchQuery: '',
  lastFetchedData: null,
  isScreenOn: true
};

const elements = {
  phoneFrame: document.getElementById('phoneFrame'),
  statusBarTime: document.getElementById('statusBarTime'),
  
  widgetCard: document.getElementById('widgetCard'),
  assetSource: document.getElementById('assetSource'),
  assetName: document.getElementById('assetName'),
  assetSymbol: document.getElementById('assetSymbol'),
  mainPrice: document.getElementById('mainPrice'),
  priceChangeBadge: document.getElementById('priceChangeBadge'),
  changeIcon: document.getElementById('changeIcon'),
  changeAmount: document.getElementById('changeAmount'),
  changePercent: document.getElementById('changePercent'),
  lastUpdatedTime: document.getElementById('lastUpdatedTime'),
  instantRefreshBtn: document.getElementById('instantRefreshBtn'),

  assetOptionsGrid: document.getElementById('assetOptionsGrid'),
  searchDropdown: document.getElementById('searchDropdown'),
  searchWrapper: document.getElementById('searchWrapper'),
  searchForm: document.getElementById('searchForm'),

  assetSearchInput: document.getElementById('assetSearchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn')
};

function getKSTLocalHMS() {
  const now = new Date();
  return now.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getKSTLocalHM() {
  const now = new Date();
  return now.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false, hour: '2-digit', minute: '2-digit' });
}

function initClock() {
  function updateClock() {
    const timeHM = getKSTLocalHM();
    if (elements.statusBarTime) elements.statusBarTime.textContent = timeHM;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

function initWakeOnScreenSync() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') triggerWakeSync();
  });
  window.addEventListener('focus', () => triggerWakeSync());
}

function getStoredAssetData(assetId) {
  try {
    const cached = localStorage.getItem('ag_lastKnownAsset_' + assetId);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.warn('Cache read warning:', e);
  }
  return null;
}

function setStoredAssetData(assetId, data) {
  try {
    localStorage.setItem('ag_lastKnownAsset_' + assetId, JSON.stringify(data));
  } catch (e) {
    console.warn('Cache write warning:', e);
  }
}

function pushRecentAsset(assetId) {
  state.recentAssetIds = state.recentAssetIds.filter(id => id !== assetId);
  state.recentAssetIds.unshift(assetId);
  if (state.recentAssetIds.length > 10) {
    state.recentAssetIds = state.recentAssetIds.slice(0, 10);
  }
  localStorage.setItem('ag_recentAssetIds', JSON.stringify(state.recentAssetIds));
}

function renderOfflineState(asset) {
  const targetAsset = asset || getAsset(state.currentAssetId) || ASSETS_DATABASE['gold_24k_1don'];
  const cached = getStoredAssetData(targetAsset.id) || getStoredAssetData(targetAsset.naverCode) || getStoredAssetData(targetAsset.reutersCode);

  document.getElementById('assetSource').textContent = targetAsset.sourceText || '출처: 네이버 증권';
  document.getElementById('assetName').textContent = targetAsset.name || '종목 시세';
  document.getElementById('assetSymbol').textContent = targetAsset.symbol || '';

  if (cached) {
    cached.isOffline = true;
    cached.asset = targetAsset;
    renderWidgetUI(cached);
  } else {
    document.getElementById('mainPrice').textContent = '--';
    document.getElementById('changeIcon').textContent = '•';
    document.getElementById('changeAmount').textContent = '--';
    document.getElementById('changePercent').textContent = '';
    
    const timeEl = document.getElementById('lastUpdatedTime');
    if (timeEl) {
      timeEl.innerHTML = `<span style="color: #FFB020; font-weight: 700;">⚠️ 네트워크 연결 필요</span> (시세 수신 대기 중)`;
    }
  }
}

window.onLivePriceDataReceived = function(assetId, rawData) {
  try {
    let asset = ASSETS_DATABASE[assetId];
    if (!asset) {
      asset = Object.values(ASSETS_DATABASE).find(a => a.naverCode === assetId || a.reutersCode === assetId || a.id === assetId);
    }
    if (!asset && /^\d{6}$/.test(assetId)) {
      asset = {
        id: assetId,
        category: 'stock_kr',
        sourceText: '출처: 네이버 증권',
        naverCode: assetId,
        name: `종목 (${assetId})`,
        symbol: `${assetId} • KOSPI`,
        currency: '₩',
        isKRW: true
      };
      ASSETS_DATABASE[assetId] = asset;
    }
    if (!asset) return;

    let data = rawData;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
      } catch (e) {
        console.warn('JSON parse warning:', e);
      }
    }

    let currentPrice = null;
    let changeVal = 0;
    let changePct = 0;
    let isUp = true;

    if (asset.category === 'stock_us') {
      if (data) {
        const pStr = data.closePriceRaw !== undefined ? data.closePriceRaw : data.closePrice;
        const cStr = data.compareToPreviousClosePriceRaw !== undefined ? data.compareToPreviousClosePriceRaw : (data.compareToPreviousClosePrice || "0");
        const rStr = data.fluctuationsRatioRaw !== undefined ? data.fluctuationsRatioRaw : (data.fluctuationsRatio || "0");
        if (pStr !== undefined && pStr !== null) {
          currentPrice = parseFloat(String(pStr).replace(/,/g, ''));
          changeVal = parseFloat(String(cStr).replace(/,/g, ''));
          changePct = parseFloat(String(rStr).replace(/,/g, ''));
          isUp = changeVal >= 0;
        }
      }
    } else if (asset.category === 'stock_kr') {
      if (data && data.datas && data.datas.length > 0) {
        const item = data.datas[0];
        if (item.stockName) asset.name = item.stockName;
        currentPrice = parseFloat(String(item.closePriceRaw).replace(/,/g, ''));
        changeVal = parseFloat(String(item.compareToPreviousClosePriceRaw).replace(/,/g, ''));
        changePct = parseFloat(String(item.fluctuationsRatioRaw).replace(/,/g, ''));
        isUp = changeVal >= 0;
      }
    } else if (asset.category === 'metal') {
      if (data && data.datas && data.datas.length > 0) {
        const item = data.datas[0];
        const rawPrice = parseFloat(String(item.closePriceRaw).replace(/,/g, ''));
        const rawChange = parseFloat(String(item.compareToPreviousClosePriceRaw).replace(/,/g, ''));
        changePct = parseFloat(String(item.fluctuationsRatioRaw).replace(/,/g, ''));
        isUp = rawChange >= 0;

        if (asset.id === 'gold_24k_1don') {
          currentPrice = Math.round(rawPrice * 26.818);
          changeVal = Math.round(rawChange * 26.818);
        } else if (asset.id === 'gold_24k_1g') {
          currentPrice = Math.round(rawPrice * 7.15);
          changeVal = Math.round(rawChange * 7.15);
        } else if (asset.id === 'silver_1don') {
          currentPrice = Math.round(rawPrice * 0.33);
          changeVal = Math.round(rawChange * 0.33);
        }
      }
    } else if (asset.category === 'crypto') {
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        currentPrice = item.trade_price;
        changeVal = item.signed_change_price;
        changePct = item.signed_change_rate * 100;
        isUp = changeVal >= 0;
      }
    }

    if (currentPrice !== null && !isNaN(currentPrice) && currentPrice > 0) {
      const payload = {
        asset: asset,
        currentPrice: currentPrice,
        changeVal: changeVal,
        changePct: changePct,
        isUp: isUp,
        timestamp: getKSTLocalHMS(),
        isOffline: false
      };
      setStoredAssetData(asset.id, payload);
      setStoredAssetData(assetId, payload);
      if (asset.naverCode) setStoredAssetData(asset.naverCode, payload);
      renderWidgetUI(payload);
    }
  } catch (e) {
    console.error('Error handling live price data:', e);
  }
};

async function fetchNaverAndUpbitPrice(assetId) {
  const asset = ASSETS_DATABASE[assetId] || ASSETS_DATABASE['gold_24k_1don'];

  if (!navigator.onLine) {
    renderOfflineState(asset);
    return getStoredAssetData(assetId);
  }

  if (window.FetchPriceChannel) {
    window.FetchPriceChannel.postMessage(assetId);
  }

  let currentPrice = null;
  let changeVal = 0;
  let changePct = 0.0;
  let isUp = true;

  try {
    if (asset.category === 'stock_us' && asset.reutersCode) {
      const res = await fetch(`https://api.stock.naver.com/stock/${asset.reutersCode}/basic`);
      if (res.ok) {
        const data = await res.json();
        const pStr = data.closePriceRaw !== undefined ? data.closePriceRaw : data.closePrice;
        const cStr = data.compareToPreviousClosePriceRaw !== undefined ? data.compareToPreviousClosePriceRaw : (data.compareToPreviousClosePrice || "0");
        const rStr = data.fluctuationsRatioRaw !== undefined ? data.fluctuationsRatioRaw : (data.fluctuationsRatio || "0");
        if (pStr !== undefined && pStr !== null) {
          currentPrice = parseFloat(String(pStr).replace(/,/g, ''));
          changeVal = parseFloat(String(cStr).replace(/,/g, ''));
          changePct = parseFloat(String(rStr).replace(/,/g, ''));
          isUp = changeVal >= 0;
        }
      }
    } else if (asset.category === 'stock_kr' && asset.naverCode) {
      const res = await fetch(`https://polling.finance.naver.com/api/realtime/domestic/stock/${asset.naverCode}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.datas && data.datas.length > 0) {
          const item = data.datas[0];
          currentPrice = parseFloat(String(item.closePriceRaw).replace(/,/g, ''));
          changeVal = parseFloat(String(item.compareToPreviousClosePriceRaw).replace(/,/g, ''));
          changePct = parseFloat(String(item.fluctuationsRatioRaw).replace(/,/g, ''));
          isUp = changeVal >= 0;
        }
      }
    } else if (asset.category === 'metal') {
      const res = await fetch(`https://polling.finance.naver.com/api/realtime/domestic/stock/411060`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.datas && data.datas.length > 0) {
          const item = data.datas[0];
          const rawPrice = parseFloat(String(item.closePriceRaw).replace(/,/g, ''));
          const rawChange = parseFloat(String(item.compareToPreviousClosePriceRaw).replace(/,/g, ''));
          changePct = parseFloat(String(item.fluctuationsRatioRaw).replace(/,/g, ''));
          isUp = rawChange >= 0;

          if (asset.id === 'gold_24k_1don') {
            currentPrice = Math.round(rawPrice * 26.818);
            changeVal = Math.round(rawChange * 26.818);
          } else if (asset.id === 'gold_24k_1g') {
            currentPrice = Math.round(rawPrice * 7.15);
            changeVal = Math.round(rawChange * 7.15);
          } else if (asset.id === 'silver_1don') {
            currentPrice = Math.round(rawPrice * 0.33);
            changeVal = Math.round(rawChange * 0.33);
          }
        }
      }
    } else if (asset.category === 'crypto') {
      const marketCode = asset.upbitMarket || `KRW-${asset.id.toUpperCase()}`;
      const res = await fetch(`https://api.upbit.com/v1/ticker?markets=${marketCode}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const item = data[0];
          currentPrice = item.trade_price;
          changeVal = item.signed_change_price;
          changePct = item.signed_change_rate * 100;
          isUp = changeVal >= 0;
        }
      }
    }
  } catch (e) {
    console.warn('API fetch warning:', e);
  }

  if (currentPrice && currentPrice > 0) {
    const payload = {
      asset: asset,
      currentPrice: currentPrice,
      changeVal: changeVal,
      changePct: changePct,
      isUp: isUp,
      timestamp: getKSTLocalHMS(),
      isOffline: false
    };
    setStoredAssetData(assetId, payload);
    return payload;
  } else {
    if (!window.FetchPriceChannel) {
      renderOfflineState(asset);
    }
    return getStoredAssetData(assetId) || getStoredAssetData(asset.id);
  }
}

async function triggerWakeSync() {
  if (!state.isScreenOn) return;

  const syncIcon = document.querySelector('.sync-icon');
  if (syncIcon) syncIcon.classList.add('spinning');

  const data = await fetchNaverAndUpbitPrice(state.currentAssetId);
  if (data) {
    state.lastFetchedData = data;
    renderWidgetUI(data);
  }

  if (syncIcon) syncIcon.classList.remove('spinning');
}

function renderWidgetUI(data) {
  const { asset, currentPrice, changeVal, changePct, isUp, timestamp, isOffline } = data;

  document.getElementById('assetSource').textContent = asset.sourceText || '출처: 네이버 증권';
  document.getElementById('assetName').textContent = asset.name;
  document.getElementById('assetSymbol').textContent = asset.symbol;

  const currencySymbol = asset.currency || (asset.isKRW ? '₩' : '$');
  const currencySpan = document.querySelector('.currency-symbol');
  if (currencySpan) currencySpan.textContent = currencySymbol;

  const formattedPrice = asset.isKRW ? Math.round(currentPrice).toLocaleString('ko-KR') : currentPrice.toFixed(2);
  const priceEl = document.getElementById('mainPrice');
  if (priceEl.textContent !== formattedPrice) {
    priceEl.textContent = formattedPrice;
    priceEl.classList.remove('pulse-active');
    void priceEl.offsetHeight;
    priceEl.classList.add('pulse-active');
  }

  const sign = isUp ? '+' : '';
  const icon = isUp ? '▲' : '▼';
  
  document.getElementById('changeIcon').textContent = icon;
  
  if (asset.isKRW) {
    document.getElementById('changeAmount').textContent = `${sign}${Math.round(changeVal).toLocaleString('ko-KR')}`;
  } else {
    document.getElementById('changeAmount').textContent = `${sign}${changeVal.toFixed(2)}`;
  }
  
  document.getElementById('changePercent').textContent = `(${sign}${changePct.toFixed(2)}%)`;

  const badgeEl = document.getElementById('priceChangeBadge');
  if (isUp) {
    badgeEl.classList.remove('down');
  } else {
    badgeEl.classList.add('down');
  }

  const timeEl = document.getElementById('lastUpdatedTime');
  const isCurrentlyOffline = isOffline || !navigator.onLine;
  if (timeEl) {
    if (isCurrentlyOffline) {
      timeEl.innerHTML = `<span style="color: #FFB020; font-weight: 700;">⚠️ 네트워크 연결 필요</span> (마지막 갱신: ${timestamp || '기록 없음'})`;
    } else {
      timeEl.textContent = `마지막 갱신 시각: ${timestamp}`;
    }
  }
}

function selectAsset(assetId) {
  const resolvedId = LEGACY_ALIAS_MAP[assetId] || assetId;
  state.currentAssetId = resolvedId;
  localStorage.setItem('ag_selectedAsset', resolvedId);
  pushRecentAsset(resolvedId);

  state.searchQuery = '';
  if (elements.assetSearchInput) elements.assetSearchInput.value = '';
  if (elements.clearSearchBtn) elements.clearSearchBtn.classList.add('hidden');

  const cached = getStoredAssetData(resolvedId);
  if (cached) {
    renderWidgetUI(cached);
  } else {
    const asset = getAsset(resolvedId);
    if (asset) {
      document.getElementById('assetSource').textContent = asset.sourceText || '출처: 네이버 증권';
      document.getElementById('assetName').textContent = asset.name;
      document.getElementById('assetSymbol').textContent = asset.symbol;
      document.getElementById('mainPrice').textContent = '--';
      document.getElementById('changeIcon').textContent = '•';
      document.getElementById('changeAmount').textContent = '--';
      document.getElementById('changePercent').textContent = '(수신중...)';
      document.getElementById('lastUpdatedTime').textContent = '⚡ 실시간 시세 수신 중...';
    }
  }

  if (window.AssetGlassChannel) {
    window.AssetGlassChannel.postMessage(resolvedId);
  }

  triggerWakeSync();
  renderFilteredAssets();
  hideDropdown();

  if (elements.assetSearchInput) elements.assetSearchInput.blur();
}

function hideDropdown() {
  if (elements.searchDropdown) {
    elements.searchDropdown.innerHTML = '';
    elements.searchDropdown.classList.add('hidden');
  }
}

async function updateSearchDropdown(query) {
  if (!elements.searchDropdown) return;
  const q = query.trim().toLowerCase();

  if (q.length < 1) {
    hideDropdown();
    return;
  }

  const seenKeys = new Set();
  const matchedLocal = [];

  const resolveCode = (c) => (c ? (LEGACY_ALIAS_MAP[c.toLowerCase()] || c.toLowerCase()) : '');
  const cleanName = (n) => (n || '').replace(/[\s\(\)\d]/g, '').toLowerCase();

  Object.values(ASSETS_DATABASE).forEach(asset => {
    const codeKey = resolveCode(asset.naverCode || asset.reutersCode || asset.id);
    const nameKey = cleanName(asset.name);

    if (seenKeys.has(codeKey) || (nameKey && seenKeys.has(nameKey))) return;

    const nameMatch = asset.name && asset.name.toLowerCase().includes(q);
    const symbolMatch = asset.symbol && asset.symbol.toLowerCase().includes(q);
    const keywordMatch = asset.keywords && asset.keywords.some(k => k.toLowerCase().includes(q));

    if (nameMatch || symbolMatch || keywordMatch) {
      seenKeys.add(codeKey);
      if (nameKey) seenKeys.add(nameKey);
      matchedLocal.push(asset);
    }
  });

  elements.searchDropdown.innerHTML = '';

  matchedLocal.slice(0, 10).forEach(asset => {
    const codeKey = asset.naverCode || asset.reutersCode || asset.id;

    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.dataset.assetId = asset.id;
    item.dataset.stockCode = codeKey;
    item.dataset.stockName = asset.name ? asset.name.toLowerCase() : '';

    item.innerHTML = `
      <div class="dd-title">${asset.name} (${asset.naverCode || asset.id})</div>
      <div class="dd-sub">${asset.symbol}</div>
    `;
    item.addEventListener('click', () => {
      selectAsset(asset.id);
    });
    elements.searchDropdown.appendChild(item);
  });

  if (elements.searchDropdown.children.length > 0) {
    elements.searchDropdown.classList.remove('hidden');
  } else {
    hideDropdown();
  }

  if (window.SearchStockChannel) {
    window.SearchStockChannel.postMessage(q);
  } else {
    try {
      const res = await fetch(`https://ac.stock.naver.com/ac?q=${encodeURIComponent(q)}&target=stock`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.items) {
          window.onNaverStockSearchResultsReceived(q, data);
        }
      }
    } catch (e) {
      console.warn('Naver autocomplete fetch error:', e);
    }
  }
}

window.onNaverStockSearchResultsReceived = function(query, data) {
  if (!elements.searchDropdown) return;
  if (!data || !data.items || data.items.length === 0) return;

  const currentQuery = state.searchQuery.trim().toLowerCase();
  if (currentQuery !== query.trim().toLowerCase()) return;

  const resolveCode = (c) => (c ? (LEGACY_ALIAS_MAP[c.toLowerCase()] || c.toLowerCase()) : '');
  const cleanName = (n) => (n || '').replace(/[\s\(\)\d]/g, '').toLowerCase();

  data.items.forEach(stk => {
    const isUS = stk.nationCode === 'USA' || (stk.reutersCode && (stk.reutersCode.endsWith('.O') || stk.reutersCode.endsWith('.N') || stk.reutersCode.endsWith('.AM')));
    const stockCode = stk.code;
    const assetId = isUS ? (stk.reutersCode ? stk.reutersCode.toLowerCase() : stockCode) : stockCode;
    const stockNameLower = stk.name ? stk.name.toLowerCase() : '';

    let displayTypeName = stk.typeName || '코스피';
    if (displayTypeName === 'KOSPI') displayTypeName = '코스피';
    if (displayTypeName === 'KOSDAQ') displayTypeName = '코스닥';

    let exists = false;
    Array.from(elements.searchDropdown.children).forEach(child => {
      const childAssetId = resolveCode(child.dataset.assetId);
      const childStockCode = resolveCode(child.dataset.stockCode);
      const childStockName = cleanName(child.dataset.stockName);

      const targetAssetId = resolveCode(assetId);
      const targetStockCode = resolveCode(stockCode);
      const targetStockName = cleanName(stockNameLower);

      if (
        childAssetId === targetAssetId ||
        childStockCode === targetStockCode ||
        (childAssetId && targetStockCode && childAssetId === targetStockCode) ||
        (childStockCode && targetAssetId && childStockCode === targetAssetId) ||
        (childStockName && targetStockName && (childStockName === targetStockName || childStockName.includes(targetStockName) || targetStockName.includes(childStockName)))
      ) {
        exists = true;
      }
    });

    if (exists) return;

    if (!ASSETS_DATABASE[assetId]) {
      if (isUS) {
        ASSETS_DATABASE[assetId] = {
          id: assetId,
          category: 'stock_us',
          sourceText: '출처: 네이버 해외 증권',
          reutersCode: stk.reutersCode || assetId.toUpperCase(),
          name: `${stk.name} (${stk.code})`,
          symbol: `${stk.reutersCode || stk.code} • ${displayTypeName}`,
          keywords: [stk.name.toLowerCase(), stk.code.toLowerCase()],
          currency: '$',
          isKRW: false
        };
      } else {
        ASSETS_DATABASE[assetId] = {
          id: assetId,
          category: 'stock_kr',
          sourceText: '출처: 네이버 증권',
          naverCode: stk.code,
          name: stk.name,
          symbol: `${stk.code} • ${displayTypeName}`,
          keywords: [stk.name.toLowerCase(), stk.code.toLowerCase()],
          currency: '₩',
          isKRW: true
        };
      }
    }

    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.dataset.assetId = assetId;
    item.dataset.stockCode = stockCode;
    item.dataset.stockName = stockNameLower;

    item.innerHTML = `
      <div class="dd-title">${stk.name} (${stk.code})</div>
      <div class="dd-sub">${isUS ? (stk.reutersCode || stk.code) : stk.code} • ${displayTypeName}</div>
    `;
    item.addEventListener('click', () => {
      selectAsset(assetId);
    });
    elements.searchDropdown.appendChild(item);
  });

  if (elements.searchDropdown.children.length > 0) {
    elements.searchDropdown.classList.remove('hidden');
  }
};

function createAssetCard(asset) {
  const card = document.createElement('div');
  card.className = `asset-option-card ${asset.id === state.currentAssetId ? 'selected' : ''}`;
  
  const cached = getStoredAssetData(asset.id);
  let miniPriceStr = '';
  if (cached && cached.currentPrice) {
    const sym = asset.currency || (asset.isKRW ? '₩' : '$');
    const valStr = asset.isKRW ? Math.round(cached.currentPrice).toLocaleString('ko-KR') : cached.currentPrice.toFixed(2);
    miniPriceStr = ` • ${sym}${valStr}`;
  }

  card.innerHTML = `
    <div class="opt-title">${asset.name}</div>
    <div class="opt-sub">${asset.symbol}${miniPriceStr}</div>
  `;

  card.addEventListener('click', () => {
    selectAsset(asset.id);
  });

  return card;
}

function renderFilteredAssets() {
  if (!elements.assetOptionsGrid) return;
  elements.assetOptionsGrid.innerHTML = '';
  
  const query = state.searchQuery.trim().toLowerCase();
  const seenKeys = new Set();

  if (!query) {
    const recentIds = state.recentAssetIds.slice(0, 10);
    recentIds.forEach(id => {
      const asset = getAsset(id);
      if (asset) {
        const uniqueKey = asset.naverCode || asset.reutersCode || asset.id;
        if (!seenKeys.has(uniqueKey)) {
          seenKeys.add(uniqueKey);
          elements.assetOptionsGrid.appendChild(createAssetCard(asset));
        }
      }
    });
    return;
  }

  const allAssets = Object.values(ASSETS_DATABASE);
  allAssets.forEach(asset => {
    const uniqueKey = asset.naverCode || asset.reutersCode || asset.id;
    const nameKey = asset.name ? asset.name.toLowerCase() : '';

    if (seenKeys.has(uniqueKey) || (nameKey && seenKeys.has(nameKey))) return;

    const nameMatch = asset.name && asset.name.toLowerCase().includes(query);
    const symbolMatch = asset.symbol && asset.symbol.toLowerCase().includes(query);
    const keywordMatch = asset.keywords && asset.keywords.some(k => k.toLowerCase().includes(query));

    if (nameMatch || symbolMatch || keywordMatch) {
      seenKeys.add(uniqueKey);
      if (nameKey) seenKeys.add(nameKey);
      elements.assetOptionsGrid.appendChild(createAssetCard(asset));
    }
  });
}

function initEvents() {
  const handleSearchExecute = (e) => {
    if (e) e.preventDefault();
    const q = state.searchQuery.trim().toLowerCase();
    if (!q) return;

    const allAssets = Object.values(ASSETS_DATABASE);
    const matched = allAssets.filter(asset => {
      const nameMatch = asset.name.toLowerCase().includes(q);
      const symbolMatch = asset.symbol.toLowerCase().includes(q);
      const keywordMatch = asset.keywords && asset.keywords.some(k => k.toLowerCase().includes(q));
      return nameMatch || symbolMatch || keywordMatch;
    });

    if (matched.length > 0) {
      selectAsset(matched[0].id);
    }

    if (elements.assetSearchInput) {
      elements.assetSearchInput.blur();
    }
    hideDropdown();
  };

  if (elements.searchForm) {
    elements.searchForm.addEventListener('submit', handleSearchExecute);
  }

  const rightSearchBtn = document.getElementById('rightSearchBtn');
  if (rightSearchBtn) {
    rightSearchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleSearchExecute(e);
    });
  }

  if (elements.assetSearchInput) {
    elements.assetSearchInput.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.assetSearchInput.focus();
    });

    elements.assetSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (state.searchQuery) {
        if (elements.clearSearchBtn) elements.clearSearchBtn.classList.remove('hidden');
      } else {
        if (elements.clearSearchBtn) elements.clearSearchBtn.classList.add('hidden');
      }
      renderFilteredAssets();
      updateSearchDropdown(state.searchQuery);
    });

    elements.assetSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        handleSearchExecute(e);
      }
    });
  }

  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.addEventListener('click', () => {
      state.searchQuery = '';
      if (elements.assetSearchInput) elements.assetSearchInput.value = '';
      elements.clearSearchBtn.classList.add('hidden');
      renderFilteredAssets();
      hideDropdown();
    });
  }

  if (elements.instantRefreshBtn) {
    elements.instantRefreshBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerWakeSync();
      const currentAsset = ASSETS_DATABASE[state.currentAssetId] || ASSETS_DATABASE['gold_24k_1don'];
      sendNativeNotification('PIIK Asset 시세 갱신', `${currentAsset.name} 실시간 시세를 갱신했습니다.`);
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchWrapper')) {
      hideDropdown();
    }
  });
}

function sendNativeNotification(title, body) {
  try {
    if (window.NotificationChannel && window.NotificationChannel.postMessage) {
      window.NotificationChannel.postMessage(JSON.stringify({ title: title, body: body }));
    }
  } catch (err) {
    console.error('Notification error:', err);
  }
}
window.sendNativeNotification = sendNativeNotification;

window.notifyCurrentPrice = async function() {
  let data = await fetchNaverAndUpbitPrice(state.currentAssetId);
  if (!data) {
    data = getStoredAssetData(state.currentAssetId);
  }
  
  if (data && data.asset) {
    const asset = data.asset;
    const currentPrice = data.currentPrice;
    const isUp = data.isUp;
    const changePct = data.changePct;
    
    const currencySymbol = asset.currency || (asset.isKRW ? '₩' : '$');
    const formattedPrice = asset.isKRW ? Math.round(currentPrice).toLocaleString('ko-KR') : currentPrice.toFixed(2);
    const sign = isUp ? '+' : '';
    const icon = isUp ? '▲' : '▼';
    
    const title = `${asset.name}`;
    const body = `현재가: ${currencySymbol}${formattedPrice} (${icon} ${sign}${changePct.toFixed(2)}%)`;
    
    sendNativeNotification(title, body);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initEvents();
  initWakeOnScreenSync();
  loadUpbitMarketList();

  const currentAsset = ASSETS_DATABASE[state.currentAssetId] || ASSETS_DATABASE['gold_24k_1don'];
  const cached = getStoredAssetData(state.currentAssetId);
  if (cached) {
    renderWidgetUI(cached);
  } else {
    document.getElementById('assetSource').textContent = currentAsset.sourceText || '출처: 네이버 증권';
    document.getElementById('assetName').textContent = currentAsset.name;
    document.getElementById('assetSymbol').textContent = currentAsset.symbol;
  }

  renderFilteredAssets();
  triggerWakeSync();

  setInterval(() => {
    if (state.isScreenOn && document.visibilityState === 'visible') {
      triggerWakeSync();
    }
  }, 10000);
});
