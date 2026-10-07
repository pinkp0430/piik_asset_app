// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';

import 'package:piik_asset_app/main.dart';

void main() {
  testWidgets('PiikAsset App smoke test', (WidgetTester tester) async {
    WebViewPlatform.instance ??= AndroidWebViewPlatform();
    // Build our app and trigger a frame.
    await tester.pumpWidget(const PiikAssetApp());

    // Verify that PiikAssetApp renders correctly.
    expect(find.byType(PiikAssetApp), findsOneWidget);
  });
}
