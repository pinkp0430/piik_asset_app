package com.antigravity.piik.asset

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.widget.RemoteViews
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.Executors

class PiikAssetWidgetProvider : AppWidgetProvider() {

    private val executor = Executors.newSingleThreadExecutor()
    private val handler = Handler(Looper.getMainLooper())

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    private fun updateAppWidget(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int
    ) {
        val views = RemoteViews(context.packageName, R.layout.piik_asset_widget)
        val prefs = context.getSharedPreferences("PiikAssetWidgetPrefs", Context.MODE_PRIVATE)

        // 클릭 시 앱이 열리는 펜딩 인텐트
        val intent = Intent(context, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

        // 백그라운드 실시간 시세 데이터 자동 조회 (네이버 SK하이닉스 000660)
        executor.execute {
            var isSuccess = false
            var assetName = prefs.getString("last_name", "SK하이닉스") ?: "SK하이닉스"
            var assetSymbol = prefs.getString("last_symbol", "000660 • KOSPI") ?: "000660 • KOSPI"
            var priceStr = prefs.getString("last_price", "1,778,000") ?: "1,778,000"
            var changeStr = prefs.getString("last_change", "▲ +133,000 (+8.09%)") ?: "▲ +133,000 (+8.09%)"
            var lastTime = prefs.getString("last_time", "") ?: ""

            try {
                val url = URL("https://polling.finance.naver.com/api/realtime/domestic/stock/000660")
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
                        if (item.has("stockName")) {
                            assetName = item.optString("stockName", "SK하이닉스")
                        }
                        val price = item.optDouble("closePriceRaw", 1778000.0).toLong()
                        val change = item.optDouble("compareToPreviousClosePriceRaw", 133000.0).toLong()
                        val ratio = item.optDouble("fluctuationsRatioRaw", 8.09)

                        priceStr = String.format("%,d", price)
                        val sign = if (change >= 0) "+" else ""
                        val icon = if (change >= 0) "▲" else "▼"
                        changeStr = String.format("%s %s%,d (%s%.2f%%)", icon, sign, change, sign, ratio)
                        
                        val sdf = SimpleDateFormat("HH:mm:ss", Locale.KOREA)
                        lastTime = sdf.format(Date())
                        isSuccess = true

                        // 성공 시 캐시 저장
                        prefs.edit()
                            .putString("last_name", assetName)
                            .putString("last_symbol", assetSymbol)
                            .putString("last_price", priceStr)
                            .putString("last_change", changeStr)
                            .putString("last_time", lastTime)
                            .apply()
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }

            handler.post {
                views.setTextViewText(R.id.widget_asset_name, assetName)
                views.setTextViewText(R.id.widget_asset_symbol, assetSymbol)
                views.setTextViewText(R.id.widget_price, priceStr)
                views.setTextViewText(R.id.widget_change_badge, changeStr)

                if (isSuccess) {
                    views.setTextViewText(R.id.widget_update_time, "$lastTime 갱신됨")
                } else {
                    val displayTime = if (lastTime.isNotEmpty()) "마지막 $lastTime" else "시세 대기 중"
                    views.setTextViewText(R.id.widget_update_time, "⚠️ 네트워크 연결 필요 ($displayTime)")
                }

                appWidgetManager.updateAppWidget(appWidgetId, views)
            }
        }
    }
}
