import 'package:flutter/material.dart';
import 'package:webos_webview/webos_webview.dart';

void main() {
  runApp(const WebOsApp());
}

class WebOsApp extends StatelessWidget {
  const WebOsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'web-os',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(useMaterial3: true).copyWith(
        colorScheme: ThemeData.dark(useMaterial3: true).colorScheme.copyWith(
          primary: const Color(0xFF9b7bff),
        ),
        scaffoldBackgroundColor: const Color(0xFF040611),
      ),
      home: const Scaffold(
        body: SafeArea(child: WebOsWebView()),
      ),
    );
  }
}
