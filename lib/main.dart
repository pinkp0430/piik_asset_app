import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  WebViewPlatform.instance ??= AndroidWebViewPlatform();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF090C10),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const PiikAssetApp());
}

class PiikAssetApp extends StatelessWidget {
  const PiikAssetApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PIIK Asset',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF090C10),
        useMaterial3: true,
      ),
      home: const MainStandbyScreen(),
    );
  }
}

class MainStandbyScreen extends StatefulWidget {
  const MainStandbyScreen({super.key});

  @override
  State<MainStandbyScreen> createState() => _MainStandbyScreenState();
}

class _MainStandbyScreenState extends State<MainStandbyScreen> {
  static const MethodChannel _nativeChannel = MethodChannel('com.antigravity.piik.asset/channel');
  late final WebViewController _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF090C10))
      ..addJavaScriptChannel(
        'AssetGlassChannel',
        onMessageReceived: (JavaScriptMessage message) {
          final assetId = message.message;
          debugPrint('Selected asset updated from JS: $assetId');
          _nativeChannel.invokeMethod('updateSelectedAsset', assetId);
        },
      )
      ..addJavaScriptChannel(
        'FetchPriceChannel',
        onMessageReceived: (JavaScriptMessage message) {
          final assetId = message.message;
          _fetchLivePriceNative(assetId);
        },
      )
      ..addJavaScriptChannel(
        'SearchStockChannel',
        onMessageReceived: (JavaScriptMessage message) {
          final query = message.message;
          _searchNaverStockNative(query);
        },
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            if (mounted) setState(() => _isLoading = true);
          },
          onPageFinished: (String url) {
            if (mounted) setState(() => _isLoading = false);
          },
          onWebResourceError: (WebResourceError error) {
            debugPrint('Page error: ${error.description}');
          },
        ),
      );

    if (_controller.platform is AndroidWebViewController) {
      AndroidWebViewController.enableDebugging(true);
      final androidController = _controller.platform as AndroidWebViewController;
      androidController.setMediaPlaybackRequiresUserGesture(false);
    }

    _loadWebApp();
  }

  Future<void> _fetchLivePriceNative(String assetId) async {
    try {
      String url = '';
      if (assetId.startsWith('gold_') || assetId.startsWith('silver_')) {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/411060';
      } else if (assetId == 'kia' || assetId == '000270') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/000270';
      } else if (assetId == 'hyundai_rotem' || assetId == '064350') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/064350';
      } else if (assetId == 'sk_hynix' || assetId == '000660') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/000660';
      } else if (assetId == 'samsung' || assetId == '005930') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/005930';
      } else if (assetId == 'hyundai' || assetId == '005380') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/005380';
      } else if (assetId == 'doosan_enerbility' || assetId == '034020') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/034020';
      } else if (assetId == 'hanwha' || assetId == '000880') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/000880';
      } else if (assetId == 'hanwha_aerospace' || assetId == '012450') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/012450';
      } else if (assetId == 'hanwha_solutions' || assetId == '009830') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/009830';
      } else if (assetId == 'hanwha_ocean' || assetId == '042660') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/042660';
      } else if (assetId == 'posco_holdings' || assetId == '005490') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/005490';
      } else if (assetId == 'posco_futurem' || assetId == '003670') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/003670';
      } else if (assetId == 'posco_intl' || assetId == '047050') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/047050';
      } else if (assetId == 'posco_dx' || assetId == '022100') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/022100';
      } else if (assetId == 'lg_energy' || assetId == '373220') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/373220';
      } else if (assetId == 'naver' || assetId == '035420') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/035420';
      } else if (assetId == 'kakao' || assetId == '035720') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/035720';
      } else if (assetId == 'celltrion' || assetId == '068270') {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/068270';
      } else if (RegExp(r'^\d{6}$').hasMatch(assetId)) {
        url = 'https://polling.finance.naver.com/api/realtime/domestic/stock/$assetId';
      } else if (assetId == 'sldp') {
        url = 'https://api.stock.naver.com/stock/SLDP.O/basic';
      } else if (assetId == 'tsla') {
        url = 'https://api.stock.naver.com/stock/TSLA.O/basic';
      } else if (assetId == 'aapl') {
        url = 'https://api.stock.naver.com/stock/AAPL.O/basic';
      } else if (assetId == 'nvda') {
        url = 'https://api.stock.naver.com/stock/NVDA.O/basic';
      } else if (assetId == 'msft') {
        url = 'https://api.stock.naver.com/stock/MSFT.O/basic';
      } else if (assetId == 'pltr') {
        url = 'https://api.stock.naver.com/stock/PLTR.N/basic';
      } else if (assetId == 'ionq') {
        url = 'https://api.stock.naver.com/stock/IONQ.N/basic';
      } else if (assetId.contains('.')) {
        url = 'https://api.stock.naver.com/stock/${assetId.toUpperCase()}/basic';
      } else {
        // 모든 가상자산 코인 (Upbit KRW 300+종 연동)
        final marketSymbol = assetId.toUpperCase().startsWith('KRW-') ? assetId.toUpperCase() : 'KRW-${assetId.toUpperCase()}';
        url = 'https://api.upbit.com/v1/ticker?markets=$marketSymbol';
      }

      if (url.isNotEmpty) {
        final response = await http.get(
          Uri.parse(url),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
          },
        ).timeout(const Duration(seconds: 5));

        if (response.statusCode == 200) {
          await _controller.runJavaScript("if(window.onLivePriceDataReceived) window.onLivePriceDataReceived('$assetId', ${response.body});");
          final mappedCode = _getMappedStockCode(assetId);
          if (mappedCode != null && mappedCode != assetId) {
            await _controller.runJavaScript("if(window.onLivePriceDataReceived) window.onLivePriceDataReceived('$mappedCode', ${response.body});");
          }
        }
      }
    } catch (e) {
      debugPrint('Native fetch error for $assetId: $e');
    }
  }

  String? _getMappedStockCode(String assetId) {
    const krMap = {
      'kia': '000270',
      'hyundai_rotem': '064350',
      'sk_hynix': '000660',
      'samsung': '005930',
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
      'celltrion': '068270',
    };
    return krMap[assetId];
  }

  Future<void> _searchNaverStockNative(String query) async {
    try {
      final url = 'https://ac.stock.naver.com/ac?q=${Uri.encodeComponent(query)}&target=stock';
      final response = await http.get(
        Uri.parse(url),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
        },
      ).timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final escapedQuery = jsonEncode(query);
        await _controller.runJavaScript("if(window.onNaverStockSearchResultsReceived) window.onNaverStockSearchResultsReceived($escapedQuery, ${response.body});");
      }
    } catch (e) {
      debugPrint('Native stock search error for $query: $e');
    }
  }

  Future<void> _loadWebApp() async {
    try {
      final html = await rootBundle.loadString('assets/web/index.html');
      final css = await rootBundle.loadString('assets/web/styles.css');
      final js = await rootBundle.loadString('assets/web/app.js');

      final fullHtml = html
          .replaceFirst(
            '<link rel="stylesheet" href="styles.css">',
            '<style>\n$css\n</style>',
          )
          .replaceFirst(
            '<script src="app.js"></script>',
            '<script>\n$js\n</script>',
          );

      await _controller.loadHtmlString(fullHtml, baseUrl: 'https://localhost');
    } catch (e) {
      debugPrint('Error loading inline HTML: $e');
      await _controller.loadFlutterAsset('assets/web/index.html');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090C10),
      body: SafeArea(
        top: false,
        bottom: false,
        child: Stack(
          children: [
            WebViewWidget(controller: _controller),
            if (_isLoading)
              const Center(
                child: CircularProgressIndicator(
                  color: Color(0xFF3B82F6),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
