package com.antigravity.piik.asset

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.Executors

class PiikAssetNotificationService : Service() {

    private val CHANNEL_ID = "piik_asset_live_notification"
    private val NOTIFICATION_ID = 1001
    private val executor = Executors.newSingleThreadScheduledExecutor()
    private val handler = Handler(Looper.getMainLooper())

    private val screenReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == Intent.ACTION_SCREEN_ON || intent?.action == Intent.ACTION_USER_PRESENT) {
                fetchAndRefreshNotification()
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()

        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_SCREEN_ON)
            addAction(Intent.ACTION_USER_PRESENT)
        }
        registerReceiver(screenReceiver, filter)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        fetchAndRefreshNotification()
        return START_STICKY
    }

    private fun fetchAndRefreshNotification() {
        val prefs = getSharedPreferences("AssetGlassPrefs", Context.MODE_PRIVATE)
        val cachePrefs = getSharedPreferences("AssetGlassLastKnown", Context.MODE_PRIVATE)
        
        val selectedAssetId = prefs.getString("selected_asset_id", "gold_24k_1don") ?: "gold_24k_1don"
        val customName = prefs.getString("selected_asset_name", null)
        val customCode = prefs.getString("selected_asset_code", null)

        executor.execute {
            var title = customName ?: "순금 시세 (24K / 1돈)"
            var priceStr: String? = null
            var changeStr: String? = null

            try {
                when (selectedAssetId) {
                        "gold_24k_1don", "gold_24k_1g", "silver_1don" -> {
                            title = if (selectedAssetId == "gold_24k_1don") "순금 시세 (24K / 1돈)" else if (selectedAssetId == "gold_24k_1g") "순금 시세 (24K / 1g)" else "순은 시세 (99.9% / 1돈)"
                            fetchNaverStock("411060")?.let {
                                val rawPrice = it.first.replace("₩ ", "").replace(",", "").toLongOrNull()
                                if (rawPrice != null) {
                                    val calcPrice = if (selectedAssetId == "gold_24k_1don") (rawPrice * 26.818).toLong() else if (selectedAssetId == "gold_24k_1g") (rawPrice * 7.15).toLong() else (rawPrice * 0.33).toLong()
                                    priceStr = String.format("₩ %,d", calcPrice)
                                    changeStr = it.second
                                }
                            }
                        }
                        "sk_hynix" -> {
                            title = "SK하이닉스"
                            fetchNaverStock("000660")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "samsung" -> {
                            title = "삼성전자"
                            fetchNaverStock("005930")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "hyundai" -> {
                            title = "현대차"
                            fetchNaverStock("005380")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "doosan_enerbility" -> {
                            title = "두산에너빌리티"
                            fetchNaverStock("034020")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "hanwha" -> {
                            title = "한화"
                            fetchNaverStock("000880")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "hanwha_aerospace" -> {
                            title = "한화에어로스페이스"
                            fetchNaverStock("012450")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "hanwha_solutions" -> {
                            title = "한화솔루션"
                            fetchNaverStock("009830")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "hanwha_ocean" -> {
                            title = "한화오션"
                            fetchNaverStock("042660")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "posco_holdings" -> {
                            title = "POSCO홀딩스"
                            fetchNaverStock("005490")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "posco_futurem" -> {
                            title = "포스코퓨처엠"
                            fetchNaverStock("003670")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "posco_intl" -> {
                            title = "포스코인터내셔널"
                            fetchNaverStock("047050")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "posco_dx" -> {
                            title = "포스코DX"
                            fetchNaverStock("022100")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "lg_energy" -> {
                            title = "LG에너지솔루션"
                            fetchNaverStock("373220")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "naver" -> {
                            title = "NAVER"
                            fetchNaverStock("035420")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "kakao" -> {
                            title = "카카오"
                            fetchNaverStock("035720")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "hyundai_rotem" -> {
                            title = "현대로템"
                            fetchNaverStock("064350")?.let {
                                priceStr = it.first
                                changeStr = it.second
                                if (it.third.isNotEmpty()) title = it.third
                            }
                        }
                        "kia" -> {
                            title = "기아"
                            fetchNaverStock("000270")?.let {
                                priceStr = it.first
                                changeStr = it.second
                                if (it.third.isNotEmpty()) title = it.third
                            }
                        }
                        "celltrion" -> {
                            title = "셀트리온"
                            fetchNaverStock("068270")?.let {
                                priceStr = it.first
                                changeStr = it.second
                                if (it.third.isNotEmpty()) title = it.third
                            }
                        }
                        "btc" -> {
                            title = "비트코인 (BTC)"
                            fetchUpbitCrypto("KRW-BTC")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "eth" -> {
                            title = "이더리움 (ETH)"
                            fetchUpbitCrypto("KRW-ETH")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "sldp" -> {
                            title = "솔리드 파워 (SLDP)"
                            fetchNaverUsStock("SLDP.O")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "tsla" -> {
                            title = "테슬라 (TSLA)"
                            fetchNaverUsStock("TSLA.O")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "aapl" -> {
                            title = "애플 (AAPL)"
                            fetchNaverUsStock("AAPL.O")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "nvda" -> {
                            title = "엔비디아 (NVDA)"
                            fetchNaverUsStock("NVDA.O")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "msft" -> {
                            title = "마이크로소프트 (MSFT)"
                            fetchNaverUsStock("MSFT.O")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "pltr" -> {
                            title = "팔란티어 (PLTR)"
                            fetchNaverUsStock("PLTR.N")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        "ionq" -> {
                            title = "아이온큐 (IONQ)"
                            fetchNaverUsStock("IONQ.N")?.let {
                                priceStr = it.first
                                changeStr = it.second
                            }
                        }
                        else -> {
                            val krCodeMap = mapOf(
                                "kia" to "000270",
                                "hyundai_rotem" to "064350",
                                "samsung" to "005930",
                                "sk_hynix" to "000660",
                                "hyundai" to "005380",
                                "lg_energy" to "373220",
                                "celltrion" to "068270",
                                "naver" to "035420",
                                "kakao" to "035720",
                                "doosan_enerbility" to "034020",
                                "hanwha" to "000880",
                                "hanwha_aerospace" to "012450",
                                "hanwha_solutions" to "009830",
                                "hanwha_ocean" to "042660",
                                "posco_holdings" to "005490",
                                "posco_futurem" to "003670",
                                "posco_intl" to "047050",
                                "posco_dx" to "022100"
                            )
                            val mappedKrCode = krCodeMap[selectedAssetId]

                            if (mappedKrCode != null) {
                                fetchNaverStock(mappedKrCode)?.let {
                                    priceStr = it.first
                                    changeStr = it.second
                                    if (it.third.isNotEmpty()) title = it.third
                                }
                            } else if (selectedAssetId.contains(".")) {
                                title = customName ?: "해외주식 ($selectedAssetId)"
                                fetchNaverUsStock(selectedAssetId)?.let {
                                    priceStr = it.first
                                    changeStr = it.second
                                    if (it.third.isNotEmpty()) title = it.third
                                }
                            } else if (selectedAssetId.matches(Regex("^[0-9]{6}$"))) {
                                title = customName ?: "종목 ($selectedAssetId)"
                                fetchNaverStock(selectedAssetId)?.let {
                                    priceStr = it.first
                                    changeStr = it.second
                                    if (it.third.isNotEmpty()) title = it.third
                                }
                            } else {
                                val marketCode = if (selectedAssetId.uppercase().startsWith("KRW-")) selectedAssetId.uppercase() else "KRW-${selectedAssetId.uppercase()}"
                                val cryptoResult = fetchUpbitCrypto(marketCode)
                                if (cryptoResult != null) {
                                    title = customName ?: "${selectedAssetId.uppercase()} (가상자산)"
                                    priceStr = cryptoResult.first
                                    changeStr = cryptoResult.second
                                } else {
                                    val fallbackCode = selectedAssetId.padStart(6, '0')
                                    fetchNaverStock(fallbackCode)?.let {
                                        priceStr = it.first
                                        changeStr = it.second
                                        if (it.third.isNotEmpty()) title = it.third
                                    }
                                }
                            }
                        }
                    }
            } catch (e: Exception) {
                e.printStackTrace()
            }

            val sdf = SimpleDateFormat("HH:mm:ss", Locale.KOREA)
            val timeStr = sdf.format(Date())

            handler.post {
                val notification = if (priceStr != null && changeStr != null) {
                    cachePrefs.edit()
                        .putString("last_price_$selectedAssetId", priceStr)
                        .putString("last_change_$selectedAssetId", changeStr)
                        .putString("last_time_$selectedAssetId", "$timeStr 갱신됨")
                        .apply()

                    buildLiveNotification(title, priceStr!!, changeStr!!, "$timeStr 갱신됨")
                } else {
                    val cachedPrice = cachePrefs.getString("last_price_$selectedAssetId", null)
                    val cachedChange = cachePrefs.getString("last_change_$selectedAssetId", null)
                    val cachedTime = cachePrefs.getString("last_time_$selectedAssetId", null)

                    if (cachedPrice != null && cachedChange != null) {
                        buildLiveNotification(title, cachedPrice, cachedChange, "${cachedTime ?: timeStr} (오프라인)")
                    } else {
                        buildLiveNotification(title, "₩ --", "네트워크 연결 필요", "$timeStr 오프라인")
                    }
                }

                val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.notify(NOTIFICATION_ID, notification)
            }
        }
    }

    private fun fetchNaverStock(code: String): Triple<String, String, String>? {
        return try {
            val url = URL("https://polling.finance.naver.com/api/realtime/domestic/stock/$code")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "GET"
            conn.connectTimeout = 3000
            conn.readTimeout = 3000

            if (conn.responseCode == 200) {
                val responseText = conn.inputStream.bufferedReader().use { it.readText() }
                val json = JSONObject(responseText)
                val datas = json.getJSONArray("datas")
                if (datas.length() > 0) {
                    val item = datas.getJSONObject(0)
                    val price = item.optDouble("closePriceRaw", 0.0).toLong()
                    val change = item.optDouble("compareToPreviousClosePriceRaw", 0.0).toLong()
                    val ratio = item.optDouble("fluctuationsRatioRaw", 0.0)
                    val stockName = item.optString("stockName", item.optString("itemName", ""))

                    if (price > 0) {
                        val priceStr = String.format("₩ %,d", price)
                        val sign = if (change >= 0) "+" else ""
                        val icon = if (change >= 0) "▲" else "▼"
                        val changeStr = String.format("%s %s%,d (%s%.2f%%)", icon, sign, change, sign, ratio)
                        Triple(priceStr, changeStr, stockName)
                    } else null
                } else null
            } else null
        } catch (e: Exception) {
            null
        }
    }

    private fun fetchNaverUsStock(symbol: String): Triple<String, String, String>? {
        return try {
            val url = URL("https://api.stock.naver.com/stock/$symbol/basic")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "GET"
            conn.setRequestProperty("User-Agent", "Mozilla/5.0")
            conn.connectTimeout = 3000
            conn.readTimeout = 3000

            if (conn.responseCode == 200) {
                val responseText = conn.inputStream.bufferedReader().use { it.readText() }
                val item = JSONObject(responseText)
                val priceStrRaw = item.optString("closePriceRaw", "")
                val price = if (priceStrRaw.isNotEmpty()) priceStrRaw.toDoubleOrNull() ?: 0.0 else item.optDouble("closePriceRaw", 0.0)
                val changeStrRaw = item.optString("compareToPreviousClosePriceRaw", "")
                val change = if (changeStrRaw.isNotEmpty()) changeStrRaw.toDoubleOrNull() ?: 0.0 else item.optDouble("compareToPreviousClosePriceRaw", 0.0)
                val ratioStrRaw = item.optString("fluctuationsRatioRaw", "")
                val ratio = if (ratioStrRaw.isNotEmpty()) ratioStrRaw.toDoubleOrNull() ?: 0.0 else item.optDouble("fluctuationsRatioRaw", 0.0)
                val stockName = item.optString("stockName", item.optString("symbolCode", ""))

                if (price > 0) {
                    val pStr = String.format(Locale.US, "$ %.2f", price)
                    val sign = if (change >= 0) "+" else ""
                    val icon = if (change >= 0) "▲" else "▼"
                    val cStr = String.format(Locale.US, "%s %s%.2f (%s%.2f%%)", icon, sign, change, sign, ratio)
                    Triple(pStr, cStr, stockName)
                } else null
            } else null
        } catch (e: Exception) {
            null
        }
    }

    private fun fetchUpbitCrypto(market: String): Pair<String, String>? {
        return try {
            val url = URL("https://api.upbit.com/v1/ticker?markets=$market")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "GET"
            conn.connectTimeout = 3000
            conn.readTimeout = 3000

            if (conn.responseCode == 200) {
                val responseText = conn.inputStream.bufferedReader().use { it.readText() }
                val array = org.json.JSONArray(responseText)
                if (array.length() > 0) {
                    val item = array.getJSONObject(0)
                    val price = item.optDouble("trade_price", 0.0).toLong()
                    val change = item.optDouble("signed_change_price", 0.0).toLong()
                    val ratio = item.optDouble("signed_change_rate", 0.0) * 100

                    if (price > 0) {
                        val priceStr = String.format("₩ %,d", price)
                        val sign = if (change >= 0) "+" else ""
                        val icon = if (change >= 0) "▲" else "▼"
                        val changeStr = String.format("%s %s%,d (%s%.2f%%)", icon, sign, change, sign, ratio)
                        Pair(priceStr, changeStr)
                    } else null
                } else null
            } else null
        } catch (e: Exception) {
            null
        }
    }

    private fun buildLiveNotification(title: String, priceText: String, changeText: String, timeText: String): Notification {
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("PIIK Asset • $title $priceText")
            .setContentText("$changeText  |  $timeText")
            .setSubText("실시간 시세 알림")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setOngoing(true)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_EVENT)
            .setContentIntent(pendingIntent)
            .setOnlyAlertOnce(true)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "PIIK Asset 실시간 자산 시세 알림",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "잠금화면 상시 고정 실시간 금값 주식 시세 알림 바"
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                setShowBadge(true)
            }
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        try {
            unregisterReceiver(screenReceiver)
        } catch (e: Exception) {
            e.printStackTrace()
        }
        executor.shutdown()
        super.onDestroy()
    }
}
